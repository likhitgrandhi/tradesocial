-- ─────────────────────────────────────────────────────────────────────────────
-- Migration 007: Social feed (posts, likes, follows)
--
-- Posts hold both root posts and replies. A row is a reply iff parent_post_id
-- is non-null. Reply nesting (reply-to-a-reply) is disallowed at the query
-- layer, not in SQL — Postgres CHECK constraints can't reference other rows.
--
-- Reposts are NOT implemented in v1. Schema is forward-compatible: add a
-- `quoted_post_id` column and a `kind` discriminator later without disturbing
-- existing rows.
--
-- All writes flow through the app server (service role). RLS denies direct
-- client reads/writes on every table.
-- ─────────────────────────────────────────────────────────────────────────────

-- ── posts ────────────────────────────────────────────────────────────────────
CREATE TABLE public.posts (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  body            text NOT NULL CHECK (char_length(body) BETWEEN 1 AND 500),
  trade_id        uuid REFERENCES public.trades(id) ON DELETE SET NULL,
  parent_post_id  uuid REFERENCES public.posts(id) ON DELETE CASCADE,

  like_count      integer NOT NULL DEFAULT 0,
  reply_count     integer NOT NULL DEFAULT 0,

  deleted_at      timestamptz,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

-- Feed queries: root posts, newest first, excluding deleted
CREATE INDEX idx_posts_root_feed
  ON public.posts (created_at DESC, id DESC)
  WHERE deleted_at IS NULL AND parent_post_id IS NULL;

-- Profile timeline: a user's own root posts
CREATE INDEX idx_posts_user_root
  ON public.posts (user_id, created_at DESC)
  WHERE deleted_at IS NULL AND parent_post_id IS NULL;

-- Replies for a given parent
CREATE INDEX idx_posts_replies
  ON public.posts (parent_post_id, created_at ASC)
  WHERE deleted_at IS NULL;

-- Lookup posts that reference a trade (for cleanup on trade delete)
CREATE INDEX idx_posts_trade
  ON public.posts (trade_id)
  WHERE trade_id IS NOT NULL;

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "posts: server select" ON public.posts FOR SELECT USING (false);
CREATE POLICY "posts: server insert" ON public.posts FOR INSERT WITH CHECK (false);
CREATE POLICY "posts: server update" ON public.posts FOR UPDATE USING (false);
CREATE POLICY "posts: server delete" ON public.posts FOR DELETE USING (false);

CREATE TRIGGER posts_set_updated_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

-- ── post_likes ───────────────────────────────────────────────────────────────
CREATE TABLE public.post_likes (
  post_id    uuid NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id    uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (post_id, user_id)
);

-- "Posts I've liked" ordering
CREATE INDEX idx_post_likes_user ON public.post_likes (user_id, created_at DESC);

ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "post_likes: server select" ON public.post_likes FOR SELECT USING (false);
CREATE POLICY "post_likes: server insert" ON public.post_likes FOR INSERT WITH CHECK (false);
CREATE POLICY "post_likes: server delete" ON public.post_likes FOR DELETE USING (false);

-- ── follows ──────────────────────────────────────────────────────────────────
CREATE TABLE public.follows (
  follower_id  uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  following_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at   timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (follower_id, following_id),
  CONSTRAINT follows_no_self CHECK (follower_id <> following_id)
);

CREATE INDEX idx_follows_following ON public.follows (following_id, created_at DESC);
CREATE INDEX idx_follows_follower  ON public.follows (follower_id,  created_at DESC);

ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "follows: server select" ON public.follows FOR SELECT USING (false);
CREATE POLICY "follows: server insert" ON public.follows FOR INSERT WITH CHECK (false);
CREATE POLICY "follows: server delete" ON public.follows FOR DELETE USING (false);

-- ── Trigger: post_likes → posts.like_count ───────────────────────────────────
CREATE OR REPLACE FUNCTION public.posts_like_count_tg()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.posts SET like_count = like_count + 1 WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.posts SET like_count = GREATEST(like_count - 1, 0) WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

CREATE TRIGGER post_likes_count
  AFTER INSERT OR DELETE ON public.post_likes
  FOR EACH ROW EXECUTE PROCEDURE public.posts_like_count_tg();

-- ── Trigger: posts → parent's reply_count ────────────────────────────────────
--   Bump on INSERT when row is a reply; decrement on soft-delete transition
CREATE OR REPLACE FUNCTION public.posts_reply_count_tg()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.parent_post_id IS NOT NULL THEN
    UPDATE public.posts SET reply_count = reply_count + 1 WHERE id = NEW.parent_post_id;
    RETURN NEW;
  END IF;

  IF TG_OP = 'UPDATE'
     AND OLD.deleted_at IS NULL
     AND NEW.deleted_at IS NOT NULL
     AND NEW.parent_post_id IS NOT NULL THEN
    UPDATE public.posts SET reply_count = GREATEST(reply_count - 1, 0) WHERE id = NEW.parent_post_id;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER posts_count_children
  AFTER INSERT OR UPDATE ON public.posts
  FOR EACH ROW EXECUTE PROCEDURE public.posts_reply_count_tg();

-- ── Trigger: follows → profiles.{followers_count, following_count} ───────────
CREATE OR REPLACE FUNCTION public.profiles_follow_count_tg()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.profiles SET followers_count = followers_count + 1 WHERE id = NEW.following_id;
    UPDATE public.profiles SET following_count = following_count + 1 WHERE id = NEW.follower_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.profiles SET followers_count = GREATEST(followers_count - 1, 0) WHERE id = OLD.following_id;
    UPDATE public.profiles SET following_count = GREATEST(following_count - 1, 0) WHERE id = OLD.follower_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

CREATE TRIGGER follows_profile_count
  AFTER INSERT OR DELETE ON public.follows
  FOR EACH ROW EXECUTE PROCEDURE public.profiles_follow_count_tg();

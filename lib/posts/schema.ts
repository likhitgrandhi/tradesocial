import { z } from "zod"

export const createPostSchema = z
  .object({
    body: z.string().trim().min(1).max(500),
    trade_id: z.string().uuid().optional().nullable(),
    parent_post_id: z.string().uuid().optional().nullable(),
  })
  .transform((v) => ({
    body: v.body,
    trade_id: v.trade_id || null,
    parent_post_id: v.parent_post_id || null,
  }))

export type CreatePostInput = z.infer<typeof createPostSchema>

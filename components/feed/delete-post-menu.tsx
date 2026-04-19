"use client"

import { useEffect, useRef, useState } from "react"
import { MoreHorizontal, Trash2 } from "lucide-react"

export function DeletePostMenu({
  postId,
  onDeleted,
}: {
  postId: string
  onDeleted?: () => void
}) {
  const [open, setOpen] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const [pending, setPending] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(false)
        setConfirming(false)
      }
    }
    document.addEventListener("mousedown", onClickOutside)
    return () => document.removeEventListener("mousedown", onClickOutside)
  }, [])

  async function doDelete() {
    if (pending) return
    setPending(true)
    try {
      const res = await fetch(`/api/posts/${postId}`, { method: "DELETE" })
      if (!res.ok) throw new Error("delete failed")
      onDeleted?.()
    } catch {
      // swallow
    } finally {
      setPending(false)
      setOpen(false)
      setConfirming(false)
    }
  }

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          setOpen((v) => !v)
        }}
        aria-label="Post menu"
        className="w-8 h-8 flex items-center justify-center rounded-md text-content-muted hover:text-content-primary hover:bg-surface-muted transition-colors"
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>
      {open ? (
        <div
          className="absolute right-0 top-9 w-40 rounded-[var(--radius-md)] bg-surface-raised border border-border-default shadow-lg py-1 z-30"
          onClick={(e) => e.stopPropagation()}
        >
          {confirming ? (
            <button
              type="button"
              onClick={doDelete}
              disabled={pending}
              className="w-full flex items-center gap-2 px-3 py-2 text-loss hover:bg-surface-muted transition-colors"
              style={{ fontSize: "var(--font-size-14)" }}
            >
              <Trash2 className="w-4 h-4" />
              {pending ? "Deleting…" : "Confirm delete"}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setConfirming(true)}
              className="w-full flex items-center gap-2 px-3 py-2 text-loss hover:bg-surface-muted transition-colors"
              style={{ fontSize: "var(--font-size-14)" }}
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          )}
        </div>
      ) : null}
    </div>
  )
}

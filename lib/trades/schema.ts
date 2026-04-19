import { z } from "zod"

const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000

const isoDateString = z.string().datetime({ offset: true }).or(z.string().datetime())

export const tradeMetadataSchema = z
  .object({
    strategy: z.string().max(100).optional(),
    stopLoss: z.number().positive().optional(),
    takeProfit: z.number().positive().optional(),
    thesis: z.string().max(2000).optional(),
    tags: z.array(z.string().max(40)).max(20).optional(),
  })
  .passthrough()

export const createTradeSchema = z
  .object({
    symbol: z.string().trim().min(1).max(32).transform((s) => s.toUpperCase()),
    side: z.enum(["long", "short"]),
    quantity: z.number().positive().max(1e9),
    entry_price: z.number().positive().max(1e12),
    entry_at: isoDateString.optional(),
    fees: z.number().min(0).max(1e9).default(0),
    notes: z.string().max(5000).optional(),
    metadata: tradeMetadataSchema.optional(),
  })
  .superRefine((val, ctx) => {
    if (!val.entry_at) return
    const ts = new Date(val.entry_at).getTime()
    if (Number.isNaN(ts)) {
      ctx.addIssue({ code: "custom", path: ["entry_at"], message: "Invalid date" })
      return
    }
    if (ts - Date.now() > thirtyDaysMs) {
      ctx.addIssue({
        code: "custom",
        path: ["entry_at"],
        message: "entry_at cannot be more than 30 days in the future",
      })
    }
  })

export type CreateTradeInput = z.infer<typeof createTradeSchema>

export const closeTradeSchema = z.object({
  exit_price: z.number().positive().max(1e12),
  exit_at: isoDateString.optional(),
})

export type CloseTradeInput = z.infer<typeof closeTradeSchema>

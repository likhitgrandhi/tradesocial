import { z } from "zod"

export const usernameSchema = z
  .string()
  .trim()
  .min(3)
  .max(20)
  .regex(/^[a-zA-Z0-9_]+$/, "Use letters, numbers, or underscores only")

export const assetFocusSchema = z.enum(["STOCKS", "CRYPTO", "OPTIONS", "FUTURES", "MIXED"])

export const onboardingSchema = z.object({
  username: usernameSchema,
  display_name: z.string().trim().min(1).max(40),
  asset_focus: assetFocusSchema.optional(),
})

const httpUrl = z
  .string()
  .url()
  .max(500)
  .refine((u) => /^https?:\/\//i.test(u), "Must be an http(s) URL")

export const updateProfileSchema = z.object({
  display_name: z.string().trim().min(1).max(40).optional(),
  bio: z.string().trim().max(280).optional(),
  avatar_url: httpUrl.optional().or(z.literal("")),
  asset_focus: assetFocusSchema.optional(),
})

export type OnboardingInput = z.infer<typeof onboardingSchema>
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>

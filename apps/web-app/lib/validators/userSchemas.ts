import { z } from 'zod'

export const updateUserSettingsSchema = z.strictObject({
  name: z.string().min(1).max(255).optional(),
  image: z.url().optional().nullable(),
})

export type UpdateUserSettingsInput = z.infer<typeof updateUserSettingsSchema>

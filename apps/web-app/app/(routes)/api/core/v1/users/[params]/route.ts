import { createRouteHandler } from '@/lib/auth/route-handler'
import { NextResponse } from 'next/server'
import { createUserService } from '@/lib/services/userService'
import { updateUserSettingsSchema } from '@/lib/validators/userSchemas'

export const PATCH = createRouteHandler(
  { isAuthenticated: true },
  async (req, { params }: { params: Promise<{ params: string }> }) => {
    const { params: userId } = await params
    const data = updateUserSettingsSchema.parse(await req.json())
    const user = await createUserService(req).updateUserSettings(userId, data)
    return NextResponse.json({ data: { success: true, user }, error: null })
  }
)

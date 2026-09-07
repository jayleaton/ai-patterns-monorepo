import { createRouteHandler } from '@/lib/auth/route-handler'
import { NextResponse } from 'next/server'
import { createUserService } from '@/lib/services/userService'
import { updateUserSettingsSchema } from '@/lib/validators/userSchemas'

export const GET = createRouteHandler({ isAuthenticated: true }, async req => {
  return NextResponse.json({
    data: { user: req.user, session: req.session },
    error: null,
  })
})

export const PATCH = createRouteHandler(
  { isAuthenticated: true },
  async req => {
    const data = updateUserSettingsSchema.parse(await req.json())
    const user = await createUserService(req).updateUserSettings(
      req.user.id,
      data
    )
    return NextResponse.json({ data: { success: true, user }, error: null })
  }
)

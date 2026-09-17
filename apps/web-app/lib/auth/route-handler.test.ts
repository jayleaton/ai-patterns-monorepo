import { beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandler } from './route-handler'
import { PATCH as patchCurrent } from '@/app/(routes)/api/core/v1/users/route'
import { PATCH as patchById } from '@/app/(routes)/api/core/v1/users/[params]/route'
import {
  createUserRepository,
  type UserRepository,
} from '@better-stack-monorepo/database/src/repositories/userRepository'

const { getSession } = vi.hoisted(() => ({ getSession: vi.fn() }))
vi.mock('@/lib/auth/auth', () => ({ auth: { api: { getSession } } }))

const user = {
  id: 'owner',
  name: 'Owner',
  email: 'owner@example.com',
  image: null,
}
const updateUser = vi.fn()
const context = { params: Promise.resolve({ params: 'owner' }) }
const request = (body: string) =>
  new NextRequest('https://template.example/api/core/v1/users', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body,
  })

beforeEach(() => {
  getSession.mockResolvedValue({ user, session: { id: 'session' } })
  updateUser.mockResolvedValue(user)
  vi.mocked(createUserRepository).mockReturnValue({
    updateUser,
  } as unknown as UserRepository)
})

describe('authenticated profile routes', () => {
  for (const [name, patch] of [
    ['current user', patchCurrent],
    ['user ID', patchById],
  ] as const) {
    it(`${name}: rejects unauthenticated writes`, async () => {
      getSession.mockResolvedValue(null)
      expect((await patch(request('{"name":"New"}'), context)).status).toBe(401)
      expect(updateUser).not.toHaveBeenCalled()
    })
    it(`${name}: rejects email and verification changes`, async () => {
      for (const body of [
        { email: 'victim@example.com' },
        { emailVerified: true },
      ]) {
        const response = await patch(request(JSON.stringify(body)), context)
        expect(response.status).toBe(400)
        expect(await response.json()).toEqual({
          data: null,
          error: 'Invalid request data',
        })
      }
      expect(updateUser).not.toHaveBeenCalled()
    })
    it(`${name}: rejects malformed JSON`, async () => {
      expect((await patch(request('{'), context)).status).toBe(400)
      expect(updateUser).not.toHaveBeenCalled()
    })
    it(`${name}: updates a name and clears an image`, async () => {
      const response = await patch(
        request('{"name":"New","image":null}'),
        context
      )
      expect(response.status).toBe(200)
      expect(response.headers.get('cache-control')).toBe('private, no-store')
      expect(updateUser).toHaveBeenCalledWith('owner', {
        name: 'New',
        image: null,
      })
    })
    it(`${name}: returns 404 for a deleted user`, async () => {
      updateUser.mockResolvedValue(null)
      expect((await patch(request('{"name":"New"}'), context)).status).toBe(404)
    })
  }
  it('rejects writes to another user', async () => {
    const response = await patchById(request('{"name":"New"}'), {
      params: Promise.resolve({ params: 'someone-else' }),
    })
    expect(response.status).toBe(403)
    expect(updateUser).not.toHaveBeenCalled()
  })
})

describe('route error boundary', () => {
  for (const access of [
    { isPublic: true },
    { isAuthenticated: true },
  ] as const) {
    it(`envelopes asynchronous failures for ${JSON.stringify(access)}`, async () => {
      const handler = vi.fn(async () => {
        throw new Error('private database detail')
      })
      const log = vi.spyOn(console, 'error').mockImplementation(() => {})
      const route = access.isPublic
        ? createRouteHandler(access, handler)
        : createRouteHandler(access, handler)
      const response = await route(request('{}'), context)
      expect(response.status).toBe(500)
      expect(await response.json()).toEqual({
        data: null,
        error: 'Internal server error',
      })
      log.mockRestore()
    })
  }
  it('uses the actual request headers for authentication', async () => {
    const req = request('{}')
    const route = createRouteHandler({ isAuthenticated: true }, async () =>
      NextResponse.json({ data: true, error: null })
    )
    await route(req, context)
    expect(getSession).toHaveBeenCalledWith({ headers: req.headers })
  })
})

import { afterEach, expect, it, vi } from 'vitest'
import { apiFetch } from './client'

const { getCookie } = vi.hoisted(() => ({ getCookie: vi.fn() }))
vi.mock('../auth/authClient', () => ({ authClient: { getCookie } }))
vi.mock('../config/env', () => ({
  env: { apiUrl: 'https://template.example' },
}))
afterEach(() => vi.unstubAllGlobals())

it('awaits secure storage and preserves Headers overrides', async () => {
  getCookie.mockResolvedValue('session=test')
  const fetch = vi
    .fn()
    .mockResolvedValue(Response.json({ data: { id: 'owner' }, error: null }))
  vi.stubGlobal('fetch', fetch)
  const response = await apiFetch('/api/core/v1/users', {
    headers: new Headers({ Accept: 'application/json' }),
  })
  expect(response.data).toEqual({ id: 'owner' })
  const init = fetch.mock.calls[0][1] as RequestInit
  const headers = new Headers(init.headers)
  expect(headers.get('Cookie')).toBe('session=test')
  expect(headers.get('Accept')).toBe('application/json')
  expect(init.credentials).toBe('omit')
})

it('does not attach a cookie when signed out', async () => {
  getCookie.mockResolvedValue('')
  const fetch = vi
    .fn()
    .mockResolvedValue(
      Response.json({ data: null, error: 'Unauthorized' }, { status: 401 })
    )
  vi.stubGlobal('fetch', fetch)
  expect(await apiFetch('/api/core/v1/users')).toEqual({
    data: null,
    error: 'Unauthorized',
  })
  expect(new Headers(fetch.mock.calls[0][1].headers).has('Cookie')).toBe(false)
})

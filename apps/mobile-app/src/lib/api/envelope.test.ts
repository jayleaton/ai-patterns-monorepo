import { describe, expect, it } from 'vitest'

import { ApiError, parseEnvelope } from './envelope'

describe('parseEnvelope', () => {
  it('passes through a well-formed envelope', () => {
    expect(parseEnvelope({ data: { id: '1' }, error: null })).toEqual({
      data: { id: '1' },
      error: null,
    })
  })

  it('normalizes missing data and error to null', () => {
    expect(parseEnvelope({ data: { ok: true } })).toEqual({ data: { ok: true }, error: null })
    expect(parseEnvelope({ data: null, error: 'User not found' })).toEqual({
      data: null,
      error: 'User not found',
    })
  })

  it('surfaces non-string error values as a generic message', () => {
    expect(parseEnvelope({ data: null, error: 500 })).toEqual({
      data: null,
      error: 'Unknown error',
    })
  })

  it('rejects malformed bodies without throwing', () => {
    const expected = { data: null, error: 'Malformed response from server' }
    expect(parseEnvelope(null)).toEqual(expected)
    expect(parseEnvelope('nope')).toEqual(expected)
    expect(parseEnvelope({ nope: true })).toEqual(expected)
    expect(parseEnvelope([])).toEqual(expected)
  })
})

describe('ApiError', () => {
  it('carries the status separately from the message', () => {
    const error = new ApiError('Could not reach the API', 0)
    expect(error).toBeInstanceOf(Error)
    expect(error.name).toBe('ApiError')
    expect(error.status).toBe(0)
  })
})

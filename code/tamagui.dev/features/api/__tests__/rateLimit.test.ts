import { describe, expect, it } from 'vitest'
import { FixedWindowRateLimiter } from '../rateLimit'

describe('FixedWindowRateLimiter', () => {
  it('limits a key and allows it again after the window resets', () => {
    let now = 0
    const limiter = new FixedWindowRateLimiter(2, 1_000, () => now)

    expect(limiter.check('user-1')).toMatchObject({ allowed: true, remaining: 1 })
    expect(limiter.check('user-1')).toMatchObject({ allowed: true, remaining: 0 })
    expect(limiter.check('user-1')).toMatchObject({
      allowed: false,
      remaining: 0,
      retryAfterMs: 1_000,
    })

    now = 1_000
    expect(limiter.check('user-1')).toMatchObject({ allowed: true, remaining: 1 })
    expect(limiter.check('user-2')).toMatchObject({ allowed: true, remaining: 1 })
  })
})

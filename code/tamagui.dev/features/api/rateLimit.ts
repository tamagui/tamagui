type WindowState = {
  count: number
  resetAt: number
}

export type RateLimitResult = {
  allowed: boolean
  limit: number
  remaining: number
  retryAfterMs: number
}

/**
 * A small process-local limiter for authenticated endpoints.
 * The account ID is the key, so requests from one account share a budget.
 */
export class FixedWindowRateLimiter {
  private readonly windows = new Map<string, WindowState>()

  constructor(
    private readonly limit: number,
    private readonly windowMs: number,
    private readonly now: () => number = Date.now
  ) {}

  check(key: string): RateLimitResult {
    const now = this.now()
    this.prune(now)

    const current = this.windows.get(key)
    if (!current || current.resetAt <= now) {
      this.windows.set(key, {
        count: 1,
        resetAt: now + this.windowMs,
      })

      return {
        allowed: true,
        limit: this.limit,
        remaining: Math.max(0, this.limit - 1),
        retryAfterMs: this.windowMs,
      }
    }

    if (current.count >= this.limit) {
      return {
        allowed: false,
        limit: this.limit,
        remaining: 0,
        retryAfterMs: Math.max(0, current.resetAt - now),
      }
    }

    current.count += 1

    return {
      allowed: true,
      limit: this.limit,
      remaining: Math.max(0, this.limit - current.count),
      retryAfterMs: Math.max(0, current.resetAt - now),
    }
  }

  private prune(now: number) {
    for (const [key, state] of this.windows) {
      if (state.resetAt <= now) {
        this.windows.delete(key)
      }
    }
  }
}

const themeGenerationPerMinute = new FixedWindowRateLimiter(5, 60_000)
const themeGenerationPerDay = new FixedWindowRateLimiter(50, 24 * 60 * 60_000)

export function checkThemeGenerationRateLimit(userId: string): RateLimitResult {
  const minute = themeGenerationPerMinute.check(userId)
  if (!minute.allowed) {
    return minute
  }

  const day = themeGenerationPerDay.check(userId)
  if (!day.allowed) {
    return day
  }

  return {
    allowed: true,
    limit: minute.limit,
    remaining: Math.min(minute.remaining, day.remaining),
    retryAfterMs: minute.retryAfterMs,
  }
}

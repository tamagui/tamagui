type RetryPublishOptions = {
  publish: () => Promise<void>
  isPublished: () => Promise<boolean>
  sleep: (ms: number) => Promise<unknown>
  attempts?: number
  delayMs?: number
  onRetry?: (attempt: number, delayMs: number) => void
}

export function isTransientNpmOidcError(error: unknown) {
  const message = String(error)
  return (
    /\b(?:429|5\d\d)\b[\s\S]*\/oidc\/token\/exchange/i.test(message) ||
    /\/oidc\/token\/exchange[\s\S]*\b(?:429|5\d\d)\b/i.test(message)
  )
}

export async function retryTransientNpmOidcPublish({
  publish,
  isPublished,
  sleep,
  attempts = 5,
  delayMs = 15_000,
  onRetry,
}: RetryPublishOptions) {
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      await publish()
      return
    } catch (error) {
      // npm can fail locally after the registry accepted the upload. Never
      // retry an immutable version that is already visible.
      if (await isPublished()) return

      if (!isTransientNpmOidcError(error) || attempt === attempts) {
        throw error
      }

      const wait = attempt * delayMs
      onRetry?.(attempt, wait)
      await sleep(wait)
    }
  }
}

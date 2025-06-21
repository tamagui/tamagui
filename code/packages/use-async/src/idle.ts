import { AbortError } from './errors'

const idleCb: Function =
  typeof requestIdleCallback === 'undefined'
    ? (cb: Function) => setTimeout(cb, 1)
    : requestIdleCallback

export const idle = async (signal?: AbortSignal): Promise<void> => {
  await new Promise((res) => idleCb(res))
  if (signal?.aborted) {
    throw new AbortError()
  }
}

export const fullyIdle = async (signal?: AbortSignal): Promise<void> => {
  while (true) {
    const startTime = Date.now()
    await idle(signal)
    const endTime = Date.now()
    const duration = endTime - startTime

    // If idle callback took less than 15ms, consider it truly idle
    if (duration < 15) {
      break
    }

    // Check for abort signal after each iteration
    if (signal?.aborted) {
      throw new AbortError()
    }
  }
}

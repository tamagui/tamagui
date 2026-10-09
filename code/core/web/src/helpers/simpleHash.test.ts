import { expect, test, vi } from 'vitest'

test('caches strict and readable hashes independently regardless of call order', async () => {
  const input = 'cache-order-independent-value'

  vi.resetModules()
  const strictFirstHash = (await import('@tamagui/helpers')).simpleHash
  const strictThenReadable = {
    strict: strictFirstHash(input, 'strict'),
    readable: strictFirstHash(input),
  }

  vi.resetModules()
  const readableFirstHash = (await import('@tamagui/helpers')).simpleHash
  const readable = readableFirstHash(input)
  const readableThenStrict = {
    strict: readableFirstHash(input, 'strict'),
    readable,
  }

  expect(strictThenReadable.strict).not.toBe(strictThenReadable.readable)
  expect(strictThenReadable).toEqual(readableThenStrict)
})

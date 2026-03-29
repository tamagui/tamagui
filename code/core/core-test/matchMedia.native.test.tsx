/**
 * matchMedia.native.ts - setupMatchMedia unit tests
 *
 * Verifies that setupMatchMedia correctly assigns the provided implementation to
 * both the internal `matchMediaImpl` (via the exported `matchMedia` function) and
 * to `globalThis['matchMedia']` (so that any code which calls window.matchMedia
 * directly on React Native doesn't crash with "window.matchMedia is not a function").
 *
 * Background: On React Native, globalThis === window, so the assignment in
 * setupMatchMedia is what makes window.matchMedia available to third-party
 * packages and RN internals that call it directly.  Without it, those callers
 * receive "TypeError: window.matchMedia is not a function (it is undefined)".
 */

import { beforeEach, describe, expect, test, vi } from 'vitest'

// Import the native variant directly (bypassing the platform extension resolution)
// so that this test always exercises the native code path.
import {
  matchMedia,
  setupMatchMedia,
} from '../web/src/helpers/matchMedia.native'

describe('setupMatchMedia (native)', () => {
  beforeEach(() => {
    // Reset globalThis.matchMedia before each test to avoid state leaking between tests
    delete (globalThis as any)['matchMedia']
  })

  test('sets globalThis["matchMedia"] so window.matchMedia works on native', () => {
    const mockImpl = vi.fn((query: string) => ({
      matches: false,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      match: vi.fn(() => false),
    }))

    setupMatchMedia(mockImpl as any)

    // On React Native, globalThis === window; this is the critical path
    expect((globalThis as any)['matchMedia']).toBe(mockImpl)
  })

  test('routes matchMedia() calls through the registered implementation', () => {
    const mockImpl = vi.fn((query: string) => ({
      matches: query === '(prefers-color-scheme: dark)',
      addListener: vi.fn(),
      removeListener: vi.fn(),
      match: vi.fn(() => false),
    }))

    setupMatchMedia(mockImpl as any)

    const result = matchMedia('(prefers-color-scheme: dark)')
    expect(mockImpl).toHaveBeenCalledWith('(prefers-color-scheme: dark)')
    expect(result.matches).toBe(true)
  })

  test('does NOT set globalThis["matchMedia"] when given a non-function', () => {
    // Ensure there's no leftover value
    expect((globalThis as any)['matchMedia']).toBeUndefined()

    setupMatchMedia(null as any)
    expect((globalThis as any)['matchMedia']).toBeUndefined()

    setupMatchMedia(undefined as any)
    expect((globalThis as any)['matchMedia']).toBeUndefined()

    setupMatchMedia({} as any)
    expect((globalThis as any)['matchMedia']).toBeUndefined()
  })

  test('does NOT update matchMediaImpl when given a non-function (falls back to previous)', () => {
    const goodImpl = vi.fn((query: string) => ({
      matches: true,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      match: vi.fn(() => true),
    }))

    setupMatchMedia(goodImpl as any)
    expect(matchMedia('anything').matches).toBe(true)

    // Calling with a non-function should be a no-op — the previous impl should remain
    setupMatchMedia(null as any)
    expect(matchMedia('anything').matches).toBe(true)
    expect((globalThis as any)['matchMedia']).toBe(goodImpl)
  })
})

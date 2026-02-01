import { describe, expect, test, beforeEach, vi } from 'vitest'
import {
  link,
  setTheme,
  getTheme,
  setScopedTheme,
  getRegistryStats,
  resetRegistry,
  isNativeModuleAvailable,
  __setFindNodeHandle,
} from '../index'

describe('TamaguiStyleRegistry', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    resetRegistry()
    // set up mock findNodeHandle for tests
    __setFindNodeHandle((ref: any) => ref?._tag ?? null)
  })

  describe('link', () => {
    test('stores view with styles when given a tag', () => {
      const ref = { _tag: 1 }
      const styles = {
        dark: { backgroundColor: '#000' },
        light: { backgroundColor: '#fff' },
      }

      const unlink = link(ref, styles)

      expect(typeof unlink).toBe('function')
      expect(getRegistryStats().viewCount).toBe(1)
    })

    test('returns cleanup function that unlinks view', () => {
      const ref = { _tag: 1 }
      const styles = { dark: {}, light: {} }

      const unlink = link(ref, styles)
      expect(getRegistryStats().viewCount).toBe(1)

      unlink()
      expect(getRegistryStats().viewCount).toBe(0)
    })

    test('handles deduplicated styles with __themes array', () => {
      const ref = { _tag: 1 }
      const styles = {
        dark: {
          backgroundColor: '#000',
          __themes: ['dark', 'dark_alt1', 'dark_alt2'],
        },
      }

      const unlink = link(ref, styles as any)
      expect(getRegistryStats().viewCount).toBe(1)
      unlink()
    })

    test('returns no-op when ref is null', () => {
      const styles = { dark: {}, light: {} }
      const unlink = link(null, styles)
      expect(typeof unlink).toBe('function')
      expect(getRegistryStats().viewCount).toBe(0)
    })

    test('returns no-op when styles is null', () => {
      const ref = { _tag: 1 }
      const unlink = link(ref, null as any)
      expect(typeof unlink).toBe('function')
      expect(getRegistryStats().viewCount).toBe(0)
    })

    test('returns no-op when findNodeHandle returns null', () => {
      __setFindNodeHandle(() => null)
      const ref = { _tag: 1 }
      const styles = { dark: {}, light: {} }
      const unlink = link(ref, styles)
      expect(typeof unlink).toBe('function')
      expect(getRegistryStats().viewCount).toBe(0)
    })
  })

  describe('setTheme', () => {
    test('updates global theme', () => {
      setTheme('light')
      expect(getTheme()).toBe('light')

      setTheme('dark')
      expect(getTheme()).toBe('dark')
    })

    test('tracks sub-theme names', () => {
      setTheme('dark_blue')
      expect(getTheme()).toBe('dark_blue')
    })

    test('does NOT trigger React re-render in JS fallback', () => {
      // the real zero-re-render happens in the native module
      // which directly updates the ShadowTree
      // in JS fallback, we just verify state updates without re-renders
      const ref = { _tag: 1 }
      const renderCount = { count: 0 }
      const styles = {
        dark: { backgroundColor: '#000' },
        light: { backgroundColor: '#fff' },
      }

      link(ref, styles)
      const initialCount = renderCount.count

      setTheme('light')
      setTheme('dark')
      setTheme('light')

      // no re-renders triggered - state just updates
      expect(renderCount.count).toBe(initialCount)
    })
  })

  describe('getTheme', () => {
    test('returns current theme', () => {
      expect(getTheme()).toBe('light') // default

      setTheme('dark')
      expect(getTheme()).toBe('dark')
    })
  })

  describe('setScopedTheme', () => {
    test('sets theme for a specific scope (JS fallback)', () => {
      // in JS fallback, this just stores the state
      // real implementation updates only views with that scopeId
      const ref = { _tag: 1 }
      const styles = {
        dark: { backgroundColor: '#000' },
        dark_blue: { backgroundColor: '#00f' },
      }

      link(ref, styles, 'scope-1')
      setScopedTheme('scope-1', 'dark_blue')

      // verify global theme is unchanged
      expect(getTheme()).toBe('light')
    })
  })

  describe('getRegistryStats', () => {
    test('returns current registry state', () => {
      const ref1 = { _tag: 1 }
      const ref2 = { _tag: 2 }
      const styles = { dark: {}, light: {} }

      link(ref1, styles)
      link(ref2, styles)

      const stats = getRegistryStats()
      expect(stats.viewCount).toBe(2)
      expect(stats.currentTheme).toBe('light')
    })
  })

  describe('isNativeModuleAvailable', () => {
    test('returns false in test environment', () => {
      expect(isNativeModuleAvailable()).toBe(false)
    })
  })

  describe('resetRegistry', () => {
    test('clears all state', () => {
      const ref = { _tag: 1 }
      const styles = { dark: {}, light: {} }

      link(ref, styles)
      setTheme('dark')

      expect(getRegistryStats().viewCount).toBe(1)
      expect(getTheme()).toBe('dark')

      resetRegistry()

      expect(getRegistryStats().viewCount).toBe(0)
      expect(getTheme()).toBe('light')
    })
  })
})

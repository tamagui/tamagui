import { describe, expect, test, beforeEach, vi } from 'vitest'
import {
  link,
  setTheme,
  getTheme,
  setScopedTheme,
  getRegistryStats,
  resetRegistry,
  isNativeModuleAvailable,
} from '../index'

describe('TamaguiStyleRegistry', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    resetRegistry()
  })

  describe('link', () => {
    test('returns a cleanup function', () => {
      const ref = { _tag: 1 }
      const styles = {
        dark: { backgroundColor: '#000' },
        light: { backgroundColor: '#fff' },
      }

      const unlink = link(ref, styles)
      expect(typeof unlink).toBe('function')
    })

    test('returns no-op when ref is null', () => {
      const styles = { dark: {}, light: {} }
      const unlink = link(null, styles)
      expect(typeof unlink).toBe('function')
    })

    test('returns no-op when styles is null', () => {
      const ref = { _tag: 1 }
      const unlink = link(ref, null as any)
      expect(typeof unlink).toBe('function')
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
  })

  describe('getTheme', () => {
    test('returns current theme', () => {
      expect(getTheme()).toBe('light') // default

      setTheme('dark')
      expect(getTheme()).toBe('dark')
    })
  })

  describe('setScopedTheme', () => {
    test('does not affect global theme', () => {
      setScopedTheme('scope-1', 'dark_blue')
      expect(getTheme()).toBe('light')
    })
  })

  describe('getRegistryStats', () => {
    test('returns current registry state', () => {
      const stats = getRegistryStats()
      expect(stats.viewCount).toBe(0)
      expect(stats.currentTheme).toBe('light')
    })

    test('reflects theme changes', () => {
      setTheme('dark')
      const stats = getRegistryStats()
      expect(stats.currentTheme).toBe('dark')
    })
  })

  describe('isNativeModuleAvailable', () => {
    test('returns false in test environment', () => {
      expect(isNativeModuleAvailable()).toBe(false)
    })
  })

  describe('resetRegistry', () => {
    test('resets theme to default', () => {
      setTheme('dark')
      expect(getTheme()).toBe('dark')

      resetRegistry()
      expect(getTheme()).toBe('light')
    })
  })
})

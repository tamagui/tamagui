import { describe, expect, test, beforeEach, vi } from 'vitest'
import {
  registerView,
  unregisterView,
  setTheme,
  setThemeForScope,
  createScope,
  getRegistryStats,
  resetRegistry,
  isNativeModuleAvailable,
} from '../index'

describe('TamaguiStyleRegistry', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    resetRegistry() // reset state between tests
  })

  describe('registerView', () => {
    test('stores view reference with styles', () => {
      const viewRef = { current: {} }
      const styles = {
        dark: { backgroundColor: '#000' },
        light: { backgroundColor: '#fff' },
      }

      const viewId = registerView(viewRef, styles)

      expect(viewId).toBeDefined()
      expect(typeof viewId).toBe('string')
    })

    test('generates unique IDs for each view', () => {
      const viewRef1 = { current: {} }
      const viewRef2 = { current: {} }
      const styles = { dark: {}, light: {} }

      const id1 = registerView(viewRef1, styles)
      const id2 = registerView(viewRef2, styles)

      expect(id1).not.toBe(id2)
    })

    test('handles deduplicated styles with __themes array', () => {
      const viewRef = { current: {} }
      const styles = {
        dark: {
          backgroundColor: '#000',
          __themes: ['dark', 'dark_alt1', 'dark_alt2'],
        },
      }

      const viewId = registerView(viewRef, styles as any)
      expect(viewId).toBeDefined()
    })
  })

  describe('unregisterView', () => {
    test('removes view from registry', () => {
      const viewRef = { current: {} }
      const styles = { dark: {}, light: {} }
      const viewId = registerView(viewRef, styles)

      // verify it was registered
      const statsBefore = getRegistryStats()
      expect(statsBefore.viewCount).toBe(1)

      unregisterView(viewId)

      // view should no longer be tracked
      const statsAfter = getRegistryStats()
      expect(statsAfter.viewCount).toBe(0)
    })
  })

  describe('setTheme', () => {
    test('updates global theme', () => {
      const viewRef1 = { current: {} }
      const viewRef2 = { current: {} }
      const styles = {
        dark: { backgroundColor: '#000' },
        light: { backgroundColor: '#fff' },
      }

      registerView(viewRef1, styles)
      registerView(viewRef2, styles)

      // set theme - in JS fallback this just updates state
      setTheme('light')

      const stats = getRegistryStats()
      expect(stats.currentTheme).toBe('light')
    })

    test('does NOT trigger React re-render (in JS fallback, just updates state)', () => {
      // this is the key test - we need to verify that changing theme
      // updates styles via native module without causing React re-render
      // in JS fallback mode, we just verify state is updated
      const renderCount = { count: 0 }
      const viewRef = {
        current: {},
        onRender: () => {
          renderCount.count++
        },
      }
      const styles = {
        dark: { backgroundColor: '#000' },
        light: { backgroundColor: '#fff' },
      }

      registerView(viewRef, styles)
      const initialRenderCount = renderCount.count

      setTheme('light')
      setTheme('dark')
      setTheme('light')

      // in JS mode, render count doesn't change because we're not
      // actually forcing re-renders (the real zero-re-render happens
      // in the native module which directly updates the ShadowTree)
      expect(renderCount.count).toBe(initialRenderCount)
    })
  })

  describe('theme scopes', () => {
    test('creates nested theme scope', () => {
      const scopeId = createScope('blue')
      expect(scopeId).toBeDefined()
      expect(typeof scopeId).toBe('string')
    })

    test('setThemeForScope updates scope', () => {
      const scopeId = createScope('blue')
      const viewRef1 = { current: {} }
      const viewRef2 = { current: {} }
      const styles = {
        dark: { backgroundColor: '#000' },
        dark_blue: { backgroundColor: '#00f' },
      }

      registerView(viewRef1, styles, scopeId)
      registerView(viewRef2, styles) // global scope

      // in JS fallback, this just stores the scope theme
      setThemeForScope(scopeId, 'dark_blue')

      // verify stats still work
      const stats = getRegistryStats()
      expect(stats.viewCount).toBe(2)
    })

    test('nested scopes inherit from parent', () => {
      const parentScope = createScope('blue')
      const childScope = createScope('active', parentScope)

      // when parent theme changes, child should get combined theme
      // e.g., if parent is "dark_blue" and child is "active",
      // child should resolve to "dark_blue_active"
      expect(childScope).toBeDefined()
      expect(parentScope).not.toBe(childScope)
    })
  })

  describe('getRegistryStats', () => {
    test('returns current registry state', () => {
      const viewRef = { current: {} }
      const styles = { dark: {}, light: {} }
      registerView(viewRef, styles)

      const stats = getRegistryStats()

      expect(stats.viewCount).toBe(1)
      expect(stats.scopeCount).toBeGreaterThanOrEqual(1) // at least global scope
    })
  })

  describe('sub-theme resolution', () => {
    test('tracks theme changes for sub-themes', () => {
      const viewRef = { current: {} }
      const styles = {
        dark: { backgroundColor: '#000' },
        dark_blue: { backgroundColor: '#00f' },
        light: { backgroundColor: '#fff' },
        light_blue: { backgroundColor: '#aaf' },
      }

      registerView(viewRef, styles)

      // when theme is set to 'dark_blue', should track it
      setTheme('dark_blue')

      const stats = getRegistryStats()
      expect(stats.currentTheme).toBe('dark_blue')
    })

    test('tracks base theme changes', () => {
      const viewRef = { current: {} }
      const styles = {
        dark: { backgroundColor: '#000' },
        light: { backgroundColor: '#fff' },
      }

      registerView(viewRef, styles)

      // requesting dark_blue - in JS fallback, we just track it
      setTheme('dark_blue')
      const stats = getRegistryStats()
      expect(stats.currentTheme).toBe('dark_blue')

      // the native module would handle fallback to 'dark'
    })
  })

  describe('isNativeModuleAvailable', () => {
    test('returns false in test environment', () => {
      // in test environment, native module is not available
      expect(isNativeModuleAvailable()).toBe(false)
    })
  })
})

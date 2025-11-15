import { execSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

const FIXTURES_DIR = join(__dirname, '../packages/app/test-fixtures')
const APPS_NEXT_DIR = join(__dirname, '../apps/next')

process.on('beforeExit', () => {
  resetFixtures()
})

function resetFixtures() {
  try {
    execSync(`yarn test:clean`, {
      stdio: 'inherit',
    })
  } catch (e) {
    console.error('Cleanup failed:', e)
  }
}

describe('Platform-specific file optimization', () => {
  beforeEach(() => {
    resetFixtures()
  })

  afterEach(() => {
    resetFixtures()
  })

  describe('BaseOnly.tsx - file without platform-specific versions', () => {
    it('should optimize for both web and native by default', () => {
      const result = execSync(
        'npx tamagui build ../../packages/app/test-fixtures --include BaseOnly.tsx',
        {
          cwd: APPS_NEXT_DIR,
          encoding: 'utf-8',
          stdio: 'pipe',
        }
      )

      // Should process both web and native targets
      expect(result).toContain('[tamagui]')
      expect(result).toContain('BaseOnly')

      // Web version should be in BaseOnly.tsx
      const webContent = readFileSync(join(FIXTURES_DIR, 'BaseOnly.tsx'), 'utf-8')
      expect(webContent).toContain('.css') // CSS import
      expect(webContent).toContain('<div') // Flattened to div

      // Native version should be in BaseOnly.native.tsx
      const nativePath = join(FIXTURES_DIR, 'BaseOnly.native.tsx')
      expect(existsSync(nativePath)).toBe(true)
      const nativeContent = readFileSync(nativePath, 'utf-8')
      expect(nativeContent).toContain('__ReactNativeView') // Native imports added
      expect(nativeContent).toContain('__ReactNativeText')

      // CSS file should exist
      expect(existsSync(join(FIXTURES_DIR, '_BaseOnly.css'))).toBe(true)
    })
  })

  describe('WithWeb.tsx + WithWeb.web.tsx', () => {
    it('should optimize .web.tsx for web and base file for native only', () => {
      const result = execSync(
        'npx tamagui build ../../packages/app/test-fixtures --include "WithWeb*"',
        {
          cwd: APPS_NEXT_DIR,
          encoding: 'utf-8',
          stdio: 'pipe',
        }
      )

      // Base file should only get native optimization
      const baseContent = readFileSync(join(FIXTURES_DIR, 'WithWeb.tsx'), 'utf-8')
      expect(baseContent).toContain('__ReactNativeView') // Native optimization
      expect(baseContent).not.toContain('.css') // No web CSS import
      expect(baseContent).toContain('Base File') // Original content

      // .web.tsx should get web optimization
      const webContent = readFileSync(join(FIXTURES_DIR, 'WithWeb.web.tsx'), 'utf-8')
      expect(webContent).toContain('.css') // CSS import
      expect(webContent).toContain('<div') // Flattened to div
      expect(webContent).toContain('Web Specific')

      // Should NOT create .native.tsx from base (base IS the native version)
      expect(existsSync(join(FIXTURES_DIR, 'WithWeb.native.tsx'))).toBe(false)
    })
  })

  describe('WithNative.tsx + WithNative.native.tsx', () => {
    it('should optimize base file for web only and .native.tsx for native', () => {
      const result = execSync(
        'npx tamagui build ../../packages/app/test-fixtures --include "WithNative*"',
        {
          cwd: APPS_NEXT_DIR,
          encoding: 'utf-8',
          stdio: 'pipe',
        }
      )

      // Base file should only get web optimization
      const baseContent = readFileSync(join(FIXTURES_DIR, 'WithNative.tsx'), 'utf-8')
      expect(baseContent).toContain('.css') // CSS import
      expect(baseContent).toContain('<div') // Flattened to div
      expect(baseContent).toContain('Base File')

      // .native.tsx should get native optimization
      const nativeContent = readFileSync(
        join(FIXTURES_DIR, 'WithNative.native.tsx'),
        'utf-8'
      )
      expect(nativeContent).toContain('__ReactNativeView') // Native imports
      expect(nativeContent).toContain('Native Specific')
      expect(nativeContent).not.toContain('.css')
    })
  })

  describe('WithBoth.tsx + WithBoth.web.tsx + WithBoth.native.tsx', () => {
    it('should leave base file untouched and optimize platform-specific files', () => {
      const originalBase = readFileSync(join(FIXTURES_DIR, 'WithBoth.tsx'), 'utf-8')

      const result = execSync(
        'npx tamagui build ../../packages/app/test-fixtures --include "WithBoth*"',
        {
          cwd: APPS_NEXT_DIR,
          encoding: 'utf-8',
          stdio: 'pipe',
        }
      )

      // Base file should be UNCHANGED (platform-specific files exist)
      const baseContent = readFileSync(join(FIXTURES_DIR, 'WithBoth.tsx'), 'utf-8')
      expect(baseContent).toBe(originalBase)
      expect(baseContent).toContain('Should Not Be Modified')

      // .web.tsx should be optimized for web
      const webContent = readFileSync(join(FIXTURES_DIR, 'WithBoth.web.tsx'), 'utf-8')
      expect(webContent).toContain('.css')
      expect(webContent).toContain('<div')
      expect(webContent).toContain('Web Specific')

      // .native.tsx should be optimized for native
      const nativeContent = readFileSync(
        join(FIXTURES_DIR, 'WithBoth.native.tsx'),
        'utf-8'
      )
      expect(nativeContent).toContain('__ReactNativeView') // Native imports
      expect(nativeContent).toContain('Native Specific')
      expect(nativeContent).not.toContain('.css')
    })
  })

  describe('WebOnly.web.tsx - web-only file', () => {
    it('should optimize for web only', () => {
      const result = execSync(
        'npx tamagui build ../../packages/app/test-fixtures --include "WebOnly*"',
        {
          cwd: APPS_NEXT_DIR,
          encoding: 'utf-8',
          stdio: 'pipe',
        }
      )

      expect(result).toContain('web')

      const webContent = readFileSync(join(FIXTURES_DIR, 'WebOnly.web.tsx'), 'utf-8')
      expect(webContent).toContain('.css')
      expect(webContent).toContain('<div')
      expect(webContent).toContain('Web Only File')

      // Should not create a native version
      expect(existsSync(join(FIXTURES_DIR, 'WebOnly.native.tsx'))).toBe(false)
    })
  })

  describe('NativeOnly.native.tsx - native-only file', () => {
    it('should optimize for native only', () => {
      const result = execSync(
        'npx tamagui build ../../packages/app/test-fixtures --include "NativeOnly*"',
        {
          cwd: APPS_NEXT_DIR,
          encoding: 'utf-8',
          stdio: 'pipe',
        }
      )

      expect(result).toContain('native')

      const nativeContent = readFileSync(
        join(FIXTURES_DIR, 'NativeOnly.native.tsx'),
        'utf-8'
      )
      expect(nativeContent).toContain('__ReactNativeView') // Native imports
      expect(nativeContent).toContain('Native Only File')
      expect(nativeContent).not.toContain('.css')

      // Should not create CSS or web version
      expect(existsSync(join(FIXTURES_DIR, '_NativeOnly.css'))).toBe(false)
    })
  })
})

import { execSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

const ROOT_DIR = join(__dirname, '..')
const FIXTURES_DIR = join(ROOT_DIR, 'packages/app/test-fixtures')

process.on('beforeExit', () => {
  resetFixtures()
})

function resetFixtures() {
  try {
    execSync(`bun run test:clean`, {
      cwd: ROOT_DIR,
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
        'bun tamagui build ./packages/app/test-fixtures --include BaseOnly.tsx',
        {
          cwd: ROOT_DIR,
          encoding: 'utf-8',
          stdio: 'pipe',
        }
      )

      // Should process both web and native targets
      expect(result).toContain('[tamagui]')
      expect(result).toContain('BaseOnly')

      // Web version should be in BaseOnly.tsx
      const webContent = readFileSync(join(FIXTURES_DIR, 'BaseOnly.tsx'), 'utf-8')
      const webLines = webContent.split('\n')

      // CSS import must be FIRST line
      expect(webLines[0]).toMatch(/^import "\.\/[_-]BaseOnly\.css"$/)

      // Should have className usage
      expect(webContent).toMatch(/_cn\s*=/)
      expect(webContent).toContain('className={')

      // Flattened to div
      expect(webContent).toContain('<div')
      expect(webContent).not.toContain('<View')

      // CSS file should exist with content
      const cssPath = join(FIXTURES_DIR, '_BaseOnly.css')
      expect(existsSync(cssPath)).toBe(true)
      const cssContent = readFileSync(cssPath, 'utf-8')
      expect(cssContent.length).toBeGreaterThan(50)
      expect(cssContent).toMatch(/\._[\w-]+\s*\{/)

      // Native version should be in BaseOnly.native.tsx
      const nativePath = join(FIXTURES_DIR, 'BaseOnly.native.tsx')
      expect(existsSync(nativePath)).toBe(true)
      const nativeContent = readFileSync(nativePath, 'utf-8')

      // Native imports in file
      expect(nativeContent).toContain('__ReactNativeView')

      // v2: View with theme tokens uses optimized path via __TamaguiView
      expect(nativeContent).toContain('__TamaguiView')
      expect(nativeContent).not.toContain('.css')
      expect(nativeContent).not.toContain('className')
    })
  })

  describe('WithWeb.tsx + WithWeb.web.tsx', () => {
    it('should optimize .web.tsx for web and base file for native only', () => {
      execSync('bun tamagui build ./packages/app/test-fixtures --include "WithWeb*"', {
        cwd: ROOT_DIR,
        encoding: 'utf-8',
        stdio: 'pipe',
      })

      // Base file should only get native optimization
      const baseContent = readFileSync(join(FIXTURES_DIR, 'WithWeb.tsx'), 'utf-8')
      expect(baseContent).toContain('__ReactNativeView') // Native optimization
      expect(baseContent).not.toContain('.css') // No web CSS import
      expect(baseContent).toContain('>Base<') // Original content preserved

      // .web.tsx should get web optimization
      const webContent = readFileSync(join(FIXTURES_DIR, 'WithWeb.web.tsx'), 'utf-8')
      const webLines = webContent.split('\n')

      // CSS import first
      expect(webLines[0]).toMatch(/^import "\.\/[_-]WithWeb\.web\.css"$/)

      // Flattened
      expect(webContent).toContain('<div')
      expect(webContent).not.toContain('<View')
      expect(webContent).toContain('>Web<')

      // CSS file exists
      const cssPath = join(FIXTURES_DIR, '_WithWeb.web.css')
      expect(existsSync(cssPath)).toBe(true)

      // Should NOT create .native.tsx from base (base IS the native version)
      expect(existsSync(join(FIXTURES_DIR, 'WithWeb.native.tsx'))).toBe(false)
    })
  })

  describe('WithNative.tsx + WithNative.native.tsx', () => {
    it('should optimize base file for web only and .native.tsx for native', () => {
      execSync('bun tamagui build ./packages/app/test-fixtures --include "WithNative*"', {
        cwd: ROOT_DIR,
        encoding: 'utf-8',
        stdio: 'pipe',
      })

      // Base file should only get web optimization
      const baseContent = readFileSync(join(FIXTURES_DIR, 'WithNative.tsx'), 'utf-8')
      const baseLines = baseContent.split('\n')

      // CSS import first
      expect(baseLines[0]).toMatch(/^import "\.\/[_-]WithNative\.css"$/)

      // Flattened
      expect(baseContent).toContain('<div')
      expect(baseContent).not.toContain('<View')
      expect(baseContent).toContain('>Base<')

      // CSS file exists
      const cssPath = join(FIXTURES_DIR, '_WithNative.css')
      expect(existsSync(cssPath)).toBe(true)

      // .native.tsx should get native optimization
      const nativeContent = readFileSync(
        join(FIXTURES_DIR, 'WithNative.native.tsx'),
        'utf-8'
      )
      expect(nativeContent).toContain('__ReactNativeView') // Native imports
      expect(nativeContent).toContain('>Native<')
      expect(nativeContent).not.toContain('.css')
    })
  })

  describe('WithBoth.tsx + WithBoth.web.tsx + WithBoth.native.tsx', () => {
    it('should leave base file untouched and optimize platform-specific files', () => {
      const originalBase = readFileSync(join(FIXTURES_DIR, 'WithBoth.tsx'), 'utf-8')

      execSync('bun tamagui build ./packages/app/test-fixtures --include "WithBoth*"', {
        cwd: ROOT_DIR,
        encoding: 'utf-8',
        stdio: 'pipe',
      })

      // Base file should be UNCHANGED (platform-specific files exist)
      const baseContent = readFileSync(join(FIXTURES_DIR, 'WithBoth.tsx'), 'utf-8')
      expect(baseContent).toBe(originalBase)
      expect(baseContent).toContain('>Root<')

      // .web.tsx should be optimized for web
      const webContent = readFileSync(join(FIXTURES_DIR, 'WithBoth.web.tsx'), 'utf-8')
      const webLines = webContent.split('\n')

      // CSS import first
      expect(webLines[0]).toMatch(/^import "\.\/[_-]WithBoth\.web\.css"$/)

      // Flattened
      expect(webContent).toContain('<div')
      expect(webContent).not.toContain('<View')
      expect(webContent).toContain('>Web<')

      // .native.tsx should be optimized for native
      const nativeContent = readFileSync(
        join(FIXTURES_DIR, 'WithBoth.native.tsx'),
        'utf-8'
      )
      expect(nativeContent).toContain('__ReactNativeView') // Native imports
      expect(nativeContent).toContain('>Native<')
      expect(nativeContent).not.toContain('.css')
    })
  })

  describe('WebOnly.web.tsx - web-only file', () => {
    it('should optimize for web only', () => {
      const result = execSync(
        'bun tamagui build ./packages/app/test-fixtures --include "WebOnly*"',
        {
          cwd: ROOT_DIR,
          encoding: 'utf-8',
          stdio: 'pipe',
        }
      )

      expect(result).toContain('web')

      const webContent = readFileSync(join(FIXTURES_DIR, 'WebOnly.web.tsx'), 'utf-8')
      const webLines = webContent.split('\n')

      // CSS import first
      expect(webLines[0]).toMatch(/^import "\.\/[_-]WebOnly\.web\.css"$/)

      // Flattened
      expect(webContent).toContain('<div')
      expect(webContent).not.toContain('<View')
      expect(webContent).toContain('Web Only File')

      // Should not create a native version
      expect(existsSync(join(FIXTURES_DIR, 'WebOnly.native.tsx'))).toBe(false)
    })
  })

  describe('NativeOnly.native.tsx - native-only file', () => {
    it('should optimize for native only', () => {
      const result = execSync(
        'bun tamagui build ./packages/app/test-fixtures --include "NativeOnly*"',
        {
          cwd: ROOT_DIR,
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

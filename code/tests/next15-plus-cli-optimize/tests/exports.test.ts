import { execSync } from 'node:child_process'
import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { describe, it, expect, beforeEach, afterEach } from 'vitest'

const APP_SCREEN_PATH = join(__dirname, '../packages/app/features/home/screen.tsx')

function resetAppPackage() {
  try {
    execSync(`yarn test:clean`, {
      cwd: join(__dirname, '..'),
      stdio: 'pipe',
    })
  } catch {
    // Ignore errors
  }
}

describe('Package.json exports support', () => {
  beforeEach(() => {
    resetAppPackage()
  })

  afterEach(() => {
    resetAppPackage()
  })

  afterAll(() => {
    // Final cleanup after all tests
    resetAppPackage()
  })

  it('should handle exports field in @my/ui package.json', () => {
    const packageJsonPath = join(__dirname, '../packages/ui/package.json')
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'))

    expect(packageJson.exports).toBeDefined()
    expect(packageJson.exports['.']).toBe('./src/index.tsx')
    expect(packageJson.exports['./components/CustomToast']).toBe('./src/CustomToast.tsx')
    expect(packageJson.exports['./components/SwitchRouterButton']).toBe(
      './src/SwitchRouterButton.tsx'
    )
    expect(packageJson.exports['./components/SwitchThemeButton']).toBe(
      './src/SwitchThemeButton.tsx'
    )
  })

  it('should build app package for both web and native targets', () => {
    const cwd = join(__dirname, '../apps/next')

    // Build the app package (defaults to both targets)
    const result = execSync(`npx tamagui build ../../packages/app`, {
      cwd,
      encoding: 'utf-8',
      stdio: 'pipe',
    })

    // Verify logs show BOTH platforms for same file
    expect(result).toMatch(/web.*screen/)
    expect(result).toMatch(/native.*screen/)

    // Check web optimization (screen.tsx)
    const webOptimized = readFileSync(APP_SCREEN_PATH, 'utf-8')
    const webLines = webOptimized.split('\n')

    // CSS import must be FIRST line
    expect(webLines[0]).toMatch(/^import "\.\/[_-]screen\.css"$/)

    // Should have className variable and usage
    expect(webOptimized).toMatch(/_cn\d*\s*=/)
    expect(webOptimized).toContain('className={')

    // Should be flattened to div
    expect(webOptimized).toContain('<div')
    expect(webOptimized).not.toContain('<YStack') // Original component removed

    // Should preserve imports for components that weren't flattened
    expect(webOptimized).toContain("from '@my/ui'")
    expect(webOptimized).toContain("from '@my/ui/components/SwitchRouterButton'")
    expect(webOptimized).toContain("from '@my/ui/components/SwitchThemeButton'")

    // Check CSS file was created with actual content
    const cssPath = join(__dirname, '../packages/app/features/home/_screen.css')
    expect(existsSync(cssPath)).toBe(true)
    const cssContent = readFileSync(cssPath, 'utf-8')
    expect(cssContent.length).toBeGreaterThan(50)
    expect(cssContent).toMatch(/\._[\w-]+\s*\{/) // Has CSS class rules

    // Check native optimization (screen.native.tsx)
    const nativePath = APP_SCREEN_PATH.replace('.tsx', '.native.tsx')
    expect(existsSync(nativePath)).toBe(true)
    const nativeOptimized = readFileSync(nativePath, 'utf-8')
    const nativeLines = nativeOptimized.split('\n')

    // Should have React Native imports somewhere in file
    expect(nativeOptimized).toContain('__ReactNativeView')
    expect(nativeOptimized).toContain('__ReactNativeText')

    // Should still use YStack (not flattened on native)
    expect(nativeOptimized).toContain('<YStack')
    expect(nativeOptimized).not.toContain('.css')
    expect(nativeOptimized).not.toContain('className')
  })

  it('should recognize imports from path-specific exports during optimization', () => {
    const cwd = join(__dirname, '../apps/next')

    // Build just the screen.tsx which uses path-specific imports
    const result = execSync(
      `npx tamagui build ../../packages/app/features/home/screen.tsx`,
      {
        cwd,
        encoding: 'utf-8',
        stdio: 'pipe',
      }
    )

    // Should show optimization happened
    expect(result).toMatch(/\d+\s+opt/) // Has optimization count

    // Verify web output is actually optimized
    const webOptimized = readFileSync(APP_SCREEN_PATH, 'utf-8')
    expect(webOptimized).toContain('.css') // Was optimized for web
    expect(webOptimized).toContain('<div') // Was flattened

    // Verify path-specific imports still work after optimization
    expect(webOptimized).toContain("from '@my/ui'") // Root import
    expect(webOptimized).toContain("from '@my/ui/components/SwitchRouterButton'") // Path import
    expect(webOptimized).toContain("from '@my/ui/components/SwitchThemeButton'") // Path import

    // Verify native output exists and is optimized
    const nativePath = APP_SCREEN_PATH.replace('.tsx', '.native.tsx')
    expect(existsSync(nativePath)).toBe(true)
    const nativeOptimized = readFileSync(nativePath, 'utf-8')
    expect(nativeOptimized).toContain('__ReactNativeView')
  })
})

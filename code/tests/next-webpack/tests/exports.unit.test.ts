import { execSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

const ROOT_DIR = join(__dirname, '..')
const APP_SCREEN_PATH = join(ROOT_DIR, 'packages/app/features/home/screen.tsx')

function resetAppPackage() {
  try {
    execSync(`bun run test:clean`, {
      cwd: ROOT_DIR,
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

  it('should build app package for both web and native targets', () => {
    // Build the features directory (contains screen.tsx for testing)
    // Note: Building whole packages/app hangs due to expo-constants issues in provider/
    const result = execSync(`bun tamagui build ./packages/app/features`, {
      cwd: ROOT_DIR,
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
    const cssPath = join(ROOT_DIR, 'packages/app/features/home/_screen.css')
    expect(existsSync(cssPath)).toBe(true)
    const cssContent = readFileSync(cssPath, 'utf-8')
    expect(cssContent.length).toBeGreaterThan(50)
    expect(cssContent).toMatch(/\._[\w-]+\s*\{/) // Has CSS class rules

    // Check native optimization (screen.native.tsx)
    const nativePath = APP_SCREEN_PATH.replace('.tsx', '.native.tsx')
    expect(existsSync(nativePath)).toBe(true)
    const nativeOptimized = readFileSync(nativePath, 'utf-8')

    // Should have React Native imports somewhere in file
    expect(nativeOptimized).toContain('__ReactNativeView')
    expect(nativeOptimized).toContain('__ReactNativeText')

    // Native extraction flattens components and creates styled wrappers
    expect(nativeOptimized).toContain('_withStableStyle')
    expect(nativeOptimized).toContain('StyleSheet.create')
    expect(nativeOptimized).not.toContain('.css')
    expect(nativeOptimized).not.toContain('className')
  })

  it('should recognize imports from path-specific exports during optimization', () => {
    // Build just the screen.tsx which uses path-specific imports
    const result = execSync(`bun tamagui build ./packages/app/features/home/screen.tsx`, {
      cwd: ROOT_DIR,
      encoding: 'utf-8',
      stdio: 'pipe',
    })

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

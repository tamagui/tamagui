import { execSync } from 'node:child_process'
import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { describe, it, expect, beforeEach, afterEach } from 'vitest'

const APP_SCREEN_PATH = join(__dirname, '../packages/app/features/home/screen.tsx')

function resetAppPackage() {
  const repoRoot = join(__dirname, '../../../..')
  const appPackageRelative = 'code/tests/next15-plus-cli-optimize/packages/app'

  try {
    execSync(
      `git checkout ${appPackageRelative} && git clean -fd ${appPackageRelative}`,
      {
        cwd: repoRoot,
        stdio: 'pipe',
      }
    )
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

  it('should support root package imports', () => {
    const screenContent = readFileSync(APP_SCREEN_PATH, 'utf-8')
    expect(screenContent).toContain("from '@my/ui'")
  })

  it('should support path-specific imports via exports field', () => {
    const screenContent = readFileSync(APP_SCREEN_PATH, 'utf-8')
    expect(screenContent).toContain("from '@my/ui/components/SwitchRouterButton'")
    expect(screenContent).toContain("from '@my/ui/components/SwitchThemeButton'")
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

    // Should successfully process files for both targets
    expect(result).toContain('[tamagui] optimizing')
    expect(result).toContain('screen.tsx')

    // Check web optimization (screen.tsx)
    const webOptimized = readFileSync(APP_SCREEN_PATH, 'utf-8')
    expect(webOptimized.length).toBeGreaterThan(0)
    expect(webOptimized).toContain('.css') // CSS import
    expect(webOptimized).toContain('<div') // Flattened to div

    // Check native optimization (screen.native.tsx)
    const nativePath = APP_SCREEN_PATH.replace('.tsx', '.native.tsx')
    expect(existsSync(nativePath)).toBe(true)
    const nativeOptimized = readFileSync(nativePath, 'utf-8')
    expect(nativeOptimized).toContain('__ReactNativeView')

    // Check CSS file was created
    const cssPath = join(__dirname, '../packages/app/features/home/_screen.css')
    expect(existsSync(cssPath)).toBe(true)
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

    // Should recognize both import styles as valid
    expect(result).toContain('[tamagui] optimizing')
  })
})

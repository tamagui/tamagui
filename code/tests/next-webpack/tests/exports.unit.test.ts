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
    // build the features directory
    execSync(`bun tamagui build ./packages/app/features --expect-optimizations 10`, {
      cwd: ROOT_DIR,
      encoding: 'utf-8',
      stdio: 'pipe',
    })

    // check web optimization
    const webOptimized = readFileSync(APP_SCREEN_PATH, 'utf-8')
    expect(webOptimized).toMatchSnapshot('web-optimized')

    // check css file
    const cssPath = join(ROOT_DIR, 'packages/app/features/home/_screen.css')
    expect(existsSync(cssPath)).toBe(true)
    const cssContent = readFileSync(cssPath, 'utf-8')
    expect(cssContent).toMatchSnapshot('web-css')

    // check native optimization
    const nativePath = APP_SCREEN_PATH.replace('.tsx', '.native.tsx')
    expect(existsSync(nativePath)).toBe(true)
    const nativeOptimized = readFileSync(nativePath, 'utf-8')
    expect(nativeOptimized).toMatchSnapshot('native-optimized')
  })

  it('should recognize imports from path-specific exports during optimization', () => {
    // build just screen.tsx
    execSync(
      `bun tamagui build ./packages/app/features/home/screen.tsx --expect-optimizations 10`,
      {
        cwd: ROOT_DIR,
        encoding: 'utf-8',
        stdio: 'pipe',
      }
    )

    // check outputs
    const webOptimized = readFileSync(APP_SCREEN_PATH, 'utf-8')
    expect(webOptimized).toMatchSnapshot('web-optimized-single')

    const nativePath = APP_SCREEN_PATH.replace('.tsx', '.native.tsx')
    expect(existsSync(nativePath)).toBe(true)
    const nativeOptimized = readFileSync(nativePath, 'utf-8')
    expect(nativeOptimized).toMatchSnapshot('native-optimized-single')
  })
})

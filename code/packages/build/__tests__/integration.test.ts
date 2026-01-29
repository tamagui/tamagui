import { execSync, spawn } from 'node:child_process'
import { existsSync, readFileSync, writeFileSync, statSync } from 'node:fs'
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { join } from 'node:path'
import { readFile } from 'node:fs/promises'

const watchPackagePath = join(__dirname, 'fixtures', 'watch-package')
const watchDistPath = join(watchPackagePath, 'dist')
const watchSrcFilePath = join(watchPackagePath, 'src', 'watch.ts')

const simplePackagePath = join(__dirname, 'fixtures', 'simple-package')
const distPath = join(simplePackagePath, 'dist')
const srcFilePath = join(simplePackagePath, 'src', 'index.ts')
const distCjsFilePath = join(distPath, 'cjs', 'index.cjs')
const watchDistCjsFilePath = join(watchDistPath, 'cjs', 'watch.cjs')
const distEsmFilePath = join(distPath, 'esm', 'index.mjs')
const distTypesFilePath = join(simplePackagePath, 'types', 'index.d.ts')
// // biome-ignore lint/suspicious/noConsoleLog: <explanation>
// console.log({
//   distCjsFilePath,
//   distEsmFilePath,
//   distTypesFilePath,
//   srcFilePath,
//   simplePackagePath,
//   distPath,
// })

describe('tamagui-build integration test', () => {
  beforeAll(() => {
    // Clean up dist directory before starting
    execSync('rm -rf dist && rm -rf types', { cwd: simplePackagePath })
  })

  it('should build the package correctly', () => {
    execSync('yarn build', { cwd: simplePackagePath })

    // Check if the output files exist
    expect(existsSync(distCjsFilePath)).toBe(true)
    expect(existsSync(distEsmFilePath)).toBe(true)
    expect(existsSync(distTypesFilePath)).toBe(true)

    // Check the content of the output files
    const cjsOutput = readFileSync(distCjsFilePath, 'utf-8')
    const esmOutput = readFileSync(distEsmFilePath, 'utf-8')
    expect(cjsOutput).toContain('Hello,')
    expect(esmOutput).toContain('Hello,')
  })

  it('should bundle the package correctly', () => {
    execSync('yarn build:bundle', { cwd: simplePackagePath })

    // Check if the output files exist
    expect(existsSync(distCjsFilePath)).toBe(true)
    expect(existsSync(distEsmFilePath)).toBe(true)

    // Check the content of the output files
    const cjsOutput = readFileSync(distCjsFilePath, 'utf-8')
    const esmOutput = readFileSync(distEsmFilePath, 'utf-8')
    expect(cjsOutput).toContain('Hello,')
    expect(esmOutput).toContain('Hello,')
  })

  it('should skip mjs files when --skip-mjs is used', () => {
    execSync('rm -rf dist && rm -rf types', { cwd: simplePackagePath })
    execSync('yarn build:skip-mjs', { cwd: simplePackagePath })

    // Check if the output files exist
    expect(existsSync(distCjsFilePath)).toBe(true)
    expect(existsSync(distEsmFilePath)).toBe(false)
  })

  // it('should set declaration root correctly', () => {
  //   execSync('rm -rf dist && rm -rf types', { cwd: simplePackagePath })

  //   execSync('yarn build:declaration-root', { cwd: simplePackagePath })
  //   // Check if the output files exist
  //   expect(existsSync(distTypesFilePath)).toBe(true)
  //   // clear up declaration root files
  //   execSync('rm -rf index.d.ts && index.d', { cwd: simplePackagePath })
  // })

  it('should ignore base URL when --ignore-base-url is used', () => {
    execSync('yarn build:ignore-base-url', { cwd: simplePackagePath })

    // Check if the output files exist
    expect(existsSync(distCjsFilePath)).toBe(true)
    expect(existsSync(distEsmFilePath)).toBe(true)
  })

  it('should rebuild the package on file change when --watch is used', async () => {
    const watchProcess = spawn('yarn', ['build:watch'], { cwd: watchPackagePath })

    // Cache existing content
    const originalContent = readFileSync(watchSrcFilePath, 'utf-8')

    try {
      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Timeout waiting for build to complete'))
        }, 15000) // 30 second timeout

        let initialBuildComplete = false
        let fileModified = false

        watchProcess.stdout.on('data', (data) => {
          // biome-ignore lint/suspicious/noConsoleLog: <explanation>
          console.log('Watch process output:', data.toString())
          if (data.toString().includes('built tamagui-build-test-watch-package')) {
            if (!initialBuildComplete) {
              initialBuildComplete = true
              // biome-ignore lint/suspicious/noConsoleLog: <explanation>
              console.log('Initial build complete, modifying file...')
              // Modify the source file
              const newContent = `export const greet = (name: string): string => {
  return \`Hi, \${name}!\`;
};`
              writeFileSync(watchSrcFilePath, newContent)
              fileModified = true
            } else if (fileModified) {
              // biome-ignore lint/suspicious/noConsoleLog: <explanation>
              console.log('Rebuild after file modification complete')
              // Check the updated content of the output file
              const output = readFileSync(watchDistCjsFilePath, 'utf-8')
              expect(output).toContain('Hi,')

              // Change content back to original
              writeFileSync(watchSrcFilePath, originalContent)

              clearTimeout(timeout)
              resolve()
            }
          }
        })
      })
    } finally {
      watchProcess.kill()
    }
  }, 15000)

  it('should generate correct platform-specific output', async () => {
    execSync('yarn build', { cwd: simplePackagePath })

    const distCjsWebFilePath = join(distPath, 'cjs', 'index.cjs')
    const distCjsNativeFilePath = join(distPath, 'cjs', 'index.native.js')

    // Check if the output files exist
    expect(existsSync(distCjsWebFilePath)).toBe(true)
    expect(existsSync(distCjsNativeFilePath)).toBe(true)

    // Read the content of the output files
    const webOutput = await readFile(distCjsWebFilePath, 'utf-8')
    const nativeOutput = await readFile(distCjsNativeFilePath, 'utf-8')

    // Check for platform-specific content in web output
    expect(webOutput).toContain('salutation = "Hi"')
    expect(webOutput).not.toContain('salutation = "Hey"')
    expect(webOutput).not.toContain('process.env.TAMAGUI_TARGET')

    // Check for platform-specific content in native output
    expect(nativeOutput).toContain('salutation = "Hey"')
    expect(nativeOutput).not.toContain('salutation = "Hi"')
    expect(nativeOutput).not.toContain('process.env.TAMAGUI_TARGET')

    // Check that the common code is present in both outputs
    expect(webOutput).toContain('greet:')
    expect(nativeOutput).toContain('greet:')
  })

  it('should minify the output when MINIFY=true is set', () => {
    // Build without minification and cache file sizes
    execSync('yarn build', { cwd: simplePackagePath })
    const originalCjsSize = statSync(distCjsFilePath).size
    const originalEsmSize = statSync(distEsmFilePath).size

    // Clean up the output
    execSync('rm -rf dist && rm -rf types', { cwd: simplePackagePath })

    // Build with minification
    execSync('yarn build:minify', { cwd: simplePackagePath })

    // Check if the output files exist
    expect(existsSync(distCjsFilePath)).toBe(true)
    expect(existsSync(distEsmFilePath)).toBe(true)

    // Check if the minified output is smaller
    const minifiedCjsSize = statSync(distCjsFilePath).size
    const minifiedEsmSize = statSync(distEsmFilePath).size
    expect(minifiedCjsSize).toBeLessThan(originalCjsSize)
    expect(minifiedEsmSize).toBeLessThan(originalEsmSize)

    // Check the content of the minified output files
    const cjsOutput = readFileSync(distCjsFilePath, 'utf-8')
    const esmOutput = readFileSync(distEsmFilePath, 'utf-8')

    // Check for absence of excessive whitespace in minified output
    expect(cjsOutput).not.toMatch(/^\s+$/m) // No lines with only whitespace
    expect(esmOutput).not.toMatch(/^\s+$/m) // No lines with only whitespace

    // Check that the number of lines is reduced
    expect(cjsOutput.split('\n').length).toBeLessThan(32)
    expect(esmOutput.split('\n').length).toBeLessThan(32)
  })

  afterAll(() => {
    // Clean up dist directory after tests
    execSync('rm -rf dist && rm -rf types', { cwd: simplePackagePath })
  })
})

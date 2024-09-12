import { execSync, spawn } from 'node:child_process'
import { existsSync, readFileSync, writeFileSync, statSync } from 'node:fs'
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { join } from 'node:path'

const watchPackagePath = join(__dirname, 'fixtures', 'watch-package')
const watchDistPath = join(watchPackagePath, 'dist')
const watchSrcFilePath = join(watchPackagePath, 'src', 'watch.ts')

const simplePackagePath = join(__dirname, 'fixtures', 'simple-package')
const distPath = join(simplePackagePath, 'dist')
const srcFilePath = join(simplePackagePath, 'src', 'index.ts')
const distCjsFilePath = join(distPath, 'cjs', 'index.js')
const watchDistCjsFilePath = join(watchDistPath, 'cjs', 'watch.js')
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
        }, 30000) // 30 second timeout

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
  }, 35000) // 35 second total test timeout

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

    // Check for absence of excessive whitespace and newlines in minified output
    expect(cjsOutput).not.toMatch(/\s{2,}/)
    expect(cjsOutput.split('\n').length).toBeLessThan(5)
    expect(esmOutput).not.toMatch(/\s{2,}/)
    expect(esmOutput.split('\n').length).toBeLessThan(5)
  })

  afterAll(() => {
    // Clean up dist directory after tests
    execSync('rm -rf dist && rm -rf types', { cwd: simplePackagePath })
  })
})

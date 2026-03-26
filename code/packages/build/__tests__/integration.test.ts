import { execSync, spawn } from 'node:child_process'
import { existsSync, readFileSync, writeFileSync, statSync, readdirSync } from 'node:fs'
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
const jsMainPackagePath = join(__dirname, 'fixtures', 'js-main-package')
const jsMainDistPath = join(jsMainPackagePath, 'dist')
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
    execSync('rm -rf dist && rm -rf types', { cwd: jsMainPackagePath })
  })

  it('should build the package correctly', () => {
    execSync('bun run build', { cwd: simplePackagePath })

    // Check if the output files exist
    expect(existsSync(distCjsFilePath)).toBe(true)
    expect(existsSync(distEsmFilePath)).toBe(true)
    expect(existsSync(distTypesFilePath)).toBe(true)

    // Check the content of the output files
    const cjsOutput = readFileSync(distCjsFilePath, 'utf-8')
    const esmOutput = readFileSync(distEsmFilePath, 'utf-8')
    expect(cjsOutput).toContain('Hello,')
    expect(esmOutput).toContain('Hello,')
    expect(esmOutput).toContain("./nested/index.mjs")
    expect(existsSync(join(distPath, 'cjs', 'index.cjs'))).toBe(true)
    expect(existsSync(join(distPath, 'esm', 'index.js'))).toBe(true)
    expect(existsSync(join(distPath, 'jsx', 'index.js'))).toBe(true)
  })

  it('should bundle the package correctly', () => {
    execSync('bun run build:bundle', { cwd: simplePackagePath })

    // Check if the output files exist
    expect(existsSync(distCjsFilePath)).toBe(true)
    expect(existsSync(distEsmFilePath)).toBe(true)

    // Check the content of the output files
    const cjsOutput = readFileSync(distCjsFilePath, 'utf-8')
    const esmOutput = readFileSync(distEsmFilePath, 'utf-8')
    expect(cjsOutput).toContain('Hello,')
    expect(esmOutput).toContain('Hello,')
    expect(existsSync(join(distPath, 'cjs', 'index.cjs'))).toBe(true)
    expect(existsSync(join(distPath, 'esm', 'index.js'))).toBe(true)
    expect(existsSync(join(distPath, 'jsx', 'index.js'))).toBe(true)
  })

  it('should skip mjs files when --skip-mjs is used', () => {
    execSync('rm -rf dist && rm -rf types', { cwd: simplePackagePath })
    execSync('bun run build:skip-mjs', { cwd: simplePackagePath })

    // Check if the output files exist
    expect(existsSync(distCjsFilePath)).toBe(true)
    expect(existsSync(distEsmFilePath)).toBe(false)
    expect(existsSync(join(distPath, 'cjs', 'index.cjs'))).toBe(true)
  })

  it('should skip sourcemaps when --skip-sourcemaps is used', () => {
    execSync('rm -rf dist && rm -rf types', { cwd: simplePackagePath })
    execSync('bun run build:skip-sourcemaps', { cwd: simplePackagePath })

    expect(existsSync(distCjsFilePath)).toBe(true)
    expect(existsSync(distEsmFilePath)).toBe(true)
    expect(existsSync(distTypesFilePath)).toBe(true)
    expect(existsSync(join(distPath, 'cjs', 'index.cjs.map'))).toBe(false)
    expect(existsSync(join(distPath, 'esm', 'index.mjs.map'))).toBe(false)
    expect(existsSync(join(simplePackagePath, 'types', 'index.d.ts.map'))).toBe(false)

    const cjsOutput = readFileSync(distCjsFilePath, 'utf-8')
    const esmOutput = readFileSync(distEsmFilePath, 'utf-8')
    const typesOutput = readFileSync(distTypesFilePath, 'utf-8')

    expect(cjsOutput).not.toContain('sourceMappingURL=')
    expect(esmOutput).not.toContain('sourceMappingURL=')
    expect(typesOutput).not.toContain('sourceMappingURL=')
  })

  it('should ignore base URL when --ignore-base-url is used', () => {
    execSync('bun run build:ignore-base-url', { cwd: simplePackagePath })

    // Check if the output files exist
    expect(existsSync(distCjsFilePath)).toBe(true)
    expect(existsSync(distEsmFilePath)).toBe(true)
  })

  it('should rebuild the package on file change when --watch is used', async () => {
    const watchProcess = spawn('bun', ['run', 'build:watch'], { cwd: watchPackagePath })

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
          console.log('Watch process output:', data.toString())
          if (data.toString().includes('built tamagui-build-test-watch-package')) {
            if (!initialBuildComplete) {
              initialBuildComplete = true
              console.log('Initial build complete, modifying file...')
              // Modify the source file
              const newContent = `export const greet = (name: string): string => {
  return \`Hi, \${name}!\`;
};`
              writeFileSync(watchSrcFilePath, newContent)
              fileModified = true
            } else if (fileModified) {
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
    execSync('bun run build', { cwd: simplePackagePath })

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
    execSync('bun run build', { cwd: simplePackagePath })
    const originalCjsSize = statSync(distCjsFilePath).size
    const originalEsmSize = statSync(distEsmFilePath).size

    // Clean up the output
    execSync('rm -rf dist && rm -rf types', { cwd: simplePackagePath })

    // Build with minification
    execSync('bun run build:minify', { cwd: simplePackagePath })

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
    expect(cjsOutput.split('\n').length).toBeLessThan(originalCjsSize > 0 ? 40 : 32)
    expect(esmOutput.split('\n').length).toBeLessThan(originalEsmSize > 0 ? 40 : 32)
  })

  it('should clean stale outputs before building', () => {
    execSync('bun run build', { cwd: simplePackagePath })

    const staleFilePath = join(distPath, 'esm', 'stale.mjs')
    const staleTypesPath = join(simplePackagePath, 'types', 'stale.d.ts')
    writeFileSync(staleFilePath, 'stale')
    writeFileSync(staleTypesPath, 'stale')

    expect(existsSync(staleFilePath)).toBe(true)
    expect(existsSync(staleTypesPath)).toBe(true)

    execSync('bun run build', { cwd: simplePackagePath })

    expect(existsSync(staleFilePath)).toBe(false)
    expect(existsSync(staleTypesPath)).toBe(false)
    expect(readdirSync(join(distPath, 'esm'))).not.toContain('stale.mjs')
  })

  it('should keep only the required js aliases after postprocessing', () => {
    execSync('bun run build', { cwd: simplePackagePath })

    const distFiles = execSync('find dist -type f | sort', {
      cwd: simplePackagePath,
      encoding: 'utf-8',
    })
      .trim()
      .split('\n')
      .map((file) => file.replace(/^dist\//, ''))

    expect(distFiles).toContain('cjs/index.cjs')
    expect(distFiles).toContain('esm/index.js')
    expect(distFiles).toContain('esm/index.js.map')
    expect(distFiles).toContain('jsx/index.js')
    expect(distFiles).toContain('jsx/index.js.map')
    expect(distFiles).toContain('cjs/index.cjs')
    expect(distFiles).toContain('esm/index.mjs')
    expect(distFiles).toContain('esm/nested/index.mjs')
  })

  it('should keep explicit cjs .js mains as final output', () => {
    execSync('bun run build', { cwd: jsMainPackagePath })

    expect(existsSync(join(jsMainDistPath, 'cjs', 'index.js'))).toBe(true)
    expect(existsSync(join(jsMainDistPath, 'cjs', 'index.mjs'))).toBe(false)
    expect(existsSync(join(jsMainDistPath, 'esm', 'index.mjs'))).toBe(true)
  })

  afterAll(() => {
    // Clean up dist directory after tests
    execSync('rm -rf dist && rm -rf types', { cwd: simplePackagePath })
    execSync('rm -rf dist && rm -rf types', { cwd: jsMainPackagePath })
  })
})

import { execSync, spawn } from 'node:child_process'
import { createRequire } from 'node:module'
import {
  existsSync,
  readFileSync,
  writeFileSync,
  statSync,
  readdirSync,
  rmSync,
} from 'node:fs'
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
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
const repositoryRoot = join(__dirname, '../../../..')
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
    execSync('rm -rf dist', { cwd: jsMainPackagePath })
  })

  it('should build the package correctly', async () => {
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
    expect(esmOutput).toContain('./nested/index.mjs')
    expect(esmOutput).toContain('./star.mjs')
    expect(esmOutput).toContain('import("./lazy.mjs")')
    expect(esmOutput).toContain('./common.mjs')
    expect(cjsOutput).toContain('require("./star.cjs")')
    expect(cjsOutput).toContain('import("./lazy.cjs")')
    expect(cjsOutput).toContain('require("./common.cjs")')

    const require = createRequire(import.meta.url)
    const cjsModule = require(distCjsFilePath)
    const esmModule = await import(pathToFileURL(distEsmFilePath).href)
    expect(cjsModule.starMarker).toBe('star-marker')
    expect(cjsModule.dottedNameMarker).toBe('dotted-name-marker')
    expect(cjsModule.loadCommon().commonMarker).toBe('common-marker')
    expect((await cjsModule.loadLazy()).default.lazyMarker).toBe('lazy-marker')
    expect(esmModule.starMarker).toBe('star-marker')
    expect(esmModule.dottedNameMarker).toBe('dotted-name-marker')
    expect((await esmModule.loadLazy()).lazyMarker).toBe('lazy-marker')
    expect(existsSync(join(distPath, 'cjs', 'index.cjs'))).toBe(true)
    expect(existsSync(join(distPath, 'esm', 'index.js'))).toBe(true)
    expect(existsSync(join(distPath, 'jsx', 'index.js'))).toBe(true)
    expect(existsSync(join(distPath, 'cjs', 'ignored.test-d.cjs'))).toBe(false)
    expect(existsSync(join(distPath, 'esm', 'ignored.test-d.mjs'))).toBe(false)
  })

  it('rebuilds declarations when incremental state outlives the output', () => {
    execSync('bun run build', { cwd: simplePackagePath })
    execSync(
      'node ../../../tamagui-tsgo.js --project tsconfig.json --declaration --emitDeclarationOnly --declarationMap true --outDir types --rootDir src --tsBuildInfoFile tsconfig.tsbuildinfo',
      { cwd: simplePackagePath }
    )
    expect(existsSync(join(simplePackagePath, 'tsconfig.tsbuildinfo'))).toBe(true)

    rmSync(join(simplePackagePath, 'types'), { recursive: true, force: true })
    execSync('bun run build', { cwd: simplePackagePath })

    expect(existsSync(distTypesFilePath)).toBe(true)
    expect(existsSync(join(simplePackagePath, 'tsconfig.tsbuildinfo'))).toBe(false)
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
    const watchProcess = spawn(
      'node',
      [
        'code/packages/build/tamagui-build-workspace.js',
        '--watch',
        '--skip-types',
        '--filter',
        'tamagui-build-test-watch-package',
      ],
      { cwd: repositoryRoot }
    )

    // Cache existing content
    const originalContent = readFileSync(watchSrcFilePath, 'utf-8')

    try {
      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Timeout waiting for build to complete'))
        }, 15000)

        let initialBuildComplete = false
        let fileModified = false
        const replacementGreeting = originalContent.includes('Hi,') ? 'Hey' : 'Hi'

        watchProcess.stdout.on('data', (data) => {
          console.log('Watch process output:', data.toString())
          if (data.toString().includes('built tamagui-build-test-watch-package')) {
            if (!initialBuildComplete) {
              initialBuildComplete = true
              console.log('Initial build complete, modifying file...')
              // Modify the source file
              const newContent = `export const greet = (name: string): string => {
  return \`${replacementGreeting}, \${name}!\`;
};`
              writeFileSync(watchSrcFilePath, newContent)
              fileModified = true
            } else if (fileModified) {
              console.log('Rebuild after file modification complete')
              // Check the updated content of the output file
              const output = readFileSync(watchDistCjsFilePath, 'utf-8')
              expect(output).toContain(`${replacementGreeting},`)

              // Change content back to original
              writeFileSync(watchSrcFilePath, originalContent)

              clearTimeout(timeout)
              resolve()
            }
          }
        })
      })
    } finally {
      writeFileSync(watchSrcFilePath, originalContent)
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

  it('should prune imports left unused after platform DCE', async () => {
    execSync('bun run build', { cwd: simplePackagePath })

    const webOutput = await readFile(join(distPath, 'esm', 'index.mjs'), 'utf-8')
    const nativeOutput = await readFile(join(distPath, 'esm', 'index.native.js'), 'utf-8')
    const nativeOnlyOutput = await readFile(
      join(distPath, 'esm', 'nativeOnly.native.js'),
      'utf-8'
    )

    expect(webOutput).toContain('web-import-marker')
    expect(webOutput).not.toContain('native-import-marker')
    expect(webOutput).not.toContain('getNativeOnlyMarker')
    expect(webOutput).not.toContain('./nativeOnly')
    expect(webOutput).toContain('process.env.NODE_ENV === "test"')
    expect(webOutput).toContain('process.env.NODE_ENV === "development"')

    expect(nativeOutput).toContain('getNativeOnlyMarker')
    expect(nativeOnlyOutput).toContain('native-import-marker')
    expect(nativeOutput).toContain('from "./nativeOnly.native.js"')
    expect(nativeOutput).toContain('from "./nested/index.native.js"')
    expect(nativeOutput).not.toContain('from "./nativeOnly"')
    expect(nativeOutput).not.toContain('from "./nested"')
  })

  it('should emit a real require() (not the throwing __require shim) for native esm', async () => {
    execSync('bun run build', { cwd: simplePackagePath })

    const nativeOutput = await readFile(join(distPath, 'esm', 'index.native.js'), 'utf-8')
    const webOutput = await readFile(join(distPath, 'esm', 'index.mjs'), 'utf-8')

    // native keeps the require behind the DCE guard, but as a real require() that Metro
    // can statically resolve — never the __require() call site that throws at runtime
    expect(nativeOutput).toContain('require("lodash.debounce")')
    // no __require() call sites — that shim throws "Dynamic require ... is not supported"
    expect(nativeOutput).not.toContain('__require(')

    // web DCE strips the native branch entirely, so the require never leaks into web
    expect(webOutput).toContain('web-require-marker')
    expect(webOutput).not.toContain('lodash.debounce')
  })

  it('should keep side-effectful native statements outside dev-only guards', async () => {
    execSync('bun run build', { cwd: simplePackagePath })

    const nativeOutputPath = join(distPath, 'esm', 'index.native.js')
    const nativeOutput = await readFile(nativeOutputPath, 'utf-8')

    expect(nativeOutput).toContain('runNativeSideEffect(items);')
    expect(nativeOutput).toContain('native-only-marker')
    expect(nativeOutput).toContain('native-logical-marker')
    expect(nativeOutput).not.toContain('if (runNativeSideEffect(')
    expect(nativeOutput).not.toContain('if (false)')
    expect(nativeOutput).not.toContain('if (true)')
    expect(nativeOutput).not.toContain('runNativeSideEffect(items), process.env.NODE_ENV')
    expect(nativeOutput).not.toContain('web-only-marker')
    expect(nativeOutput).not.toContain('web-logical-marker')
    expect(nativeOutput).not.toContain('&& items.push(')
  })

  it('should minify the output when MINIFY=true is set', () => {
    // Build without minification and cache file sizes
    execSync('bun run build', { cwd: simplePackagePath })
    const originalCjsSize = statSync(distCjsFilePath).size
    const originalEsmSize = statSync(distEsmFilePath).size
    const originalCjsOutput = readFileSync(distCjsFilePath, 'utf-8')
    const originalEsmOutput = readFileSync(distEsmFilePath, 'utf-8')

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
    expect(cjsOutput.split('\n').length).toBeLessThanOrEqual(
      originalCjsOutput.split('\n').length
    )
    expect(esmOutput.split('\n').length).toBeLessThanOrEqual(
      originalEsmOutput.split('\n').length
    )
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
    execSync('rm -rf dist', { cwd: jsMainPackagePath })
  })
})

import { join } from 'node:path'
import { mkdtempSync, readFileSync, rmSync, writeFileSync, existsSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { afterEach, beforeEach, describe, expect, test } from 'vitest'
import { clearFormatCache, detectModuleFormat } from '@tamagui/static'
import esbuild from 'esbuild'

let tempDir: string

beforeEach(() => {
  clearFormatCache()
  tempDir = mkdtempSync(join(tmpdir(), 'tamagui-moduleformat-'))
})

afterEach(() => {
  rmSync(tempDir, { recursive: true, force: true })
})

const componentSource = `
import { styled, View } from '@tamagui/core'
export const MyButton = styled(View, {
  name: 'MyButton',
  backgroundColor: 'red',
})
`

describe('esbuild format based on detected module type', () => {
  test('cjs project produces require() calls in output', () => {
    writeFileSync(join(tempDir, 'package.json'), JSON.stringify({ type: 'commonjs' }))
    const srcFile = join(tempDir, 'comp.tsx')
    writeFileSync(srcFile, componentSource)

    const format = detectModuleFormat(srcFile)
    expect(format).toBe('cjs')

    const outFile = join(tempDir, 'out.js')
    esbuild.buildSync({
      entryPoints: [srcFile],
      outfile: outFile,
      format,
      bundle: true,
      packages: 'external',
      platform: 'node',
      jsx: 'automatic',
      target: 'es2022',
    })

    const output = readFileSync(outFile, 'utf-8')
    expect(output).toContain('require(')
    expect(output).toContain('module.exports')
    expect(output).not.toMatch(/^export /m)
  })

  test('esm project produces import/export in output', () => {
    writeFileSync(join(tempDir, 'package.json'), JSON.stringify({ type: 'module' }))
    const srcFile = join(tempDir, 'comp.tsx')
    writeFileSync(srcFile, componentSource)

    const format = detectModuleFormat(srcFile)
    expect(format).toBe('esm')

    const outFile = join(tempDir, 'out.mjs')
    esbuild.buildSync({
      entryPoints: [srcFile],
      outfile: outFile,
      format,
      bundle: true,
      packages: 'external',
      platform: 'node',
      jsx: 'automatic',
      target: 'es2022',
    })

    const output = readFileSync(outFile, 'utf-8')
    expect(output).toMatch(/^import /m)
    expect(output).not.toContain('require(')
    expect(output).not.toContain('module.exports')
  })

  test('.mjs file produces esm output', () => {
    const srcFile = join(tempDir, 'comp.mjs')
    writeFileSync(
      srcFile,
      `
      import { styled, View } from '@tamagui/core'
      export const Box = styled(View, { name: 'Box' })
    `
    )

    const format = detectModuleFormat(srcFile)
    expect(format).toBe('esm')

    const outFile = join(tempDir, 'out.mjs')
    esbuild.buildSync({
      entryPoints: [srcFile],
      outfile: outFile,
      format,
      bundle: true,
      packages: 'external',
      platform: 'node',
      jsx: 'automatic',
      target: 'es2022',
    })

    const output = readFileSync(outFile, 'utf-8')
    expect(output).toMatch(/^import /m)
  })

  test('.cjs file produces cjs output even in type:module project', () => {
    writeFileSync(join(tempDir, 'package.json'), JSON.stringify({ type: 'module' }))
    const srcFile = join(tempDir, 'comp.cjs')
    writeFileSync(
      srcFile,
      `
      const { styled, View } = require('@tamagui/core')
      exports.Box = styled(View, { name: 'Box' })
    `
    )

    const format = detectModuleFormat(srcFile)
    expect(format).toBe('cjs')

    const outFile = join(tempDir, 'out.cjs')
    esbuild.buildSync({
      entryPoints: [srcFile],
      outfile: outFile,
      format,
      bundle: true,
      packages: 'external',
      platform: 'node',
      target: 'es2022',
    })

    const output = readFileSync(outFile, 'utf-8')
    expect(output).toContain('require(')
  })

  test('esm output uses .mjs extension for temp file', () => {
    writeFileSync(join(tempDir, 'package.json'), JSON.stringify({ type: 'module' }))
    const srcFile = join(tempDir, 'MyComp.tsx')
    writeFileSync(srcFile, componentSource)

    const format = detectModuleFormat(srcFile)
    const outExt = format === 'esm' ? '.mjs' : '.tsx'

    expect(outExt).toBe('.mjs')

    const outFile = join(tempDir, `out${outExt}`)
    esbuild.buildSync({
      entryPoints: [srcFile],
      outfile: outFile,
      format,
      bundle: true,
      packages: 'external',
      platform: 'node',
      jsx: 'automatic',
      target: 'es2022',
    })

    expect(existsSync(outFile)).toBe(true)
    expect(outFile.endsWith('.mjs')).toBe(true)
  })

  test('cjs output uses .tsx extension for temp file', () => {
    writeFileSync(join(tempDir, 'package.json'), JSON.stringify({ type: 'commonjs' }))
    const srcFile = join(tempDir, 'MyComp.tsx')
    writeFileSync(srcFile, componentSource)

    const format = detectModuleFormat(srcFile)
    const outExt = format === 'esm' ? '.mjs' : '.tsx'

    expect(outExt).toBe('.tsx')
  })

  test('esm output contains valid export syntax', () => {
    writeFileSync(join(tempDir, 'package.json'), JSON.stringify({ type: 'module' }))
    const srcFile = join(tempDir, 'simple.tsx')
    writeFileSync(
      srcFile,
      `
      export const value = 42
      export const name = 'test'
    `
    )

    const outFile = join(tempDir, 'simple-out.mjs')
    esbuild.buildSync({
      entryPoints: [srcFile],
      outfile: outFile,
      format: 'esm',
      bundle: true,
      packages: 'external',
      platform: 'node',
      jsx: 'automatic',
      target: 'es2022',
    })

    const output = readFileSync(outFile, 'utf-8')
    // esm output uses export statements
    expect(output).toMatch(/export\s*\{/)
    expect(output).toContain('value')
    expect(output).toContain('name')
    expect(output).not.toContain('module.exports')
  })

  test('cjs output can be loaded via require()', () => {
    writeFileSync(join(tempDir, 'package.json'), JSON.stringify({ type: 'commonjs' }))
    const srcFile = join(tempDir, 'simple.tsx')
    writeFileSync(
      srcFile,
      `
      export const value = 99
      export const greeting = 'hello'
    `
    )

    const outFile = join(tempDir, 'simple-out.cjs')
    esbuild.buildSync({
      entryPoints: [srcFile],
      outfile: outFile,
      format: 'cjs',
      bundle: true,
      packages: 'external',
      platform: 'node',
      jsx: 'automatic',
      target: 'es2022',
    })

    const mod = require(outFile)
    expect(mod.value).toBe(99)
    expect(mod.greeting).toBe('hello')
  })
})

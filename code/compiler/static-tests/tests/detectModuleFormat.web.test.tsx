import { join } from 'node:path'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { afterEach, beforeEach, describe, expect, test } from 'vitest'
import { clearFormatCache, detectModuleFormat } from '@tamagui/static'

let tempDir: string

beforeEach(() => {
  clearFormatCache()
  tempDir = mkdtempSync(join(tmpdir(), 'tamagui-detect-'))
})

afterEach(() => {
  rmSync(tempDir, { recursive: true, force: true })
})

describe('detectModuleFormat', () => {
  test('.mjs extension returns esm', () => {
    const file = join(tempDir, 'test.mjs')
    writeFileSync(file, '')
    expect(detectModuleFormat(file)).toBe('esm')
  })

  test('.cjs extension returns cjs', () => {
    const file = join(tempDir, 'test.cjs')
    writeFileSync(file, '')
    expect(detectModuleFormat(file)).toBe('cjs')
  })

  test('type: module in package.json returns esm', () => {
    writeFileSync(join(tempDir, 'package.json'), JSON.stringify({ type: 'module' }))
    const file = join(tempDir, 'index.ts')
    writeFileSync(file, '')
    expect(detectModuleFormat(file)).toBe('esm')
  })

  test('type: commonjs in package.json returns cjs', () => {
    writeFileSync(join(tempDir, 'package.json'), JSON.stringify({ type: 'commonjs' }))
    const file = join(tempDir, 'index.ts')
    writeFileSync(file, '')
    expect(detectModuleFormat(file)).toBe('cjs')
  })

  test('no type field defaults to cjs', () => {
    writeFileSync(join(tempDir, 'package.json'), JSON.stringify({ name: 'test' }))
    const file = join(tempDir, 'index.ts')
    writeFileSync(file, '')
    expect(detectModuleFormat(file)).toBe('cjs')
  })

  test('nested file inherits from nearest package.json', () => {
    writeFileSync(join(tempDir, 'package.json'), JSON.stringify({ type: 'module' }))
    const subDir = join(tempDir, 'src', 'components')
    mkdirSync(subDir, { recursive: true })
    const file = join(subDir, 'Button.tsx')
    writeFileSync(file, '')
    expect(detectModuleFormat(file)).toBe('esm')
  })

  test('nested package.json overrides parent', () => {
    writeFileSync(join(tempDir, 'package.json'), JSON.stringify({ type: 'module' }))
    const subDir = join(tempDir, 'packages', 'legacy')
    mkdirSync(subDir, { recursive: true })
    writeFileSync(join(subDir, 'package.json'), JSON.stringify({ type: 'commonjs' }))
    const file = join(subDir, 'index.ts')
    writeFileSync(file, '')
    expect(detectModuleFormat(file)).toBe('cjs')
  })

  test('.mjs overrides package.json type: commonjs', () => {
    writeFileSync(join(tempDir, 'package.json'), JSON.stringify({ type: 'commonjs' }))
    const file = join(tempDir, 'utils.mjs')
    writeFileSync(file, '')
    expect(detectModuleFormat(file)).toBe('esm')
  })

  test('.cjs overrides package.json type: module', () => {
    writeFileSync(join(tempDir, 'package.json'), JSON.stringify({ type: 'module' }))
    const file = join(tempDir, 'utils.cjs')
    writeFileSync(file, '')
    expect(detectModuleFormat(file)).toBe('cjs')
  })

  test('caches results per directory', () => {
    writeFileSync(join(tempDir, 'package.json'), JSON.stringify({ type: 'module' }))
    const file1 = join(tempDir, 'a.ts')
    const file2 = join(tempDir, 'b.ts')
    writeFileSync(file1, '')
    writeFileSync(file2, '')

    expect(detectModuleFormat(file1)).toBe('esm')
    // remove package.json - should still return esm from cache
    rmSync(join(tempDir, 'package.json'))
    expect(detectModuleFormat(file2)).toBe('esm')
  })
})

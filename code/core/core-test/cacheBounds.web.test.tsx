import { getDefaultTamaguiConfig } from '@tamagui/config-default'
import { beforeAll, expect, test } from 'vitest'
import { createTamagui } from '../web/src/createTamagui'
import { createVariable } from '../web/src/createVariable'
import {
  autoVariables,
  getAutoVariableCSS,
  getCSSVariableCacheStats,
  getMutatedAutoVariableCSS,
  getOrCreateMutatedVariable,
  getOrCreateVariable,
  getVariableGeneration,
  mutatedAutoVariables,
  registerCSSVariable,
} from '../web/src/helpers/registerCSSVariable'
import {
  forceUpdateThemes,
  getNewThemeName,
  getThemeNameCacheSize,
} from '../web/src/hooks/useThemeState'

beforeAll(() => {
  createTamagui(getDefaultTamaguiConfig())
})

test('theme-name memo rolls as a generation without changing held names', () => {
  forceUpdateThemes()
  const heldName = getNewThemeName('light', { name: 'red' })

  for (let i = 0; i <= 10_000; i++) {
    getNewThemeName(`light_${i}`, { name: `missing_${i}` })
  }

  expect(getThemeNameCacheSize()).toBeLessThanOrEqual(10_000)
  expect(heldName).not.toBeNull()
  expect(getNewThemeName('light', { name: 'red' })).toBe(heldName)
})

test('CSS variable mutations advance the generation exactly once', () => {
  const before = getVariableGeneration()
  const created = getOrCreateVariable('generation-created')
  expect(getVariableGeneration()).toBe(before + 1)

  expect(getOrCreateVariable('generation-created')).toBe(created)
  expect(getVariableGeneration()).toBe(before + 1)

  registerCSSVariable(
    createVariable({
      key: 'generation-registered',
      name: 'generation-registered',
      val: 'generation-registered',
    })
  )
  expect(getVariableGeneration()).toBe(before + 2)
})

test('CSS variable memory and output plateau across repeated over-cap generations', () => {
  const first = getOrCreateVariable('cache-bound-first')
  let latest = first
  const retainedBytes: number[] = []
  const rootCSSBytes: number[] = []
  for (let cycle = 0; cycle < 4; cycle++) {
    for (let i = 0; i <= 10_000; i++) {
      latest = getOrCreateVariable(`cache-bound-${i}`)
    }
    const stats = getCSSVariableCacheStats()
    retainedBytes.push(stats.autoRetainedBytes)
    rootCSSBytes.push(`:root{${getAutoVariableCSS()}}`.length)
  }

  const css = getAutoVariableCSS()
  const stats = getCSSVariableCacheStats()
  expect(stats.auto).toBeLessThanOrEqual(10_000)
  expect(stats.autoDeclarations).toBeLessThanOrEqual(10_000)
  expect(retainedBytes.every(Number.isFinite)).toBe(true)
  expect(new Set(retainedBytes).size).toBe(1)
  expect(new Set(rootCSSBytes).size).toBe(1)
  expect(stats.autoCSSBytes).toBe(css.length)
  expect(css).toContain(`--${first.name}:${first.val}`)
  expect(getOrCreateVariable('cache-bound-first')).toBe(first)
  expect(latest).toEqual({
    val: 'cache-bound-10000',
    name: '',
    variable: 'cache-bound-10000',
  })
})

test('mutated variables use a disjoint bounded id range and literal overflow', () => {
  const first = getOrCreateMutatedVariable('mutated-cache-bound-first')
  let latest = first
  const declarationCounts: number[] = []
  for (let cycle = 0; cycle < 4; cycle++) {
    for (let i = 0; i <= 10_000; i++) {
      latest = getOrCreateMutatedVariable(`mutated-cache-bound-${i}`)
    }
    declarationCounts.push(mutatedAutoVariables.length)
  }

  const css = getMutatedAutoVariableCSS()
  const stats = getCSSVariableCacheStats()
  expect(stats.mutated).toBeLessThanOrEqual(10_000)
  expect(stats.mutatedDeclarations).toBeLessThanOrEqual(10_000)
  expect(new Set(declarationCounts).size).toBe(1)
  expect(css).toContain(`--${first.name}:${first.val}`)
  expect(getOrCreateMutatedVariable('mutated-cache-bound-first')).toBe(first)
  expect(Number(first.name.slice(1))).toBeGreaterThanOrEqual(10_000)
  expect(Number(first.name.slice(1))).toBeLessThan(20_000)
  expect(autoVariables.every(({ name }) => Number(name.slice(1)) < 10_000)).toBe(true)
  expect(
    mutatedAutoVariables.every(({ name }) => {
      const id = Number(name.slice(1))
      return id >= 10_000 && id < 20_000
    })
  ).toBe(true)
  expect(latest).toEqual({
    val: 'mutated-cache-bound-10000',
    name: '',
    variable: 'mutated-cache-bound-10000',
  })
})

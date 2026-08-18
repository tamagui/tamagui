import { getDefaultTamaguiConfig } from '@tamagui/config-default'
import { beforeAll, expect, test } from 'vitest'
import { createTamagui } from '../web/src/createTamagui'
import {
  getAutoVariableCSS,
  getCSSVariableCacheStats,
  getMutatedAutoVariableCSS,
  getOrCreateMutatedVariable,
  getOrCreateVariable,
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

test('CSS variable memo rolls while retaining declarations referenced by CSS', () => {
  const first = getOrCreateVariable('cache-bound-first')
  let latest = first
  for (let i = 0; i <= 10_000; i++) {
    latest = getOrCreateVariable(`cache-bound-${i}`)
  }

  const css = getAutoVariableCSS()
  const stats = getCSSVariableCacheStats()
  expect(stats.auto).toBeLessThanOrEqual(10_000)
  expect(stats.autoDeclarations).toBeLessThanOrEqual(10_000)
  expect(css).toContain(`--${first.name}:${first.val}`)
  expect(css).toContain(`--${latest.name}:${latest.val}`)
})

test('mutated variable memo retains declarations across stylesheet generations', () => {
  const first = getOrCreateMutatedVariable('mutated-cache-bound-first')
  let latest = first
  for (let i = 0; i <= 10_000; i++) {
    latest = getOrCreateMutatedVariable(`mutated-cache-bound-${i}`)
  }

  const css = getMutatedAutoVariableCSS()
  const stats = getCSSVariableCacheStats()
  expect(stats.mutated).toBeLessThanOrEqual(10_000)
  expect(stats.mutatedDeclarations).toBeLessThanOrEqual(10_000)
  expect(css).toContain(`--${first.name}:${first.val}`)
  expect(css).toContain(`--${latest.name}:${latest.val}`)
})

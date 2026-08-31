process.env.TAMAGUI_TARGET = 'web'

// the runtime's compact classifier and tooling registry must bind every
// property to the same token category.

import { getTokenCategory, grammarEntries } from '@tamagui/style-grammar/tooling'
import { beforeAll, expect, test } from 'vitest'
import config from '../config-default'
import { Text, View, createTamagui, getSplitStyles } from '../web/src'
import { getTokenCategoryForProperty } from '../web/src/helpers/tokenCategories'
import { exposeClassProperties } from './utils'

beforeAll(() => {
  createTamagui(config.getDefaultTamaguiConfig() as any)
})

const opts = { isAnimated: false, noClass: false, resolveValues: 'auto' } as any

const split = (props: Record<string, any>, staticConfig = View.staticConfig) =>
  exposeClassProperties(
    getSplitStyles(
      props,
      staticConfig,
      undefined as any,
      'light',
      { unmounted: false } as any,
      opts
    )
  )

const rulesFor = (result: any, identifier: string): string[] =>
  result.rulesToInsert[identifier]?.[4] ?? []

test('borderWidth binds the space category like the tooling says it does', () => {
  const result = split({ borderWidth: '4' })
  const rules = rulesFor(result, result.classNames.borderWidth).join('')
  expect(rules).toContain('border-style:solid')
  expect(rules).toContain('border-width:var(--')
})

test('a side border width binds the space category on its own', () => {
  const result = split({ borderTopWidth: '4' })
  const className = result.classNames.borderTopWidth
  expect(className).toBeTruthy()
  const rules = rulesFor(result, className).join('')
  expect(rules).toContain('border-top-width:var(--')
  expect(rules).toContain('border-top-style:solid')

  const explicit = split({ borderTopWidth: 'hover:4', borderTopStyle: 'dashed' })
  const styleRules = rulesFor(explicit, explicit.classNames.borderTopStyle).join('')
  expect(styleRules).toContain('border-top-style:dashed')
  expect(styleRules).not.toContain('border-top-style:solid')
})

test('fontFamily resolves the configured font and records the scope', () => {
  const result = split({ fontFamily: 'heading' }, Text.staticConfig)
  // the font scope drives the font_heading class; without it the family
  // variable resolves to the default font and the value is silently wrong
  expect(result.fontFamily).toBe('heading')
  const className = result.classNames.fontFamily
  expect(className).toBeTruthy()
  const [rule] = rulesFor(result, className)
  expect(rule).toContain('var(--f-family)')
})

test('every property the grammar registry binds, the runtime binds identically', () => {
  // the registry's font sub-categories all route through the runtime's
  // per-family 'font' handling; fontFamily gets its own binding because its
  // names are font families, not sub-map entries
  const runtimeCategoryFor = (registryCategory: string) =>
    registryCategory === 'fontSize' ||
    registryCategory === 'fontWeight' ||
    registryCategory === 'lineHeight' ||
    registryCategory === 'letterSpacing'
      ? 'font'
      : registryCategory
  for (const entry of grammarEntries) {
    const bound = getTokenCategory(entry.prop)
    if (!bound) continue
    expect(getTokenCategoryForProperty(entry.prop), entry.prop).toBe(
      runtimeCategoryFor(bound)
    )
  }
})

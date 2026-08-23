import { createModifierRegistry } from '@tamagui/style-grammar/tooling'
import { beforeAll, expect, test } from 'vitest'

import config from '../config-default'
import { View, createTamagui } from '../web/src'
import { simplifiedGetSplitStyles } from './utils'

beforeAll(() => {
  const configured = config.getDefaultTamaguiConfig() as any
  configured.media = Object.assign(
    Object.create({ 'inherited-media': { minWidth: 1006 } }),
    {
      ...configured.media,
      'group-hover': { minWidth: 1001 },
      'group-nope': { minWidth: 1002 },
      'group-active': { minWidth: 1003 },
      'wide.dot': { minWidth: 1004 },
      constructor: { minWidth: 1005 },
      hover: { minWidth: 1007 },
    }
  )
  configured.themes = {
    ...configured.themes,
    'group-brand': configured.themes.light,
  }
  createTamagui(configured)
})

const rulesFor = (result: any): string[] =>
  Object.values(result.rulesToInsert ?? {}).flatMap((entry: any) => entry?.[4] ?? [])

test('invalid configured names do not change valid authored group clauses', () => {
  const configured = createModifierRegistry({
    mediaNames: ['group-hover', 'group-active'],
    themeNames: ['group-brand'],
  })
  expect(configured.registry.get('group-hover')).toBe('group')
  expect(configured.registry.get('group-active')).toBe('group')
  expect(configured.diagnostics).toEqual([
    'modifier "group-hover" is not registered: the "group-" prefix is reserved for group state modifiers; rename this media name so it does not begin with "group-"',
    'modifier "group-active" is not registered: the "group-" prefix is reserved for group state modifiers; rename this media name so it does not begin with "group-"',
    'modifier "group-brand" is not registered: the "group-" prefix is reserved for group state modifiers; rename this theme name so it does not begin with "group-"',
  ])

  for (const [name, selector, configuredWidth] of [
    ['group-hover', ':hover', 1001],
    ['group-active', ':active', 1003],
  ] as const) {
    const result = simplifiedGetSplitStyles(View, {
      backgroundColor: `red ${name}:blue`,
    })
    const rules = rulesFor(result).join('')
    expect(rules, name).toContain(`.t_group_true${selector}`)
    expect(rules, name).not.toContain(`min-width: ${configuredWidth}px`)
    expect(result.hasMedia, name).toBeFalsy()
    expect(result.pseudoGroups?.has('true'), name).toBe(true)
  }

  for (const name of ['group-nope', 'group-brand']) {
    const result = simplifiedGetSplitStyles(View, {
      backgroundColor: `red ${name}:blue`,
    })
    const rules = rulesFor(result)
    expect(result.style?.backgroundColor ?? null, name).toBe(null)
    expect(rules, name).toHaveLength(1)
    expect(rules[0], name).toContain('background-color:red')
    expect(rules[0], name).not.toContain('blue')
    expect(result.pseudoGroups?.size ?? 0, name).toBe(0)
  }
})

test('container size and name segments share the strict identifier grammar', () => {
  for (const modifier of ['@wide.dot', '@sm/a.b', '@sm/a/b', '@sm/café']) {
    const result = simplifiedGetSplitStyles(
      View,
      { backgroundImage: `none ${modifier}:linear-gradient(red, blue)` },
      { noClass: true }
    )
    expect(result.style?.backgroundImage ?? null, modifier).toBe('none')
    expect(result.pseudoGroups?.size ?? 0, modifier).toBe(0)
    expect(result.mediaGroups?.size ?? 0, modifier).toBe(0)
  }
})

test('a media size shadowed by a state has no container form', () => {
  const result = simplifiedGetSplitStyles(
    View,
    { backgroundImage: 'none @hover:linear-gradient(red, blue)' },
    { noClass: true }
  )

  expect(result.style?.backgroundImage).toBe('none')
  expect(result.pseudoGroups?.size ?? 0).toBe(0)
  expect(result.mediaGroups?.size ?? 0).toBe(0)
})

test('an own configured constructor key is ordinary media', () => {
  const result = simplifiedGetSplitStyles(View, {
    backgroundColor: 'red constructor:blue',
  })
  expect(rulesFor(result).join('')).toContain('@media (min-width: 1005px)')
  expect(result.hasMedia?.has('constructor')).toBe(true)
})

test('an inherited configured media key is not a modifier', () => {
  const result = simplifiedGetSplitStyles(View, {
    backgroundColor: 'red inherited-media:blue',
  })
  const rules = rulesFor(result)
  expect(result.style?.backgroundColor ?? null).toBe(null)
  expect(rules).toHaveLength(1)
  expect(rules[0]).toContain('background-color:red')
  expect(rules[0]).not.toContain('blue')
  expect(result.hasMedia).toBeFalsy()
})

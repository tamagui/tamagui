import { beforeAll, expect, test, vi } from 'vitest'

import config from '../config-default'
import { View, createTamagui, getSplitStyles } from '../web/src'

const defaultConfig = config.getDefaultTamaguiConfig()

beforeAll(() => {
  createTamagui({
    ...defaultConfig,
    settings: {
      ...defaultConfig.settings,
      legacyConditionObjects: true,
    },
  } as any)
})

const opts = { isAnimated: false, noClass: false, resolveValues: 'auto' } as any

const split = (props: Record<string, any>) =>
  getSplitStyles(
    props,
    View.staticConfig,
    undefined as any,
    'light',
    { unmounted: false } as any,
    opts
  )

const programRules = (result: any, property: string): string[] => {
  const className = result.classNames[property]
  return result.rulesToInsert[className]?.[4] ?? []
}

test('legacy hover object produces the same program block as a flat value', () => {
  const flat = split({ backgroundColor: 'red hover:blue' })
  const legacy = split({
    backgroundColor: 'red',
    hoverStyle: { backgroundColor: 'blue' },
  })

  expect(legacy.classNames.backgroundColor).toBe(flat.classNames.backgroundColor)
  expect(programRules(legacy, 'backgroundColor')).toEqual(
    programRules(flat, 'backgroundColor')
  )
})

test('legacy clauses append to an existing program at their authored position', () => {
  const flat = split({ backgroundColor: 'red focus:yellow hover:blue' })
  const legacy = split({
    backgroundColor: 'red focus:yellow',
    hoverStyle: { backgroundColor: 'blue' },
  })

  expect(legacy.classNames.backgroundColor).toBe(flat.classNames.backgroundColor)
  expect(programRules(legacy, 'backgroundColor')).toEqual(
    programRules(flat, 'backgroundColor')
  )
})

test('legacy clause without an earlier value stays a clause-only program', () => {
  const flat = split({ backgroundColor: 'hover:blue' })
  const legacy = split({ hoverStyle: { backgroundColor: 'blue' } })

  expect(legacy.classNames.backgroundColor).toBe(flat.classNames.backgroundColor)
  expect(programRules(legacy, 'backgroundColor')).toEqual(
    programRules(flat, 'backgroundColor')
  )
})

test('legacy theme object produces the same program block as a theme clause', () => {
  const flat = split({ color: 'red dark:blue' })
  const legacy = split({ color: 'red', '$theme-dark': { color: 'blue' } })

  expect(legacy.classNames.color).toBe(flat.classNames.color)
  expect(programRules(legacy, 'color')).toEqual(programRules(flat, 'color'))
})

test('legacy media object produces the same program block as a media clause', () => {
  const flat = split({ paddingTop: '4 sm:6' })
  const legacy = split({ paddingTop: '$4', $sm: { paddingTop: '$6' } })

  expect(legacy.classNames.paddingTop).toBe(flat.classNames.paddingTop)
  expect(programRules(legacy, 'paddingTop')).toEqual(programRules(flat, 'paddingTop'))
})

test('nested media and pseudo objects preserve outer-to-inner modifier order', () => {
  const flat = split({ backgroundColor: 'red sm:hover:blue' })
  const legacy = split({
    backgroundColor: 'red',
    $sm: { hoverStyle: { backgroundColor: 'blue' } },
  })

  expect(legacy.classNames.backgroundColor).toBe(flat.classNames.backgroundColor)
  expect(programRules(legacy, 'backgroundColor')).toEqual(
    programRules(flat, 'backgroundColor')
  )
})

test('conversion errors note once per key and fall through to legacy handling', () => {
  const info = vi.spyOn(console, 'info').mockImplementation(() => {})
  const previousNodeEnv = process.env.NODE_ENV
  process.env.NODE_ENV = 'development'

  try {
    // skewX still has no flat spelling (the transform family covers x, y, scale,
    // scaleX, scaleY, rotate), so its conversion still errors and falls through
    const result = split({ hoverStyle: { skewX: '10deg' } })
    split({ hoverStyle: { skewX: '20deg' } })

    expect(info).toHaveBeenCalledTimes(1)
    expect(info).toHaveBeenCalledWith(expect.stringContaining('legacy-transform-part'))
    expect(
      Object.values(result.rulesToInsert)
        .flatMap((rule: any) => rule[4])
        .some((rule) => rule.includes(':hover') && rule.includes('transform'))
    ).toBe(true)
  } finally {
    process.env.NODE_ENV = previousNodeEnv
    info.mockRestore()
  }
})

test('noClass web configurations stay on legacy condition handling', () => {
  const result = getSplitStyles(
    {
      backgroundColor: 'red',
      hoverStyle: { backgroundColor: 'blue' },
    },
    View.staticConfig,
    undefined as any,
    'light',
    { unmounted: false, hover: true } as any,
    { ...opts, noClass: true }
  )

  expect(result.style?.backgroundColor).toBe('blue')
  expect(
    Object.values(result.classNames).some((value) => String(value).startsWith('_bc-'))
  ).toBe(false)
})

test('the setting defaults off and preserves legacy condition handling', () => {
  // the engine-contraction A/B bed forces the gate on suite-wide; this test
  // asserts the shipped default, so it clears the override
  delete process.env.TAMAGUI_AB_LEGACY_PROGRAMS
  createTamagui(defaultConfig)
  try {
    const result = split({
      backgroundColor: 'red',
      hoverStyle: { backgroundColor: 'blue' },
    })

    expect(result.classNames.backgroundColor).not.toMatch(/^_bc-/)
    expect(
      Object.values(result.rulesToInsert)
        .flatMap((rule: any) => rule[4])
        .some((rule) => rule.includes(':hover') && rule.includes('background-color:blue'))
    ).toBe(true)
  } finally {
    createTamagui({
      ...defaultConfig,
      settings: {
        ...defaultConfig.settings,
        legacyConditionObjects: true,
      },
    } as any)
  }
})

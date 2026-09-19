process.env.TAMAGUI_TARGET = 'web'

// resolveSizing against the real v6 config: token keys pass through, geometry
// derives from the font and space scales. The derived px must equal the
// frozen per-component tables they replace (button heights plus the 1px
// border each side, button icons, checkbox squares).

import { expect, test } from 'vitest'

import { defaultConfig } from '@tamagui/config/v6'
import { type ComponentSize, createTamagui, getConfig, resolveSizing } from '../web/src'

createTamagui(defaultConfig as any)

const conf = getConfig()
const env = {
  sizing: conf.sizing,
  fonts: conf.fontsParsed,
  tokens: conf.tokensParsed,
  font: conf.fontsParsed[conf.defaultFontToken],
}

test('rungs pass keys through and derive the frozen px', () => {
  expect(resolveSizing('md', env)).toEqual({
    name: 'md',
    fontSize: 'sm',
    lineHeight: 'sm',
    paddingInline: '4',
    paddingBlock: '2',
    gap: '2',
    radius: 'md',
    height: 36,
    icon: 16,
    square: 22,
  })
  expect(resolveSizing('xs', env)).toMatchObject({ height: 24, icon: 12, square: 17 })
  expect(resolveSizing('sm', env)).toMatchObject({ height: 32, icon: 16, square: 20 })
  expect(resolveSizing('lg', env)).toMatchObject({ height: 40, icon: 16, square: 25 })
  expect(resolveSizing('xl', env)).toMatchObject({ height: 48, icon: 20, square: 28 })
})

test('outer heights match the frozen button ladder', () => {
  const outer = (size: ComponentSize) => resolveSizing(size, env)!.height + 2
  expect([outer('xs'), outer('sm'), outer('md'), outer('lg'), outer('xl')]).toEqual([
    26, 34, 38, 42, 50,
  ])
})

test('true and absent resolve to the default rung, false to no styles', () => {
  expect(resolveSizing(true, env)).toEqual(resolveSizing('md', env))
  expect(resolveSizing(undefined, env)).toEqual(resolveSizing('md', env))
  expect(resolveSizing(false, env)).toBeUndefined()
})

test('render code without an env reads the active config', () => {
  expect(resolveSizing('md')).toEqual(resolveSizing('md', env))
})

test('an unknown name throws in development, degrades in production', () => {
  const prev = process.env.NODE_ENV
  try {
    process.env.NODE_ENV = 'development'
    expect(() => resolveSizing('xxl' as any, env)).toThrow('unknown size "xxl"')
  } finally {
    process.env.NODE_ENV = prev
  }
  expect(resolveSizing('xxl' as any, env)).toEqual(resolveSizing('md', env))
})

import { getDefaultTamaguiConfig } from '../../../config-default/src'
import { View as CoreView, createTamagui, getConfig } from '@tamagui/web'
import { afterEach, beforeAll, describe, expect, test, vi } from 'vitest'

import { preprocessTailwindClassName } from '../candidate'
import { tailwindStyleFrontend } from '../frontend'
import { Text, View } from '../index'
import { splitTailwindStyles, styleOf } from './utils'

beforeAll(() => {
  createTamagui(getDefaultTamaguiConfig('native') as any)
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('claimed candidates resolve to native style values', () => {
  test('a token candidate resolves through the config', () => {
    const styles = splitTailwindStyles(View, { className: 'p-4' })
    const expected = getConfig().tokensParsed.space['$4'].val

    expect(styleOf(styles).paddingTop).toBe(expected)
    expect(styleOf(styles).paddingLeft).toBe(expected)
  })

  test('a px arbitrary becomes a number, which is what react native accepts', () => {
    const styles = splitTailwindStyles(View, { className: 'w-[400px]' })

    expect(styleOf(styles).width).toBe(400)
  })

  test('font size stays numeric on native', () => {
    const styles = splitTailwindStyles(Text, { className: 'text-[14px]' })

    expect(styleOf(styles).fontSize).toBe(14)
  })

  test('a whole-class utility applies as an ordinary prop', () => {
    const styles = splitTailwindStyles(View, { className: 'flex-row' })

    expect(styleOf(styles).flexDirection).toBe('row')
  })
})

describe('web-only candidates', () => {
  test('an unclaimed class is dropped instead of leaking into native className', () => {
    const result = preprocessTailwindClassName({ className: 'grid-cols-3' }, getConfig())

    expect(result.className).toBeUndefined()
  })

  test('dropping a web-only candidate warns once, naming the class', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    // a spelling no other test uses, so the module-level warned set is cold
    preprocessTailwindClassName({ className: 'float-right' }, getConfig())
    preprocessTailwindClassName({ className: 'float-right' }, getConfig())

    expect(warn).toHaveBeenCalledTimes(1)
    expect(warn.mock.calls[0][0]).toContain('float-right')
  })
})

describe('conditions evaluate on native', () => {
  test('a hover clause only applies while hovered', () => {
    const base = splitTailwindStyles(View, {
      className: 'bg-[red] hover:bg-[blue]',
    })
    const hovered = splitTailwindStyles(
      View,
      { className: 'bg-[red] hover:bg-[blue]' },
      { componentState: { hover: true } }
    )

    expect(styleOf(base).backgroundColor).toBe('red')
    expect(styleOf(hovered).backgroundColor).toBe('blue')
  })
})

describe('frontend isolation', () => {
  test('the tailwind View is its own component carrying the descriptor', () => {
    expect(CoreView).not.toBe(View)
    expect(View.staticConfig.styleFrontend).toBe(tailwindStyleFrontend)
  })
})

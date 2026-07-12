import { beforeAll, describe, expect, test } from 'vitest'

import { defaultConfig } from '@tamagui/config/v6'
import { View, createTamagui, getConfig, StyleObjectValue } from '../web/src'
import { simplifiedGetSplitStyles, findRule } from './utils'

// standard tailwind arbitrary values: prop-[value] uses the bracketed CSS directly.
beforeAll(() => {
  createTamagui({
    ...(defaultConfig as any),
    settings: {
      ...(defaultConfig as any).settings,
      styleMode: 'tamagui-and-tailwind',
    },
  })
})

function ruleFor(className: string, prop: string) {
  const theme = (getConfig() as any).themes.light
  const styles = simplifiedGetSplitStyles(View, { className } as any, { theme })
  return findRule(styles.rulesToInsert, prop)
}

const cases: [string, string, any][] = [
  ['w-[100px]', 'width', '100px'],
  ['p-[4px]', 'paddingTop', '4px'],
  ['m-[10px]', 'marginTop', '10px'],
  ['rounded-[8px]', 'borderTopLeftRadius', '8px'],
  ['min-h-[100vh]', 'minHeight', '100vh'],
  ['max-h-[50vh]', 'maxHeight', '50vh'],
  ['gap-[8px]', 'gap', '8px'],
  ['top-[-4px]', 'top', '-4px'],
  ['bg-[var(--color5)]', 'backgroundColor', 'var(--color5)'],
  ['bg-[#fff]', 'backgroundColor', '#fff'],
  ['h-[calc(100%-2px)]', 'height', 'calc(100%-2px)'],
]

describe('styleMode arbitrary values', () => {
  for (const [className, prop, value] of cases) {
    test(`${className} → ${prop}=${value}`, () => {
      const rule = ruleFor(className, prop)
      expect(rule).toBeTruthy()
      expect(rule[StyleObjectValue]).toBe(value)
    })
  }

  test('underscores in arbitrary values become spaces (h-[calc(100%_-_2px)])', () => {
    const rule = ruleFor('h-[calc(100%_-_2px)]', 'height')
    expect(rule).toBeTruthy()
    expect(rule[StyleObjectValue]).toBe('calc(100% - 2px)')
  })

  test('rotate-[-8deg] → transform rotate', () => {
    const rule = ruleFor('rotate-[-8deg]', 'transform')
    expect(rule).toBeTruthy()
    expect(rule[StyleObjectValue]).toContain('rotate(-8deg)')
  })

  test('arbitrary value composes with a modifier', () => {
    const rule = ruleFor('hover:w-[42px]', 'width')
    // hover rule stores width under the hover pseudo
    const theme = (getConfig() as any).themes.light
    const styles = simplifiedGetSplitStyles(
      View,
      { className: 'hover:w-[42px]' } as any,
      {
        theme,
      }
    )
    const rules = Object.values(styles.rulesToInsert || {}) as any[]
    expect(rules.some((r) => r[StyleObjectValue] === '42px')).toBe(true)
  })
})

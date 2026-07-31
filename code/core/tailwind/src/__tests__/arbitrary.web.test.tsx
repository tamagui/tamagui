import { beforeAll, describe, expect, test } from 'vitest'

import { defaultConfig } from '@tamagui/config/v6'
import { StyleObjectRules } from '@tamagui/helpers'
import { StyleObjectValue, createTamagui, getConfig } from '@tamagui/web'
import { Text, View } from '../index'
import { findRule, splitTailwindStyles } from './utils'

// standard tailwind arbitrary values: prop-[value] uses the bracketed CSS directly.
beforeAll(() => {
  createTamagui(defaultConfig as any)
})

function ruleFor(className: string, prop: string) {
  const theme = (getConfig() as any).themes.light
  const styles = splitTailwindStyles(View, { className } as any, { theme })
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

describe('tailwind arbitrary values', () => {
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

  test('rotate-[-8deg] → rotate program', () => {
    // the transform family lowers rotate to the CSS `rotate` property
    const theme = (getConfig() as any).themes.light
    const styles = splitTailwindStyles(View, { className: 'rotate-[-8deg]' } as any, {
      theme,
    })
    const rule = findRule(styles.rulesToInsert, 'rotate')
    expect(rule).toBeTruthy()
    expect((rule[StyleObjectRules] ?? []).join('')).toContain('rotate:-8deg')
  })

  test('arbitrary value composes with a modifier', () => {
    const rule = ruleFor('hover:w-[42px]', 'width')
    // hover rule stores width under the hover pseudo
    const theme = (getConfig() as any).themes.light
    const styles = splitTailwindStyles(
      View,
      { className: 'hover:w-[42px]' } as any,
      {
        theme,
      }
    )
    const allRules = (Object.values(styles.rulesToInsert || {}) as any[])
      .flatMap((r) => r[4] ?? [])
      .join('')
    expect(allRules).toContain(':hover')
    expect(allRules).toContain('42px')
  })
})

describe('tailwind negative utilities', () => {
  test('-m-1 resolves the configured negative space token', () => {
    expect(ruleFor('-m-1', 'marginTop')[StyleObjectValue]).toContain('var(--')
  })

  test('-mt-2 resolves the configured negative space token', () => {
    expect(ruleFor('-mt-2', 'marginTop')[StyleObjectValue]).toContain('var(--')
  })

  test('-top-1 resolves the configured negative space token', () => {
    expect(ruleFor('-top-1', 'top')[StyleObjectValue]).toContain('var(--')
  })

  test('positive m-1 resolves the configured space token', () => {
    expect(ruleFor('m-1', 'marginTop')[StyleObjectValue]).toContain('var(--')
  })
})

describe('tailwind letterSpacing / boxShadow / scale', () => {
  // letterSpacing is a text prop → resolve on Text
  const textRule = (className: string, prop: string) =>
    findRule(splitTailwindStyles(Text, { className } as any).rulesToInsert, prop)

  test('tracking-[-1px] → letterSpacing -1px', () => {
    expect(textRule('tracking-[-1px]', 'letterSpacing')[StyleObjectValue]).toBe('-1px')
  })

  test('tracking-1 → the $1 letterSpacing token', () => {
    expect(textRule('tracking-1', 'letterSpacing')[StyleObjectValue]).toContain('var(--')
  })

  test('shadow-[..] → arbitrary boxShadow with underscores as spaces', () => {
    expect(
      ruleFor('shadow-[0_8px_18px_rgba(0,0,0,0.1)]', 'boxShadow')[StyleObjectValue]
    ).toBe('0 8px 18px rgba(0,0,0,0.1)')
  })

  // scale lowers to --t-scale-* axis programs plus the shared composition rule
  function scaleAxisText(className: string): string {
    const theme = (getConfig() as any).themes.light
    const styles = splitTailwindStyles(View, { className } as any, { theme })
    const axisClass = styles.classNames['--t-scale-x']
    return (styles.rulesToInsert[axisClass]?.[StyleObjectRules] ?? []).join('')
  }

  test('scale-95 → axis programs at 0.95 (percentage utility, /100 like opacity)', () => {
    expect(scaleAxisText('scale-95')).toContain('--t-scale-x:0.95')
  })

  test('scale-100 → axis programs at 1', () => {
    expect(scaleAxisText('scale-100')).toContain('--t-scale-x:1')
  })

  test('scale-[0.95] arbitrary is unchanged', () => {
    expect(scaleAxisText('scale-[0.95]')).toContain('--t-scale-x:0.95')
  })
})

import { beforeAll, describe, expect, test } from 'vitest'

import { defaultConfig } from '@tamagui/config/v6'
import { StyleObjectValue, createTamagui } from '@tamagui/web'
import { Text, View } from '../index'
import { findRule, splitTailwindStyles } from './utils'

// standard tailwind utilities that styleMode previously passed through as no-op classes.
// text-style utilities apply on Text (View filters them); layout ones apply on View.
beforeAll(() => {
  createTamagui(defaultConfig as any)
})

function ruleFor(comp: any, className: string, prop: string) {
  const styles = splitTailwindStyles(comp, { className } as any)
  return findRule(styles.rulesToInsert, prop)
}

const textCases: [string, string, any][] = [
  ['font-bold', 'fontWeight', '700'],
  ['font-semibold', 'fontWeight', '600'],
  ['font-extrabold', 'fontWeight', '800'],
  ['font-black', 'fontWeight', '900'],
  ['italic', 'fontStyle', 'italic'],
  ['not-italic', 'fontStyle', 'normal'],
  ['uppercase', 'textTransform', 'uppercase'],
  ['lowercase', 'textTransform', 'lowercase'],
  ['capitalize', 'textTransform', 'capitalize'],
  ['underline', 'textDecorationLine', 'underline'],
  ['line-through', 'textDecorationLine', 'line-through'],
  ['no-underline', 'textDecorationLine', 'none'],
  ['decoration-dashed', 'textDecorationStyle', 'dashed'],
  ['decoration-red-500', 'textDecorationColor', 'var(--c-color-red-500)'],
]

const viewCases: [string, string, any][] = [
  ['object-contain', 'objectFit', 'contain'],
  ['object-cover', 'objectFit', 'cover'],
  ['fixed', 'position', 'fixed'],
  ['sticky', 'position', 'sticky'],
  ['pointer-events-none', 'pointerEvents', 'none'],
  ['pointer-events-auto', 'pointerEvents', 'auto'],
  ['box-border', 'boxSizing', 'border-box'],
  ['box-content', 'boxSizing', 'content-box'],
  ['bg-none', 'backgroundImage', 'none'],
]

describe('tailwind standard utilities', () => {
  for (const [className, prop, value] of textCases) {
    test(`Text ${className} → ${prop}=${value}`, () => {
      const rule = ruleFor(Text, className, prop)
      expect(rule).toBeTruthy()
      expect(rule[StyleObjectValue]).toBe(value)
    })
  }

  for (const [className, prop, value] of viewCases) {
    test(`View ${className} → ${prop}=${value}`, () => {
      const rule = ruleFor(View, className, prop)
      expect(rule).toBeTruthy()
      expect(rule[StyleObjectValue]).toBe(value)
    })
  }

  test('utilities compose with modifiers (hover:font-bold)', () => {
    const styles = splitTailwindStyles(Text, { className: 'hover:font-bold' } as any)
    const rules = (styles.rulesToInsert[styles.classNames.fontWeight]?.[4] ?? []).join('')
    expect(rules).toContain(':hover')
    expect(rules).toContain('700')
  })

  test('filter utilities compose in Tailwind order', () => {
    const rule = ruleFor(View, 'sepia-50 brightness-105 blur-sm contrast-125', 'filter')

    expect(rule[StyleObjectValue]).toBe(
      'blur(8px) brightness(105%) contrast(125%) sepia(50%)'
    )
  })

  test('drop-shadow utilities compose geometry and color in filter order', () => {
    for (const className of [
      'drop-shadow-[red] drop-shadow-md brightness-105',
      'brightness-105 drop-shadow-md drop-shadow-[red]',
    ]) {
      const rule = ruleFor(View, className, 'filter')
      expect(rule[StyleObjectValue]).toBe('brightness(105%) drop-shadow(0 3px 3px red)')
    }
  })

  // font-* is fontFamily (font weights are separate, tested above)
  const fontFamilyCases: [string, any][] = [
    ['font-mono', 'monospace'],
    ['font-sans', 'sans-serif'],
    ['font-serif', 'serif'],
    ['font-[Inter]', 'Inter'],
  ]
  for (const [className, value] of fontFamilyCases) {
    test(`Text ${className} → fontFamily=${value}`, () => {
      const rule = ruleFor(Text, className, 'fontFamily')
      expect(rule).toBeTruthy()
      expect(rule[StyleObjectValue]).toBe(value)
    })
  }

  test('font-<tamaguiFamily> resolves to a font-family css var', () => {
    const rule = ruleFor(Text, 'font-heading', 'fontFamily')
    expect(rule).toBeTruthy()
    expect(rule[StyleObjectValue]).toContain('var(--')
  })

  test('font-bold still maps to fontWeight, not fontFamily', () => {
    const rule = ruleFor(Text, 'font-bold', 'fontWeight')
    expect(rule).toBeTruthy()
    expect(rule[StyleObjectValue]).toBe('700')
  })

  test('size-10 sets width and height from the size token', () => {
    const styles = splitTailwindStyles(View, { className: 'size-10' } as any)
    expect(findRule(styles.rulesToInsert, 'width')[StyleObjectValue]).toContain('var(--')
    expect(findRule(styles.rulesToInsert, 'height')[StyleObjectValue]).toContain('var(--')
  })

  test('rounded-t-xl sets only the top corners', () => {
    const styles = splitTailwindStyles(View, { className: 'rounded-t-xl' } as any)
    expect(
      findRule(styles.rulesToInsert, 'borderTopLeftRadius')[StyleObjectValue]
    ).toContain('var(--')
    expect(
      findRule(styles.rulesToInsert, 'borderTopRightRadius')[StyleObjectValue]
    ).toContain('var(--')
    expect(findRule(styles.rulesToInsert, 'borderBottomLeftRadius')).toBeNull()
  })

  test('border-t-4 sets only the top width', () => {
    const styles = splitTailwindStyles(View, { className: 'border-t-4' } as any)
    expect(findRule(styles.rulesToInsert, 'borderTopWidth')[StyleObjectValue]).toContain(
      'var(--'
    )
    expect(findRule(styles.rulesToInsert, 'borderLeftWidth')).toBeNull()
  })

  test('bare border-x sets left and right width to 1', () => {
    const styles = splitTailwindStyles(View, { className: 'border-x' } as any)
    expect(findRule(styles.rulesToInsert, 'borderLeftWidth')[StyleObjectValue]).toBe(
      '1px'
    )
    expect(findRule(styles.rulesToInsert, 'borderRightWidth')[StyleObjectValue]).toBe(
      '1px'
    )
  })

  test('inset-x-0 pins left and right', () => {
    const styles = splitTailwindStyles(View, { className: 'inset-x-0' } as any)
    expect(findRule(styles.rulesToInsert, 'left')[StyleObjectValue]).toContain('var(--')
    expect(findRule(styles.rulesToInsert, 'right')[StyleObjectValue]).toContain('var(--')
    expect(findRule(styles.rulesToInsert, 'top')).toBeNull()
  })

  test('negative position fractions and zero preserve their geometry', () => {
    const styles = splitTailwindStyles(View, {
      className: '-left-full -top-1/2 -m-0',
    } as any)
    expect(findRule(styles.rulesToInsert, 'left')[StyleObjectValue]).toBe('-100%')
    expect(findRule(styles.rulesToInsert, 'top')[StyleObjectValue]).toBe('-50%')
    expect(findRule(styles.rulesToInsert, 'margin')[StyleObjectValue]).toBe('0px')
  })

  test('auto margins preserve Yoga-compatible auto values', () => {
    const styles = splitTailwindStyles(View, { className: 'mx-auto' } as any)
    expect(findRule(styles.rulesToInsert, 'marginLeft')[StyleObjectValue]).toBe('auto')
    expect(findRule(styles.rulesToInsert, 'marginRight')[StyleObjectValue]).toBe('auto')
  })

  test('logical spacing and gap axes emit browser-native logical properties', () => {
    const styles = splitTailwindStyles(View, {
      className: 'ps-4 pe-2 pbs-4 pbe-2 ms-2 me-4 mbs-2 mbe-4 gap-x-2 gap-y-4',
    } as any)

    for (const prop of [
      'paddingInlineStart',
      'paddingInlineEnd',
      'marginInlineStart',
      'marginInlineEnd',
      'paddingTop',
      'paddingBottom',
      'marginTop',
      'marginBottom',
      'columnGap',
      'rowGap',
    ]) {
      expect(findRule(styles.rulesToInsert, prop), prop).toBeTruthy()
    }
  })

  test('translate fractions and numeric leading emit Tailwind geometry', () => {
    const translated = splitTailwindStyles(View, {
      className: '-translate-x-1/2 translate-y-full',
    } as any)
    const xRules = translated.rulesToInsert[translated.classNames['--t-x']]?.[4] ?? []
    const yRules = translated.rulesToInsert[translated.classNames['--t-y']]?.[4] ?? []
    expect(xRules.join('')).toContain('--t-x:-50%')
    expect(yRules.join('')).toContain('--t-y:100%')

    const leading = ruleFor(Text, 'leading-4', 'lineHeight')
    expect(leading[StyleObjectValue]).toBe('16px')
  })

  test('fractional flex shorthand emits all three CSS flex longhands', () => {
    const styles = splitTailwindStyles(View, { className: 'flex-1/2' } as any)
    expect(findRule(styles.rulesToInsert, 'flexGrow')[StyleObjectValue]).toBe('1')
    expect(findRule(styles.rulesToInsert, 'flexShrink')[StyleObjectValue]).toBe('1')
    expect(findRule(styles.rulesToInsert, 'flexBasis')[StyleObjectValue]).toBe('50%')
  })

  test('representable text shadow presets render with order-independent color', () => {
    for (const className of [
      'text-shadow-red-500 text-shadow-xs',
      'text-shadow-xs text-shadow-red-500',
    ]) {
      const styles = splitTailwindStyles(Text, { className } as any)
      const rules = (Object.values(styles.rulesToInsert) as any[])
        .flatMap((rule) => rule[4] || [])
        .join('')
      expect(rules).toContain('text-shadow:')
      expect(rules).toContain('red-500')
      expect(rules).toContain('0px 1px 1px')
    }
  })

  test('inset ring and shadow utilities compose in Tailwind order', () => {
    const styles = splitTailwindStyles(View, {
      className: 'inset-ring-[red] inset-ring-2 inset-shadow-xs',
    } as any)
    const rule = findRule(styles.rulesToInsert, 'boxShadow')
    expect(rule[StyleObjectValue]).toBe(
      'inset 0 1px 1px rgb(0 0 0 / 0.05), inset 0 0 0 2px red'
    )
  })

  test('logical border sides emit browser-native logical properties', () => {
    const styles = splitTailwindStyles(View, {
      className: 'border-s-2 border-e-white border-bs-2 border-be-white',
    } as any)

    expect(findRule(styles.rulesToInsert, 'borderInlineStartWidth')).toBeTruthy()
    expect(findRule(styles.rulesToInsert, 'borderInlineEndColor')).toBeTruthy()
    expect(findRule(styles.rulesToInsert, 'borderTopWidth')).toBeTruthy()
    expect(findRule(styles.rulesToInsert, 'borderBottomColor')).toBeTruthy()
  })

  test('logical radii and standard flex and aspect conveniences emit CSS', () => {
    const styles = splitTailwindStyles(View, {
      className: 'rounded-s-4 rounded-se-8 grow shrink-0 aspect-video',
    } as any)

    for (const prop of [
      'borderStartStartRadius',
      'borderEndStartRadius',
      'borderStartEndRadius',
      'flexGrow',
      'flexShrink',
      'aspectRatio',
    ]) {
      expect(findRule(styles.rulesToInsert, prop), prop).toBeTruthy()
    }
  })
})

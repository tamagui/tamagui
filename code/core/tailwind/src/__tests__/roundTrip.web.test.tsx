/**
 * CONVERTER → RUNTIME ROUND-TRIP tests.
 *
 * These are the tests the audit said were missing. Pure-transform tests (does the codemod
 * emit the right STRING) + a web paint gallery passed while the converted classes did NOT
 * all resolve correctly at runtime. Each test here takes a SOURCE tamagui prop, runs the
 * real converter (@tamagui/to-tailwind), feeds the emitted className into the package-selected
 * runtime (getSplitStyles), and asserts the RESOLVED STYLE — and, where it matters, that it
 * equals the style the SOURCE PROP itself resolves to.
 *
 * Config is @tamagui/config/v6 defaultConfig — the exact config the app template uses.
 * A real theme is passed to getSplitStyles (as createComponent does) so theme-var colors and
 * embedded shadow tokens resolve exactly as they do in the app.
 */

import { beforeAll, describe, expect, test } from 'vitest'
import { defaultConfig as v6 } from '@tamagui/config/v6'
import {
  StyleObjectIdentifier,
  StyleObjectProperty,
  StyleObjectValue,
} from '@tamagui/helpers'
import { tamaguiToTailwind } from '@tamagui/to-tailwind'

import { createTamagui } from '@tamagui/web'
import { preprocessTailwindClassName } from '../candidate'
import { Text, View } from '../index'
import { splitTailwindStyles } from './utils'

let CFG: any
let THEME: any

beforeAll(() => {
  CFG = createTamagui(v6 as any)
  THEME = (CFG.themes as any).light ?? (CFG.themes as any)[Object.keys(CFG.themes)[0]]
})

// run the real converter over a source JSX string and return the className it produced.
// renameComponents:false keeps <View> a Tamagui component for the Tailwind frontend.
function convertedClassName(sourceJSX: string): string {
  const out = tamaguiToTailwind(sourceJSX, {
    renameComponents: false,
    tokens: (v6 as any).tokens,
    fonts: (v6 as any).fonts,
    themes: (v6 as any).themes,
    media: (v6 as any).media,
    shorthands: (v6 as any).shorthands,
  })
  const m = /className="([^"]*)"/.exec(out)
  return m ? m[1] : ''
}

// resolve props to a flat { prop: resolvedValue } map, exactly as createComponent does
// (real theme, Tailwind frontend selected). on web the resolved values live in atomic rules
// (rulesToInsert), off-web they live in inline `.style` — merge both so the round-trip
// assertions read the same resolved runtime value under either target. base-prop rules
// only (media/pseudo-scoped rules are skipped; media is asserted through preprocessing).
function styleOf(props: Record<string, any>, Comp: any = View): Record<string, any> {
  const s = splitTailwindStyles(Comp, props, { theme: THEME, themeName: 'light' })
  const out: Record<string, any> = { ...s.style }
  for (const r of Object.values(s.rulesToInsert || {}) as any[]) {
    const id = r[StyleObjectIdentifier] || ''
    if (/hover|focus|press|_md|_sm|_lg|_max|:/.test(id)) continue // base props only
    const p = r[StyleObjectProperty]
    if (p != null && out[p] === undefined) out[p] = r[StyleObjectValue]
  }
  return out
}

function classStyle(cls: string, Comp: any = View): Record<string, any> {
  return styleOf({ className: cls }, Comp)
}

// the flat style props the parser reconstructs from a className, BEFORE the platform
// pipeline. this is where borderWidth-vs-borderColor and the numeric type are decided, and
// it is IDENTICAL on web and native (the web CSS layer later re-stringifies a number to
// "Npx", the native layer keeps the number — so typeof must be asserted here, not on .style).
function flat(cls: string): Record<string, any> {
  return preprocessTailwindClassName({ className: cls }, CFG)
}

function programFor(props: Record<string, any>, property: string): any {
  return Object.values(props).find((value) => value?.property === property)
}

describe('PASS 1 — 1a: responsive media direction', () => {
  test('converter emits md verbatim, never the inverted max-md:', () => {
    const show = convertedClassName(`<View display="none md:flex" />`)
    expect(show).toContain('hidden')
    expect(show).toContain('md:flex')
    expect(show).not.toMatch(/max-md/)
    const hide = convertedClassName(`<View display="flex md:none" />`)
    expect(hide).toContain('md:hidden')
  })

  test('the md breakpoint is minWidth 768 (show ≥768), so the direction is not inverted', () => {
    // config truth: md is min-width (mobile-first), max-md is the max-width mirror
    expect(CFG.media.md).toEqual({ minWidth: 768 })
    expect(CFG.media['max-md'].maxWidth).toBe(767.98)
    expect(typeof CFG.media['max-md'].maxWidth).toBe('number')
  })

  test('converted class carries the same md clause as the source flat value', () => {
    const cls = convertedClassName(`<View display="none md:flex" />`)
    const fromClass = preprocessTailwindClassName({ className: cls }, CFG)
    expect(fromClass.display).toBe('none')
    expect(programFor(fromClass, 'display')?.value).toEqual({
      base: null,
      clauses: [{ modifiers: ['md'], payload: 'flex' }],
    })

    const hideCls = convertedClassName(`<View display="flex md:none" />`)
    const hide = preprocessTailwindClassName({ className: hideCls }, CFG)
    expect(programFor(hide, 'display')?.value.clauses).toEqual([
      { modifiers: ['md'], payload: 'none' },
    ])
  })

  test('bare flex class resolves to display:flex (was a no-op before)', () => {
    expect(classStyle('flex').display).toBe('flex')
  })
})

describe('PASS 1 — 1b: token-first config fidelity', () => {
  test('spacing token padding="4" emits p-4 and resolves exactly like the source prop', () => {
    const cls = convertedClassName(`<View padding="4" />`)
    const fromClass = classStyle(cls).paddingTop
    const fromProp = styleOf({ padding: '4' }).paddingTop
    expect(cls).toContain('p-4')
    expect((v6 as any).tokens.space['4']).toBe(16)
    expect(CFG.tokensParsed.space['4'].val).toBe(16)
    expect(fromClass).toBe(fromProp)
    expect(typeof fromClass).toBe('string')
    expect(typeof fromClass).toBe(typeof fromProp)
  })

  test('gap="6" emits gap-6 and follows the active space token', () => {
    const cls = convertedClassName(`<View gap="6" />`)
    expect(cls).toContain('gap-6')
    expect((v6 as any).tokens.space['6']).toBe(24)
    expect(classStyle(cls).gap).toBe(styleOf({ gap: '6' }).gap)
  })

  test('borderRadius="8" emits rounded-8 and follows the active radius token', () => {
    const cls = convertedClassName(`<View borderRadius="8" />`)
    expect(cls).toContain('rounded-8')
    expect(classStyle(cls).borderTopLeftRadius).toBe(
      styleOf({ borderRadius: '8' }).borderTopLeftRadius
    )
  })

  test('width="10" emits w-10 and follows the active size token', () => {
    const cls = convertedClassName(`<View width="10" />`)
    expect(cls).toContain('w-10')
    expect((v6 as any).tokens.size['10']).toBe(40)
    expect(classStyle(cls).width).toBe(styleOf({ width: '10' }).width)
  })

  test('the configured named radius is the direct Tailwind value', () => {
    const cls = convertedClassName(`<View borderRadius="lg" />`)
    expect(cls).toContain('rounded-lg')
    expect((v6 as any).tokens.radius.lg).toBe(8)
    expect(classStyle(cls).borderTopLeftRadius).toBe(
      styleOf({ borderRadius: 'lg' }).borderTopLeftRadius
    )
  })
})

describe('PASS 1 — 1b: aligned named typography', () => {
  test('text-base and leading-base follow the paired default font tokens', () => {
    const cls = convertedClassName(`<Text fontSize="base" lineHeight="base" />`)
    const fromClass = classStyle(cls, Text)
    const fromProp = styleOf({ fontSize: 'base', lineHeight: 'base' }, Text)
    expect(cls).toContain('text-base')
    expect(cls).toContain('leading-base')
    expect((v6 as any).fonts.body.size.base).toBe(16)
    expect((v6 as any).fonts.body.lineHeight.base).toBe(24)
    expect(fromClass.fontSize).toBe(fromProp.fontSize)
    expect(fromClass.lineHeight).toBe(fromProp.lineHeight)
    expect(typeof fromClass.fontSize).toBe('string')
    expect(typeof fromClass.lineHeight).toBe('string')
  })
})

describe('PASS 1 — 1c: fractional border width', () => {
  test('borderWidth={0.5} → border-[0.5px] sets a NUMERIC borderWidth 0.5, never a color', () => {
    const cls = convertedClassName(`<View borderWidth={0.5} />`)
    expect(cls).toContain('border-[0.5px]')
    const f = flat(cls)
    expect(f.borderWidth).toBe(0.5)
    expect(typeof f.borderWidth).toBe('number') // RN rejects "0.5px" strings for borderWidth
    expect(f.borderColor).toBeUndefined() // absence of the opposite property
    expect(classStyle(cls).borderTopWidth).toBe('0.5px')
    expect(typeof classStyle(cls).borderTopWidth).toBe('string')
  })
})

describe('PASS 2 — directional borders + corner radius', () => {
  // value + typeof + ABSENCE-OF-OPPOSITE at the parser level (platform-agnostic)
  test('border (bare) → borderWidth 1 (number), no borderColor', () => {
    const f = flat('border')
    expect(f.borderWidth).toBe(1)
    expect(typeof f.borderWidth).toBe('number')
    expect(f.borderColor).toBeUndefined()
  })

  test('border-r (bare) → borderRightWidth 1 (number), no borderRightColor', () => {
    const f = flat('border-r')
    expect(f.borderRightWidth).toBe(1)
    expect(typeof f.borderRightWidth).toBe('number')
    expect(f.borderRightColor).toBeUndefined()
  })

  test('border-b-[0.5px] → borderBottomWidth 0.5 (number), no borderBottomColor', () => {
    const cls = convertedClassName(`<View borderBottomWidth={0.5} />`)
    expect(cls).toContain('border-b-[0.5px]')
    const f = flat(cls)
    expect(f.borderBottomWidth).toBe(0.5)
    expect(typeof f.borderBottomWidth).toBe('number')
    expect(f.borderBottomColor).toBeUndefined()
  })

  test('border-r-color2 → borderRightColor resolved (string), no borderRightWidth', () => {
    const cls = convertedClassName(`<View borderRightColor="color2" />`)
    const f = flat(cls)
    expect(typeof f.borderRightColor).toBe('string')
    expect(f.borderRightColor).toBe('color2')
    expect(f.borderRightWidth).toBeUndefined()
    // and it resolves to the same theme var as the source prop through the full pipeline
    expect(classStyle(cls).borderRightColor).toBe('var(--color2)')
    expect(classStyle(cls).borderRightColor).toBe(
      styleOf({ borderRightColor: 'color2' }).borderRightColor
    )
  })

  test('borderLeftWidth={3} → border-l-[3px] → left width 3 (number)', () => {
    const cls = convertedClassName(`<View borderLeftWidth={3} />`)
    const f = flat(cls)
    expect(f.borderLeftWidth).toBe(3)
    expect(typeof f.borderLeftWidth).toBe('number')
    expect(f.borderLeftColor).toBeUndefined()
  })

  test('corner radius token stays a token on the top-left corner only', () => {
    const cls = convertedClassName(`<View borderTopLeftRadius="8" />`)
    const f = flat(cls)
    expect(cls).toContain('rounded-tl-8')
    expect(f.borderTopLeftRadius).toBe('8')
    expect(typeof f.borderTopLeftRadius).toBe('string')
    expect(f.borderBottomRightRadius).toBeUndefined()
  })
})

describe('token category system — zIndex sentinel (default config)', () => {
  test('zIndex="10" → z-10 → runtime uses the direct Tailwind value', () => {
    const cls = convertedClassName(`<View zIndex="10" />`)
    expect(cls).toContain('z-10')
    expect((v6 as any).tokens.zIndex).toBeUndefined()
    expect(flat(cls).zIndex).toBe(10)
    expect(String(classStyle(cls).zIndex)).toBe(String(styleOf({ zIndex: '10' }).zIndex))
  })
})

describe('nested modifier expansion — md:hover:border-x', () => {
  test('border-x-[0.5px] under md:hover: sets BOTH side widths (numbers), no colors', () => {
    const f = flat('md:hover:border-x-[0.5px]')
    const programs = Object.values(f).filter(
      (value) => value?.value?.clauses?.[0]?.modifiers?.join(':') === 'md:hover'
    )
    expect(programs.map((program) => program.property)).toEqual([
      'borderLeftWidth',
      'borderRightWidth',
    ])
    expect(programs.map((program) => program.value.clauses[0].payload)).toEqual([
      '0.5px',
      '0.5px',
    ])
  })
})

describe('PASS 2 — embedded shadow tokens', () => {
  test('boxShadow="0 8px 18px shadow-5" resolves shadow-5 to the theme var, identical to the source prop', () => {
    const cls = convertedClassName(`<View boxShadow="0 8px 18px shadow-5" />`)
    expect(cls).toContain('shadow-[')
    const fromClass = classStyle(cls).boxShadow
    const fromProp = styleOf({ boxShadow: '0 8px 18px shadow-5' }).boxShadow
    expect(fromClass).toBe('0 8px 18px var(--shadow-5)')
    expect(fromClass).toBe(fromProp)
  })
})

describe('adversarial candidate boundaries', () => {
  test('leading-negative arbitrary and zero-denominator fractions pass through', () => {
    expect(flat('-m-[16px]').className).toBe('-m-[16px]')
    expect(flat('-w-full').className).toBe('-w-full')
    expect(flat('w-1/0').className).toBe('w-1/0')
  })

  test('type-provable arbitrary border widths preserve their value and type', () => {
    expect(flat('border-[0]').borderWidth).toBe(0)
    expect(typeof flat('border-[0]').borderWidth).toBe('number')
    expect(flat('border-[1rem]').borderWidth).toBe('1rem')
    expect(flat('border-[var(--border)]').className).toBe('border-[var(--border)]')
  })
})

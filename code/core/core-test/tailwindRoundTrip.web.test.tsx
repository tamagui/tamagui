/**
 * CONVERTER → RUNTIME ROUND-TRIP tests.
 *
 * These are the tests the audit said were missing. Pure-transform tests (does the codemod
 * emit the right STRING) + a web paint gallery passed while the converted classes did NOT
 * all resolve correctly at runtime. Each test here takes a SOURCE tamagui prop, runs the
 * real converter (@tamagui/to-tailwind), feeds the emitted className into the real styleMode
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

import { View, createTamagui } from '../web/src'
import {
  getSplitStyles,
  preprocessStyleModeProps,
} from '../web/src/helpers/getSplitStyles'
import { defaultComponentState } from '../web/src/defaultComponentState'
import { tamaguiToTailwind } from '../to-tailwind/src/transform'

let CFG: any
let THEME: any

beforeAll(() => {
  CFG = createTamagui({
    ...(v6 as any),
    settings: { ...(v6 as any).settings, styleMode: 'tailwind' },
  } as any)
  THEME = (CFG.themes as any).light ?? (CFG.themes as any)[Object.keys(CFG.themes)[0]]
})

// run the real converter over a source JSX string and return the className it produced.
// renameComponents:false keeps <View> a tamagui component so styleMode processes the class.
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
// (real theme, styleMode enabled). on web the resolved values live in atomic rules
// (rulesToInsert), off-web they live in inline `.style` — merge both so the round-trip
// assertions read the same resolved runtime value under either target. base-prop rules
// only (media/pseudo-scoped rules are skipped; media is asserted via preprocessStyleModeProps).
function styleOf(props: Record<string, any>): Record<string, any> {
  const s = getSplitStyles(
    props as any,
    View.staticConfig,
    THEME,
    'light',
    defaultComponentState,
    { isAnimated: false, resolveValues: 'auto' } as any,
    {} as any,
    { animationDriver: {}, groups: { state: {} } } as any,
    undefined,
    undefined,
    true
  )!
  const out: Record<string, any> = { ...(s.style || {}) }
  for (const r of Object.values(s.rulesToInsert || {}) as any[]) {
    const id = r[StyleObjectIdentifier] || ''
    if (/hover|focus|press|_md|_sm|_lg|_max|:/.test(id)) continue // base props only
    const p = r[StyleObjectProperty]
    if (p != null && out[p] === undefined) out[p] = r[StyleObjectValue]
  }
  return out
}

function classStyle(cls: string): Record<string, any> {
  return styleOf({ className: cls })
}

// the flat style props the parser reconstructs from a className, BEFORE the platform
// pipeline. this is where borderWidth-vs-borderColor and the numeric type are decided, and
// it is IDENTICAL on web and native (the web CSS layer later re-stringifies a number to
// "Npx", the native layer keeps the number — so typeof must be asserted here, not on .style).
function flat(cls: string): Record<string, any> {
  return preprocessStyleModeProps({ className: cls } as any, CFG)
}

describe('PASS 1 — 1a: responsive media direction', () => {
  test('converter emits $md verbatim as md:, never the inverted max-md:', () => {
    const show = convertedClassName(`<View display="none" $md={{ display: 'flex' }} />`)
    expect(show).toContain('hidden')
    expect(show).toContain('md:flex')
    expect(show).not.toMatch(/max-md/)
    const hide = convertedClassName(`<View display="flex" $md={{ display: 'none' }} />`)
    expect(hide).toContain('md:hidden')
  })

  test('the md breakpoint is minWidth 768 (show ≥768), so the direction is not inverted', () => {
    // config truth: md is min-width (mobile-first), max-md is the max-width mirror
    expect(CFG.media.md).toEqual({ minWidth: 768 })
    expect(CFG.media['max-md'].maxWidth).toBe(767.98)
    expect(typeof CFG.media['max-md'].maxWidth).toBe('number')
  })

  test('converted class resolves to the SAME media structure as the source $md prop', () => {
    // base hidden + show at md — parser reconstructs the $md media prop with display:flex
    const cls = convertedClassName(`<View display="none" $md={{ display: 'flex' }} />`)
    const fromClass = preprocessStyleModeProps({ className: cls } as any, CFG)
    expect(fromClass.display).toBe('none')
    expect(fromClass.$md).toEqual({ display: 'flex' })
    // identical to writing the source $md prop directly → round-trip
    const fromProp = preprocessStyleModeProps(
      { display: 'none', $md: { display: 'flex' } } as any,
      CFG
    )
    expect(fromClass.$md).toEqual(fromProp.$md)

    // bottom-tabs: base flex + hide at md → $md:{display:none} (hidden on desktop, shown mobile)
    const hideCls = convertedClassName(
      `<View display="flex" $md={{ display: 'none' }} />`
    )
    const hide = preprocessStyleModeProps({ className: hideCls } as any, CFG)
    expect(hide.$md).toEqual({ display: 'none' })
  })

  test('bare flex class resolves to display:flex (was a no-op before)', () => {
    expect(classStyle('flex').display).toBe('flex')
  })
})

describe('PASS 1 — 1b: token-first config fidelity', () => {
  test('spacing token padding="$4" emits p-4 and resolves exactly like the source prop', () => {
    const cls = convertedClassName(`<View padding="$4" />`)
    expect(cls).toContain('p-4')
    expect(classStyle(cls).paddingTop).toBe(styleOf({ padding: '$4' }).paddingTop)
    expect(typeof classStyle(cls).paddingTop).toBe(
      typeof styleOf({ padding: '$4' }).paddingTop
    )
  })

  test('gap="$6" emits gap-6 and follows the active space token', () => {
    const cls = convertedClassName(`<View gap="$6" />`)
    expect(cls).toContain('gap-6')
    expect(classStyle(cls).gap).toBe(styleOf({ gap: '$6' }).gap)
  })

  test('borderRadius="$8" emits rounded-8 and follows the active radius token', () => {
    const cls = convertedClassName(`<View borderRadius="$8" />`)
    expect(cls).toContain('rounded-8')
    expect(classStyle(cls).borderTopLeftRadius).toBe(
      styleOf({ borderRadius: '$8' }).borderTopLeftRadius
    )
  })

  test('width="$10" emits w-10 and follows the active size token', () => {
    const cls = convertedClassName(`<View width="$10" />`)
    expect(cls).toContain('w-10')
    expect(classStyle(cls).width).toBe(styleOf({ width: '$10' }).width)
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
    const cls = convertedClassName(`<View borderRightColor="$color2" />`)
    const f = flat(cls)
    expect(typeof f.borderRightColor).toBe('string')
    expect(f.borderRightColor).not.toBe('color2') // resolved token ref, not the literal name
    expect(String(f.borderRightColor)).toContain('color2')
    expect(f.borderRightWidth).toBeUndefined()
    // and it resolves to the same theme var as the source prop through the full pipeline
    expect(classStyle(cls).borderRightColor).toBe('var(--color2)')
    expect(classStyle(cls).borderRightColor).toBe(
      styleOf({ borderRightColor: '$color2' }).borderRightColor
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
    const cls = convertedClassName(`<View borderTopLeftRadius="$8" />`)
    const f = flat(cls)
    expect(cls).toContain('rounded-tl-8')
    expect(f.borderTopLeftRadius).toBe('$8')
    expect(typeof f.borderTopLeftRadius).toBe('string')
    expect(f.borderBottomRightRadius).toBeUndefined()
  })
})

describe('token category system — zIndex sentinel (default config)', () => {
  test('zIndex="$4" → z-4 → runtime uses the active zIndex token', () => {
    const cls = convertedClassName(`<View zIndex="$4" />`)
    expect(cls).toContain('z-4')
    expect(flat(cls).zIndex).toBe('$4')
    expect(classStyle(cls).zIndex).toBe(styleOf({ zIndex: '$4' }).zIndex)
  })
})

describe('nested modifier expansion — md:hover:border-x', () => {
  test('border-x-[0.5px] under md:hover: sets BOTH side widths (numbers), no colors', () => {
    const f = flat('md:hover:border-x-[0.5px]')
    const inner = f.$md?.hoverStyle
    expect(inner).toBeTruthy()
    expect(inner.borderLeftWidth).toBe(0.5)
    expect(typeof inner.borderLeftWidth).toBe('number')
    expect(inner.borderRightWidth).toBe(0.5)
    expect(typeof inner.borderRightWidth).toBe('number')
    expect(inner.borderLeftColor).toBeUndefined()
    expect(inner.borderRightColor).toBeUndefined()
  })
})

describe('PASS 2 — embedded shadow tokens', () => {
  test('boxShadow="0 8px 18px $shadow5" resolves $shadow5 to the theme var, identical to the source prop', () => {
    const cls = convertedClassName(`<View boxShadow="0 8px 18px $shadow5" />`)
    expect(cls).toContain('shadow-[')
    const fromClass = classStyle(cls).boxShadow
    const fromProp = styleOf({ boxShadow: '0 8px 18px $shadow5' }).boxShadow
    expect(String(fromClass)).not.toContain('$shadow5') // token must be resolved, not left dead
    expect(fromClass).toBe('0 8px 18px var(--shadow5)')
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

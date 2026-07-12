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
 * Config is @tamagui/config/v6 defaultConfig — the exact config the app template uses:
 * md = { minWidth: 768 }, max-md = { maxWidth: 767.98 }, space $4 = 18px, radius $8 = 22px.
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
import { getSplitStyles, preprocessStyleModeProps } from '../web/src/helpers/getSplitStyles'
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
  const out = tamaguiToTailwind(sourceJSX, { renameComponents: false })
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

// numeric pixel value regardless of number vs "Npx" string representation
function px(v: any): number {
  return typeof v === 'number' ? v : Number.parseFloat(v)
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
    expect(CFG.media['max-md'].maxWidth).toBeCloseTo(768, 0)
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
    const hideCls = convertedClassName(`<View display="flex" $md={{ display: 'none' }} />`)
    const hide = preprocessStyleModeProps({ className: hideCls } as any, CFG)
    expect(hide.$md).toEqual({ display: 'none' })
  })

  test('bare flex class resolves to display:flex (was a no-op before)', () => {
    expect(classStyle('flex').display).toBe('flex')
  })
})

describe('PASS 1 — 1b: token pixel-fidelity', () => {
  test('spacing token p="$4" resolves to 18px — NOT the Tailwind ×4 scale (16px)', () => {
    const cls = convertedClassName(`<View padding="$4" />`)
    expect(cls).toContain('p-[18px]')
    expect(px(classStyle(cls).paddingTop)).toBe(18)
    // proof the OLD strip-$ output (p-4) resolves to the WRONG value on the ×4 scale
    expect(px(classStyle('p-4').paddingTop)).toBe(16)
    // and the source prop padding="$4" resolves to the same 18px space token
    expect(String(styleOf({ padding: '$4' }).paddingTop)).toMatch(/space-4|18px/)
  })

  test('gap "$6" resolves to 32px, not 24px', () => {
    const cls = convertedClassName(`<View gap="$6" />`)
    expect(cls).toContain('gap-[32px]')
    expect(px(classStyle(cls).gap)).toBe(32)
    expect(px(classStyle('gap-6').gap)).toBe(24) // old ×4-scale value = wrong
  })

  test('radius token borderRadius="$8" resolves to 22px, not 8px', () => {
    const cls = convertedClassName(`<View borderRadius="$8" />`)
    expect(cls).toContain('rounded-[22px]')
    expect(px(classStyle(cls).borderTopLeftRadius)).toBe(22)
    expect(px(classStyle('rounded-8').borderTopLeftRadius)).toBe(8) // old raw value = wrong
  })

  test('size token width="$10" resolves to 104px', () => {
    const cls = convertedClassName(`<View width="$10" />`)
    expect(cls).toContain('w-[104px]')
    expect(px(classStyle(cls).width)).toBe(104)
  })
})

describe('PASS 1 — 1c: fractional border width', () => {
  test('borderWidth={0.5} → border-[0.5px] sets a WIDTH of 0.5, never a borderColor', () => {
    const cls = convertedClassName(`<View borderWidth={0.5} />`)
    expect(cls).toContain('border-[0.5px]')
    const s = classStyle(cls)
    expect(px(s.borderTopWidth)).toBe(0.5)
    expect(px(s.borderBottomWidth)).toBe(0.5)
    // the width must NOT have been written into a color prop
    expect(s.borderColor).toBeUndefined()
    expect(s.borderRightColor).not.toBe('0.5px')
  })
})

describe('PASS 2 — directional borders + corner radius', () => {
  test('border-r (bare) sets borderRightWidth 1', () => {
    expect(px(classStyle('border-r').borderRightWidth)).toBe(1)
  })

  test('borderRightColor="$color2" → border-r-color2 resolves to the theme var, identical to the source prop', () => {
    const cls = convertedClassName(`<View borderRightColor="$color2" />`)
    const fromClass = classStyle(cls).borderRightColor
    const fromProp = styleOf({ borderRightColor: '$color2' }).borderRightColor
    expect(fromClass).toBe('var(--color2)')
    expect(fromClass).toBe(fromProp)
  })

  test('directional fractional width: borderBottomWidth={0.5} → 0.5 on the bottom edge', () => {
    const cls = convertedClassName(`<View borderBottomWidth={0.5} />`)
    expect(px(classStyle(cls).borderBottomWidth)).toBe(0.5)
  })

  test('borderLeftWidth={3} → left width 3', () => {
    const cls = convertedClassName(`<View borderLeftWidth={3} />`)
    expect(px(classStyle(cls).borderLeftWidth)).toBe(3)
  })

  test('corner radius borderTopLeftRadius="$8" → 22px on the top-left corner only', () => {
    const cls = convertedClassName(`<View borderTopLeftRadius="$8" />`)
    const s = classStyle(cls)
    expect(px(s.borderTopLeftRadius)).toBe(22)
    expect(s.borderBottomRightRadius).toBeUndefined()
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

/**
 * CONVERTER → RUNTIME ROUND-TRIP tests on the NATIVE target.
 *
 * The web round-trip lives in tailwindRoundTrip.web.test.tsx. The app template runs native
 * too, so these assert the same converter output resolves correctly through the NATIVE
 * styleMode path — where the representation differs: borderWidth is a NUMBER (not "Npx"),
 * theme colors resolve to hsla/rgba, and boxShadow is parsed into an RN shadow object. The
 * assertions therefore lean on class-vs-source-prop PARITY (representation-independent) plus
 * exact pixel values for dimensions.
 *
 * This runs under `vitest` (native module resolution), not a simulator — it's cheap.
 * Command: from code/core/core-test, `bun run test:native` (or the *.native.test.tsx glob).
 */

process.env.TAMAGUI_TARGET = 'native'

import { beforeAll, describe, expect, test } from 'vitest'
import { defaultConfig as v6 } from '@tamagui/config/v6'

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

function convertedClassName(sourceJSX: string): string {
  const out = tamaguiToTailwind(sourceJSX, { renameComponents: false })
  const m = /className="([^"]*)"/.exec(out)
  return m ? m[1] : ''
}

// native resolves inline (no atomic rules) — read `.style` directly
function styleOf(props: Record<string, any>): Record<string, any> {
  return (
    getSplitStyles(
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
    )!.style || {}
  )
}

const classStyle = (cls: string) => styleOf({ className: cls })
const px = (v: any) => (typeof v === 'number' ? v : Number.parseFloat(v))

describe('native — 1a: responsive media direction', () => {
  test('converted class reconstructs the same $md media prop as the source (md = minWidth 768)', () => {
    expect(CFG.media.md).toEqual({ minWidth: 768 })
    const cls = convertedClassName(`<View display="none" $md={{ display: 'flex' }} />`)
    expect(cls).toContain('md:flex')
    expect(cls).not.toMatch(/max-md/)
    const fromClass = preprocessStyleModeProps({ className: cls } as any, CFG)
    expect(fromClass.$md).toEqual({ display: 'flex' })
    expect(fromClass.$md).toEqual(
      preprocessStyleModeProps({ display: 'none', $md: { display: 'flex' } } as any, CFG).$md
    )
  })

  test('bare flex resolves to display:flex', () => {
    expect(classStyle('flex').display).toBe('flex')
  })
})

describe('native — 1b: token pixel-fidelity', () => {
  test('p="$4" → 18px, gap="$6" → 32px, radius "$8" → 22px (not the ×4 scale)', () => {
    expect(px(classStyle(convertedClassName(`<View padding="$4" />`)).paddingTop)).toBe(18)
    expect(px(classStyle(convertedClassName(`<View gap="$6" />`)).gap)).toBe(32)
    expect(
      px(classStyle(convertedClassName(`<View borderRadius="$8" />`)).borderTopLeftRadius)
    ).toBe(22)
    // old outputs would have been the wrong pixel values
    expect(px(classStyle('p-4').paddingTop)).toBe(16)
    expect(px(classStyle('rounded-8').borderTopLeftRadius)).toBe(8)
  })
})

describe('native — 1c: fractional border width', () => {
  test('borderWidth={0.5} sets a NUMBER width of 0.5 on every side, never a color', () => {
    const s = classStyle(convertedClassName(`<View borderWidth={0.5} />`))
    expect(s.borderTopWidth).toBe(0.5)
    expect(s.borderBottomWidth).toBe(0.5)
    expect(s.borderColor).toBeUndefined()
  })
})

describe('native — PASS 2: directional borders + corner radius', () => {
  test('border-r (bare) → borderRightWidth 1', () => {
    expect(classStyle('border-r').borderRightWidth).toBe(1)
  })

  test('borderRightColor="$color2" resolves identically via class and source prop', () => {
    const cls = convertedClassName(`<View borderRightColor="$color2" />`)
    const fromClass = classStyle(cls).borderRightColor
    const fromProp = styleOf({ borderRightColor: '$color2' }).borderRightColor
    expect(fromClass).toBeTruthy()
    expect(fromClass).not.toBe('color2') // resolved, not a literal token name
    expect(fromClass).toBe(fromProp)
  })

  test('directional fractional + fixed widths', () => {
    expect(classStyle(convertedClassName(`<View borderBottomWidth={0.5} />`)).borderBottomWidth).toBe(0.5)
    expect(classStyle(convertedClassName(`<View borderLeftWidth={3} />`)).borderLeftWidth).toBe(3)
  })

  test('corner radius borderTopLeftRadius="$8" → 22 on the top-left corner only', () => {
    const s = classStyle(convertedClassName(`<View borderTopLeftRadius="$8" />`))
    expect(px(s.borderTopLeftRadius)).toBe(22)
    expect(s.borderBottomRightRadius).toBeUndefined()
  })
})

describe('native — PASS 2: embedded shadow tokens', () => {
  test('boxShadow="0 8px 18px $shadow5" resolves the token and parses to an RN shadow object, identical to the source prop', () => {
    const cls = convertedClassName(`<View boxShadow="0 8px 18px $shadow5" />`)
    const fromClass = classStyle(cls).boxShadow
    const fromProp = styleOf({ boxShadow: '0 8px 18px $shadow5' }).boxShadow
    // native parses the string into a shadow object; the token must be a resolved color
    expect(JSON.stringify(fromClass)).not.toContain('$shadow5')
    expect(fromClass).toEqual(fromProp)
    expect(Array.isArray(fromClass) ? fromClass[0]?.blurRadius : undefined).toBe(18)
  })
})

/**
 * CONFIG-AWARE converter → runtime round-trip (WEB).
 *
 * The converter is a GENERAL tool run on arbitrary apps: token → px resolution and media
 * pass-through MUST come from the app's ACTUAL config, not a hardcoded default. This file
 * builds a CUSTOM config (space.$4 = 20 not the default 18, zIndex.$4 = 40 not 400, a custom
 * `tablet` breakpoint) and proves the converter, given that config's tokens/media, produces
 * classes that resolve to the CUSTOM values at runtime — i.e. it read the passed config.
 */

import { beforeAll, describe, expect, test } from 'vitest'
import { defaultConfig as v6 } from '@tamagui/config/v6'
import { StyleObjectProperty, StyleObjectValue } from '@tamagui/helpers'

import { View, createTamagui } from '../web/src'
import { getSplitStyles, preprocessStyleModeProps } from '../web/src/helpers/getSplitStyles'
import { defaultComponentState } from '../web/src/defaultComponentState'
import { tamaguiToTailwind } from '../to-tailwind/src/transform'

// custom config: overridden token scales + an extra media key
const tokens = {
  ...(v6 as any).tokens,
  space: { ...(v6 as any).tokens.space, $4: 20 }, // default is 18 → prove we use 20
  zIndex: { ...(v6 as any).tokens.zIndex, $4: 40 }, // default is 400 → prove we use 40
}
const media = { ...(v6 as any).media, tablet: { minWidth: 900 } }
const convertOpts = { renameComponents: false as const, tokens, media }

let CFG: any

beforeAll(() => {
  CFG = createTamagui({
    ...(v6 as any),
    tokens,
    media,
    settings: { ...(v6 as any).settings, styleMode: 'tailwind' },
  } as any)
})

function className(sourceJSX: string): string {
  const out = tamaguiToTailwind(sourceJSX, convertOpts)
  const m = /className="([^"]*)"/.exec(out)
  return m ? m[1] : ''
}
function flat(cls: string): Record<string, any> {
  return preprocessStyleModeProps({ className: cls } as any, CFG)
}
function styleFlat(props: Record<string, any>): Record<string, any> {
  const s = getSplitStyles(
    props as any,
    View.staticConfig,
    (CFG.themes as any).light,
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
    const p = r[StyleObjectProperty]
    if (p != null && out[p] === undefined) out[p] = r[StyleObjectValue]
  }
  return out
}
const px = (v: any) => (typeof v === 'number' ? v : Number.parseFloat(v))

describe('config-aware tokens (WEB) — converter reads the passed config, not a hardcode', () => {
  test('space.$4 = 20: padding="$4" → p-[20px] → runtime 20 (not the default 18)', () => {
    const cls = className(`<View padding="$4" />`)
    expect(cls).toContain('p-[20px]')
    expect(px(styleFlat({ className: cls }).paddingTop)).toBe(20)
    // hardcode would have emitted the default 18 — prove the converter did NOT
    expect(cls).not.toContain('p-[18px]')
  })

  test('zIndex.$4 = 40: zIndex="$4" → z-[40] → runtime zIndex 40 (number)', () => {
    const cls = className(`<View zIndex="$4" />`)
    expect(cls).toContain('z-[40]')
    const f = flat(cls)
    expect(f.zIndex).toBe(40)
    expect(typeof f.zIndex).toBe('number')
  })
})

describe('config-aware media (WEB) — a custom breakpoint round-trips', () => {
  test('$tablet={{padding:10}} → tablet:p-[10px] → reconstructs the $tablet media prop', () => {
    const cls = className(`<View $tablet={{ padding: 10 }} />`)
    expect(cls).toContain('tablet:p-[10px]')
    expect(CFG.media.tablet).toEqual({ minWidth: 900 })
    const f = flat(cls)
    expect(f.$tablet).toBeTruthy()
    expect(px(f.$tablet.padding)).toBe(10)
  })
})

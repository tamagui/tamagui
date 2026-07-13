/**
 * CONFIG-AWARE converter → runtime round-trip (NATIVE).
 *
 * Native mirror of tailwindConfigAware.web.test.tsx: proves token/font names emitted by the
 * converter resolve through the app's ACTUAL config.
 */

process.env.TAMAGUI_TARGET = 'native'

import { beforeAll, describe, expect, test } from 'vitest'
import { defaultConfig as v6 } from '@tamagui/config/v6'

import { View, createTamagui } from '../web/src'
import {
  getSplitStyles,
  preprocessStyleModeProps,
} from '../web/src/helpers/getSplitStyles'
import { defaultComponentState } from '../web/src/defaultComponentState'
import { tamaguiToTailwind } from '../to-tailwind/src/transform'

const tokens = {
  ...(v6 as any).tokens,
  space: { ...(v6 as any).tokens.space, $4: 20 },
  size: { ...(v6 as any).tokens.size, $auto: 321 },
  zIndex: { ...(v6 as any).tokens.zIndex, $4: 40 },
}
const media = { ...(v6 as any).media, tablet: { minWidth: 900 } }
const fonts = { ...(v6 as any).fonts, sans: (v6 as any).fonts.body }
const convertOpts = { renameComponents: false as const, tokens, fonts, media }

let CFG: any

beforeAll(() => {
  CFG = createTamagui({
    ...(v6 as any),
    tokens,
    fonts,
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
function style(props: Record<string, any>): Record<string, any> {
  return (
    getSplitStyles(
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
    )!.style || {}
  )
}
describe('config-aware tokens (NATIVE) — class names follow runtime-owned values', () => {
  test('space.$4 = 20: padding="$4" → p-4 → runtime 20', () => {
    const cls = className(`<View padding="$4" />`)
    expect(cls).toContain('p-4')
    expect(style({ className: cls }).paddingTop).toBe(20)
    expect(typeof style({ className: cls }).paddingTop).toBe('number')
  })

  test('zIndex.$4 = 40: zIndex="$4" → z-4 → zIndex 40 (number)', () => {
    const cls = className(`<View zIndex="$4" />`)
    expect(cls).toContain('z-4')
    expect(style({ className: cls }).zIndex).toBe(40)
    expect(typeof style({ className: cls }).zIndex).toBe('number')
  })

  test('size.$auto wins w-auto and resolves the configured token, not the convenience', () => {
    const cls = className(`<View width="$auto" />`)
    expect(cls).toContain('w-auto')
    expect(style({ className: cls }).width).toBe(style({ width: '$auto' }).width)
    expect(style({ className: cls }).width).not.toBe('auto')
  })

  test('fontFamily.$sans wins font-sans and resolves the configured token', () => {
    const cls = className(`<View fontFamily="$sans" />`)
    expect(cls).toContain('font-sans')
    expect(flat(cls).fontFamily).toBe('$sans')
    expect(style({ className: cls }).fontFamily).toBe(
      style({ fontFamily: '$sans' }).fontFamily
    )
  })
})

describe('config-aware media (NATIVE) — a custom breakpoint round-trips', () => {
  test('$tablet={{padding:10}} → tablet:p-[10px] → reconstructs the $tablet media prop', () => {
    const cls = className(`<View $tablet={{ padding: 10 }} />`)
    expect(cls).toContain('tablet:p-[10px]')
    expect(CFG.media.tablet).toEqual({ minWidth: 900 })
    const f = flat(cls)
    expect(f.$tablet).toBeTruthy()
    expect(f.$tablet.padding).toBe(10)
    expect(typeof f.$tablet.padding).toBe('number')
  })
})

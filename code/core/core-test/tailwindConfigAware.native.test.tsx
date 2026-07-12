/**
 * CONFIG-AWARE converter → runtime round-trip (NATIVE).
 *
 * Native mirror of tailwindConfigAware.web.test.tsx: proves the converter resolves tokens and
 * media from the app's ACTUAL config (custom space.$4 = 20, zIndex.$4 = 40, a `tablet`
 * breakpoint), not a hardcoded default, and that the values are native-valid (numeric zIndex).
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
  zIndex: { ...(v6 as any).tokens.zIndex, $4: 40 },
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
describe('config-aware tokens (NATIVE) — converter reads the passed config', () => {
  test('space.$4 = 20: padding="$4" → p-[20px] → runtime 20 (not the default 18)', () => {
    const cls = className(`<View padding="$4" />`)
    expect(cls).toContain('p-[20px]')
    expect(cls).not.toContain('p-[18px]')
    expect(style({ className: cls }).paddingTop).toBe(20)
    expect(typeof style({ className: cls }).paddingTop).toBe('number')
  })

  test('zIndex.$4 = 40: zIndex="$4" → z-[40] → zIndex 40 (number)', () => {
    const cls = className(`<View zIndex="$4" />`)
    expect(cls).toContain('z-[40]')
    const f = flat(cls)
    expect(f.zIndex).toBe(40)
    expect(typeof f.zIndex).toBe('number')
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

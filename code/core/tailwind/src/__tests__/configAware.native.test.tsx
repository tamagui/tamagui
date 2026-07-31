/**
 * CONFIG-AWARE converter → runtime round-trip (NATIVE).
 *
 * Native mirror of tailwindConfigAware.web.test.tsx: proves token/font names emitted by the
 * converter resolve through the app's ACTUAL config.
 */

process.env.TAMAGUI_TARGET = 'native'

import { beforeAll, describe, expect, test } from 'vitest'
import { defaultConfig as v6 } from '@tamagui/config/v6'
import { tamaguiToTailwind } from '@tamagui/to-tailwind'

import { createTamagui } from '@tamagui/web'
import { tailwindStyleFrontend } from '../frontend'
import { View } from '../index'
import { splitTailwindStyles } from './utils'

const tokens = {
  ...(v6 as any).tokens,
  space: { ...(v6 as any).tokens.space, $4: 20 },
  zIndex: { ...(v6 as any).tokens.zIndex, $4: 40 },
}
const media = { ...(v6 as any).media, tablet: { minWidth: 900 } }
const fonts = { ...(v6 as any).fonts, sans: (v6 as any).fonts.body }
const themes = { ...(v6 as any).themes, web: { ...(v6 as any).themes.light } }
const convertOpts = { renameComponents: false as const, tokens, fonts, media }

let CFG: any

beforeAll(() => {
  CFG = createTamagui({
    ...(v6 as any),
    tokens,
    fonts,
    media,
    themes,
  } as any)
})

function className(sourceJSX: string): string {
  const out = tamaguiToTailwind(sourceJSX, convertOpts)
  const m = /className="([^"]*)"/.exec(out)
  return m ? m[1] : ''
}
function flat(cls: string): Record<string, any> {
  return tailwindStyleFrontend.preprocessProps({ className: cls }, CFG)
}
function style(props: Record<string, any>, themeName = 'light'): Record<string, any> {
  return (
    splitTailwindStyles(View, props, {
      theme: (CFG.themes as any)[themeName],
      themeName,
    }).style || {}
  )
}
describe('config-aware tokens (NATIVE) — class names follow runtime-owned values', () => {
  test('space.$4 = 20: padding="$4" → p-4 → runtime 20', () => {
    const cls = className(`<View padding="$4" />`)
    expect(cls).toContain('p-4')
    expect(style({ className: cls }).paddingTop).toBe(20)
    expect(typeof style({ className: cls }).paddingTop).toBe('number')
  })

  test('overriding space.$4 does not mutate the distinct size.$4 domain', () => {
    const cls = className(`<View width="$4" />`)
    expect(cls).toContain('w-4')
    expect(tokens.size.$4).toBe(16)
    expect(style({ className: cls }).width).toBe(16)
    expect(style({ className: cls }).width).toBe(style({ width: '$4' }).width)
    expect(typeof style({ className: cls }).width).toBe('number')
  })

  test('zIndex.$4 = 40: zIndex="$4" → z-4 → zIndex 40 (number)', () => {
    const cls = className(`<View zIndex="$4" />`)
    expect(cls).toContain('z-4')
    expect(style({ className: cls }).zIndex).toBe(40)
    expect(typeof style({ className: cls }).zIndex).toBe('number')
  })

  test('auto stays a flat literal while w-auto is a candidate-layer convenience', () => {
    const cls = className(`<View width="auto" />`)
    expect(cls).toContain('w-auto')
    expect(flat(cls).width).toBe('auto')
    expect(style({ width: 'auto' }).width).toBe('auto')
    expect(style({ className: cls }).width).toBe('auto')
  })

  test('fontFamily.$sans wins font-sans and resolves the configured token', () => {
    const cls = className(`<View fontFamily="$sans" />`)
    expect(cls).toContain('font-sans')
    expect(flat(cls).fontFamily).toBe('sans')
    expect(style({ className: cls }).fontFamily).toBe(
      style({ fontFamily: '$sans' }).fontFamily
    )
  })
})

describe('shared candidate semantics (NATIVE)', () => {
  test('invalid color opacity stays literal like the flat value', () => {
    expect(style({ className: 'bg-black/50.5' }).backgroundColor).toBe(
      style({ backgroundColor: 'black/50.5' }).backgroundColor
    )
    expect(style({ className: 'bg-black/150' }).backgroundColor).toBe(
      style({ backgroundColor: 'black/150' }).backgroundColor
    )
  })

  test('a platform and theme name collision keeps the registry platform meaning', () => {
    expect(style({ className: 'web:bg-black' }, 'web').backgroundColor).toBe(
      style({ backgroundColor: 'web:black' }, 'web').backgroundColor
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

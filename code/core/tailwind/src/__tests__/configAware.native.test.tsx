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
  space: { ...(v6 as any).tokens.space, 4: 20 },
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
function split(
  props: Record<string, any>,
  themeName = 'light',
  groupContext?: Record<string, any>
) {
  return splitTailwindStyles(View, props, {
    theme: (CFG.themes as any)[themeName],
    themeName,
    groupContext,
  })
}
function style(props: Record<string, any>, themeName = 'light'): Record<string, any> {
  return split(props, themeName).style || {}
}
const fullOutput = (result: ReturnType<typeof split>) =>
  JSON.stringify({
    rules: Object.entries(result.rulesToInsert ?? {}).map(([identifier, entry]) => [
      identifier,
      (entry as any)?.[4] ?? [],
    ]),
    style: result.style ?? null,
    viewProps: result.viewProps ?? null,
  })
const groupEntry = (pseudo: Record<string, boolean>) => ({
  subscribe: () => () => {},
  state: { pseudo },
})
const containerEntry = (width: number, height: number) => ({
  subscribe: () => () => {},
  state: { layout: { width, height } },
})
function expectConditionalParity(
  className: string,
  value: string,
  groupContext: Record<string, any>
) {
  expect(fullOutput(split({ className }, 'light', groupContext))).toBe(
    fullOutput(split({ backgroundColor: value }, 'light', groupContext))
  )
}
describe('config-aware tokens (NATIVE) — class names follow runtime-owned values', () => {
  test('space.4 = 20: padding="4" → p-4 → runtime 20', () => {
    const cls = className(`<View padding="4" />`)
    expect(cls).toContain('p-4')
    expect(style({ className: cls }).paddingTop).toBe(20)
    expect(typeof style({ className: cls }).paddingTop).toBe('number')
  })

  test('overriding space.4 does not mutate the distinct size.4 domain', () => {
    const cls = className(`<View width="4" />`)
    expect(cls).toContain('w-4')
    expect(tokens.size['4']).toBe(16)
    expect(style({ className: cls }).width).toBe(16)
    expect(style({ className: cls }).width).toBe(style({ width: '4' }).width)
    expect(typeof style({ className: cls }).width).toBe('number')
  })

  test('zIndex="4" → z-4 → literal 4 (number)', () => {
    const cls = className(`<View zIndex="4" />`)
    expect(cls).toContain('z-4')
    expect(style({ className: cls }).zIndex).toBe(4)
    expect(typeof style({ className: cls }).zIndex).toBe('number')
  })

  test('auto stays a flat literal while w-auto is a candidate-layer convenience', () => {
    const cls = className(`<View width="auto" />`)
    expect(cls).toContain('w-auto')
    expect(flat(cls).width).toBe('auto')
    expect(style({ width: 'auto' }).width).toBe('auto')
    expect(style({ className: cls }).width).toBe('auto')
  })

  test('fontFamily.sans wins font-sans and resolves the configured token', () => {
    const cls = className(`<View fontFamily="sans" />`)
    expect(cls).toContain('font-sans')
    expect(flat(cls).fontFamily).toBe('sans')
    expect(style({ className: cls }).fontFamily).toBe(
      style({ fontFamily: 'sans' }).fontFamily
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

  test('named hover and press group candidates match the full flat program output', () => {
    expectConditionalParity('group-hover/card:bg-black', 'group-hover/card:black', {
      card: groupEntry({ hover: true }),
    })
    expectConditionalParity('group-press/card:bg-black', 'group-press/card:black', {
      card: groupEntry({ press: true }),
    })
  })

  test('a named container candidate matches the full active flat program output', () => {
    const groupContext = { '@layout': containerEntry(10_000, 10_000) }
    expectConditionalParity('@sm/layout:bg-black', '@sm/layout:black', groupContext)
  })
})

describe('config-aware media (NATIVE) — a custom breakpoint round-trips', () => {
  test('a tablet clause becomes a frontend program', () => {
    const cls = className(`<View padding="tablet:10px" />`)
    expect(cls).toContain('tablet:p-[10px]')
    expect(CFG.media.tablet).toEqual({ minWidth: 900 })
    const f = flat(cls)
    const program = Object.values(f).find((value) => value?.property === 'padding')
    expect(program?.value).toEqual({
      base: null,
      clauses: [{ modifiers: ['tablet'], payload: '10px' }],
    })
  })
})

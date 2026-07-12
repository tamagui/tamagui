/**
 * General-contract guards: media-key parity (no drift), converter PURITY/reentrancy, and
 * config-aware SHORTHANDS (threaded, not a module-global require).
 */

import { describe, expect, test } from 'vitest'
import { defaultConfig as v6 } from '@tamagui/config/v6'

import { tamaguiToTailwind } from '../to-tailwind/src/transform'
import { defaultMediaKeys } from '../to-tailwind/src/maps/pseudoMap'

const cls = (out: string) => (/className="([^"]*)"/.exec(out) || [, ''])[1]
const convert = (s: string, o?: any) =>
  cls(tamaguiToTailwind(s, { renameComponents: false, ...(o || {}) }))

describe('media default keys parity — fallback set covers the canonical config media', () => {
  test('every @tamagui/config v6 media key is in defaultMediaKeys (no silent drop)', () => {
    const missing = Object.keys((v6 as any).media).filter((k) => !defaultMediaKeys.includes(k))
    expect(missing).toEqual([])
  })

  test('a standard max-* key round-trips with NO config passed (hyphenated JSX attr)', () => {
    // JSX attribute names may contain hyphens, so $max-md is a valid source prop
    const out = convert(`<View $max-md={{ display: 'none' }} />`)
    expect(out).toContain('max-md:hidden')
  })
})

describe('converter purity / reentrancy — no module-global config leakage', () => {
  test('interleaved conversions with different token configs each use their own', () => {
    const A = { tokens: { space: { $4: 20 } } }
    const B = { tokens: { space: { $4: 99 } } }
    expect(convert(`<View padding="$4" />`, A)).toBe('p-[20px]')
    expect(convert(`<View padding="$4" />`, B)).toBe('p-[99px]')
    expect(convert(`<View padding="$4" />`, A)).toBe('p-[20px]') // A again — B did not leak
    // and no config → bundled default (18), unaffected by the prior custom configs
    expect(convert(`<View padding="$4" />`)).toBe('p-[18px]')
  })

  test('interleaved media configs each use their own key set', () => {
    const A = { media: { tablet: {} } }
    const B = { media: { widescreen: {} } }
    expect(convert(`<View $tablet={{ padding: 10 }} />`, A)).toBe('tablet:p-[10px]')
    // B has no `tablet` → $tablet is NOT converted (retained); A did not leak into B
    expect(tamaguiToTailwind(`<View $tablet={{ padding: 10 }} />`, { renameComponents: false, ...B })).toContain('$tablet=')
  })
})

describe('config-aware shorthands — uses the PASSED shorthands, not the hardcode', () => {
  test('a custom app shorthand resolves to its prop', () => {
    // app defines `bgc` → backgroundColor; with it, bgc converts; without it, retained
    expect(convert(`<View bgc="red" />`, { shorthands: { bgc: 'backgroundColor' } })).toBe(
      'bg-red'
    )
    expect(tamaguiToTailwind(`<View bgc="red" />`, { renameComponents: false })).toContain(
      'bgc="red"'
    )
  })

  test('passing shorthands REPLACES the default set (hardcode not consulted)', () => {
    // with a shorthands map that lacks `p`, `p="$4"` is NOT treated as padding → retained
    const out = tamaguiToTailwind(`<View p="$4" />`, {
      renameComponents: false,
      shorthands: { bgc: 'backgroundColor' },
    })
    expect(out).toContain('p="$4"') // retained, since this config's shorthands has no `p`
  })
})

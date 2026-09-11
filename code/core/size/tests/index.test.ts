import { describe, expect, test } from 'vitest'

import {
  createSizeContext,
  oneSizeSmaller,
  resolveSize,
  SizeContext,
  type SizeResolverEnv,
} from '../src'

const env = {
  tokens: {
    size: { 4: 16, 5: 20 },
    space: { 1: 4, 2: 8, 3: 12, 4: 16, '1.5': 6 },
    radius: { 4: 9, sm: 4, md: 6 },
  },
  font: {
    size: { 4: 15, xs: 12, sm: 14, base: 16 },
    lineHeight: { 4: 23, xs: 16, sm: 20, base: 24 },
  },
  sizes: {
    default: 'md',
    sm: { fontSize: 'sm', paddingX: '3', paddingY: '1.5', radius: 'md' },
    md: { fontSize: 'sm', paddingX: '4', paddingY: '2', radius: 'md' },
    lg: { fontSize: 'base', paddingX: '4', paddingY: '2', radius: 'md', icon: 24 },
  },
} as unknown as SizeResolverEnv

describe('resolveSize', () => {
  test('a named size is a recipe of tokens with no height', () => {
    expect(resolveSize('md', env)).toEqual({
      name: 'md',
      fontSizeKey: 'sm',
      frame: { paddingHorizontal: 16, paddingVertical: 8, gap: 8, borderRadius: 6 },
      text: { fontSize: 14, lineHeight: 20 },
      icon: 16,
      controlHeight: 36,
    })
  })

  test('true and undefined resolve the default', () => {
    expect(resolveSize(true, env)).toEqual(resolveSize('md', env))
    expect(resolveSize(undefined, env)).toEqual(resolveSize('md', env))
  })

  test('unknown names and numeric control sizes resolve the configured default', () => {
    const expected = resolveSize('md', env)
    expect(resolveSize('missing' as any, env)).toEqual(expected)
    expect(resolveSize(44, env)).toEqual(expected)
    expect(resolveSize(null, env)).toEqual(expected)
    const custom = { ...env, sizes: { ...env.sizes!, default: 'lg' } }
    expect(resolveSize('missing' as any, custom)).toEqual(resolveSize('lg', custom))
    const tokenDefault = { ...env, sizes: { ...env.sizes!, default: '5' } }
    expect(resolveSize('missing' as any, tokenDefault)).toEqual(resolveSize('5', env))
  })

  test('a missing or invalid default falls back to token 4 without recursion', () => {
    const withoutSizes = { ...env, sizes: undefined }
    expect(resolveSize('missing' as any, withoutSizes)).toEqual(
      resolveSize('4', withoutSizes)
    )
    const invalid = { ...env, sizes: { ...env.sizes!, default: 'missing' } }
    expect(resolveSize(undefined, invalid)).toEqual(resolveSize('4', withoutSizes))
    const nullRecipe = {
      ...env,
      sizes: { ...env.sizes!, md: null },
    } as unknown as SizeResolverEnv
    expect(resolveSize('missing' as any, nullRecipe)).toEqual(
      resolveSize('4', withoutSizes)
    )
  })

  test('icons round the font size up to the 4px grid unless the recipe sets one', () => {
    expect(resolveSize('sm', env).icon).toBe(16)
    expect(resolveSize('lg', env).icon).toBe(24)
  })

  test('a token key steps onto the named ramp, anchored at the default', () => {
    // v2's `$4` was the default control size, so it lands on the default name
    expect(resolveSize('$4', env)).toEqual(resolveSize('md', env))
    expect(resolveSize('4', env)).toEqual(resolveSize('md', env))
    expect(resolveSize('3', env)).toEqual(resolveSize('sm', env))
    expect(resolveSize('5', env)).toEqual(resolveSize('lg', env))
    // out past either end clamps rather than falling off the ramp
    expect(resolveSize('1', env)).toEqual(resolveSize('sm', env))
    expect(resolveSize('9', env)).toEqual(resolveSize('lg', env))
    // fractional keys, in both spellings, round to a step
    expect(resolveSize('4.5', env)).toEqual(resolveSize('lg', env))
    expect(resolveSize('2-5', env)).toEqual(resolveSize('sm', env))
  })

  test('a token-keyed control is never shorter than the text inside it', () => {
    // the regression this exists for: v6's size scale is tailwind spacing, so
    // reading a frame height off it gave `size="5"` a 20px-tall button holding
    // 23px of text with no padding above or below. every key on the scale, not
    // just the ones an app happens to pass today.
    for (const key of ['1', '2', '3', '4', '5', '6', '1.5', '0-5']) {
      const resolved = resolveSize(key, env)
      const lineHeight = resolved.text.lineHeight as number
      expect(resolved.frame.paddingVertical).toBeGreaterThan(0)
      expect(resolved.controlHeight).toBeGreaterThan(lineHeight)
    }
  })

  test('a config naming no sizes still indexes the scales directly', () => {
    // nothing better is available: with no named ramp there is no step to land
    // on, so v2's reading of the size scale is all that is left
    const withoutSizes = { ...env, sizes: undefined }
    expect(resolveSize('$4', withoutSizes)).toEqual({
      name: '4',
      fontSizeKey: '4',
      frame: { paddingHorizontal: 16, gap: 3, borderRadius: 9, minHeight: 16 },
      // the icon is the font size as is: v2 sized icons to the font, not a grid
      text: { fontSize: 15, lineHeight: 23 },
      icon: 15,
      controlHeight: 16,
    })
  })

  test('a font missing the recipe key falls back to fonts.body', () => {
    const resolved = resolveSize('md', {
      ...env,
      font: { size: { 4: 30 } },
      fonts: { body: env.font },
    })
    expect(resolved.text).toEqual({ fontSize: 14, lineHeight: 20 })
  })
})

describe('oneSizeSmaller', () => {
  test('steps through names, then numbers', () => {
    expect(oneSizeSmaller('md', env.sizes)).toBe('sm')
    expect(oneSizeSmaller('sm', env.sizes)).toBe('sm')
    expect(oneSizeSmaller(true, env.sizes)).toBe('sm')
    expect(oneSizeSmaller('4', env.sizes)).toBe('3')
    expect(oneSizeSmaller('$1', env.sizes)).toBe('1')
  })
})

describe('size context', () => {
  test('creates an optional generic context with an explicit default when requested', () => {
    const defaulted = createSizeContext('md')
    expect(SizeContext.props).toEqual({ size: undefined })
    expect(defaulted.props).toEqual({ size: 'md' })
    expect(defaulted.context).not.toBe(SizeContext.context)
  })
})

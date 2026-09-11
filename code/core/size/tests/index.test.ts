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
    size: { 3: 12, 4: 16, 5: 20, 6: 24 },
    space: { 1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24, '1.5': 6 },
    radius: { 3: 6, 4: 9, 5: 12, 6: 16, sm: 4, md: 6 },
  },
  font: {
    size: { 3: 13, 4: 15, 5: 18, 6: 20, xs: 12, sm: 14, base: 16 },
    lineHeight: { 3: 20, 4: 23, 5: 26, 6: 28, xs: 16, sm: 20, base: 24 },
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

  test('a token key indexes every scale at the same step', () => {
    expect(resolveSize('$4', env)).toEqual({
      name: '4',
      fontSizeKey: '4',
      frame: {
        paddingHorizontal: 16,
        // half the horizontal space, the ratio the named ramp uses
        paddingVertical: 8,
        gap: 3,
        borderRadius: 9,
        // a floor, not the height: only a v2-shaped size scale describes a
        // control, and this one is tailwind spacing
        minHeight: 16,
      },
      // the icon is the font size as is: v2 sized icons to the font, not a grid
      text: { fontSize: 15, lineHeight: 23 },
      icon: 15,
      controlHeight: 39,
    })
    expect(resolveSize('4', env)).toEqual(resolveSize('$4', env))
    // a config that names no sizes reads the scales the same way
    expect(resolveSize('$4', { ...env, sizes: undefined })).toEqual(
      resolveSize('$4', env)
    )
  })

  test('a token-keyed control is never shorter than the text inside it', () => {
    // the regression this exists for: v6's size scale is tailwind spacing, so
    // reading a frame height off it gave `size="5"` a 20px-tall button holding
    // 26px of text with no padding above or below. every key on the scale, not
    // just the ones an app happens to pass today.
    for (const key of ['3', '4', '5', '6']) {
      const resolved = resolveSize(key, env)
      const lineHeight = resolved.text.lineHeight as number
      expect(resolved.frame.paddingVertical).toBeGreaterThan(0)
      expect(resolved.controlHeight).toBeGreaterThan(lineHeight)
    }
  })

  test('a v2-shaped size scale still sets the control height it always did', () => {
    // where `tokens.size` IS a control ramp the floor is the taller of the two,
    // so `size="$4"` is the 44px button v2 shipped, padding and all
    const v2 = {
      tokens: {
        size: { 4: 44 },
        space: { 4: 18 },
        radius: { 4: 9 },
      },
      font: { size: { 4: 16 }, lineHeight: { 4: 22 } },
    } as unknown as SizeResolverEnv
    const resolved = resolveSize('$4', v2)
    expect(resolved.frame.minHeight).toBe(44)
    expect(resolved.controlHeight).toBe(44)
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

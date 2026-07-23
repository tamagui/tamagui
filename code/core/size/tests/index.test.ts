import { setConfig, type TamaguiInternalConfig } from '@tamagui/web'
import { describe, expect, test } from 'vitest'

import {
  createSizeContext,
  createSizeTable,
  resolveTokenSize,
  type SizeResolverExtras,
  SizeContext,
} from '../src'

describe('size primitives', () => {
  test('resolves true by category while retaining explicit values', () => {
    setConfig({
      settings: {
        defaultSize: '$frame-default',
        defaultTokens: {
          space: '$space-default',
          radius: '$radius-default',
          fontSize: '$font-default',
        },
      },
    } as TamaguiInternalConfig)

    const extras = {
      tokens: {
        size: { '$frame-default': 40, $4: 44 },
        space: { '$space-default': 12, $4: 14 },
        radius: { '$radius-default': 8, $4: 10 },
      },
      font: {
        size: { '$font-default': 16, $4: 18 },
        lineHeight: { '$font-default': 22, $4: 24 },
      },
    } as unknown as SizeResolverExtras

    expect(resolveTokenSize(true, extras)).toEqual({
      frame: {
        size: 40,
        space: 12,
        radius: 8,
      },
      text: { fontSize: 16, lineHeight: 22 },
      icon: 16,
    })
    expect(resolveTokenSize('$4', extras)).toEqual({
      frame: { size: 44, space: 14, radius: 10 },
      text: { fontSize: 18, lineHeight: 24 },
      icon: 18,
    })
    expect(resolveTokenSize(24, extras)).toEqual({
      frame: { size: 24, space: 24, radius: 24 },
      text: { fontSize: 24, lineHeight: undefined },
      icon: 24,
    })
  })

  test('creates independent named contexts and literal projections', () => {
    const first = createSizeTable(
      {
        small: { frame: { height: 28 }, text: { fontSize: 13 }, icon: 14 },
        large: { frame: { height: 44 }, text: { fontSize: 17 }, icon: 22 },
      } as const,
      'small'
    )
    const second = createSizeTable(
      {
        small: { frame: { height: 20 }, text: { fontSize: 11 }, icon: 10 },
      } as const,
      'small'
    )

    expect(first.Context).not.toBe(second.Context)
    expect(first.Context.context).not.toBe(second.Context.context)
    expect(first.Context.props).toEqual({ size: 'small' })
    expect(second.Context.props).toEqual({ size: 'small' })
    expect(first.resolve()).toBe(first.values.small)
    expect(first.frame.small).toBe(first.values.small.frame)
    expect(first.text.large).toBe(first.values.large.text)
    expect(first.icon.small).toBe(14)
    expect(second.frame.small).toEqual({ height: 20 })
  })

  test('creates an optional generic context with an explicit default when requested', () => {
    const defaulted = createSizeContext('$4')

    expect(SizeContext.props).toEqual({ size: undefined })
    expect(defaulted.props).toEqual({ size: '$4' })
    expect(defaulted.context).not.toBe(SizeContext.context)
  })
})

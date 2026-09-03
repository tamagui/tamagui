/**
 * Proof of concept and comprehensive test suite for variant-driven .resolve()
 * and the composedResolver.
 */
import { beforeAll, describe, expect, test } from 'vitest'
import { createTamagui, styled, View, getConfig } from '@tamagui/web'
import { getDefaultTamaguiConfig } from '../../../config-default/src'
import { composedResolver } from '../composedResolver'

beforeAll(() => {
  createTamagui(getDefaultTamaguiConfig() as any)
})

describe('composedResolver produces correct styles', () => {
  // ── Ring & Shadows ──────────────────────────────────────────────────
  test('ring width + color → boxShadow', () => {
    const result = composedResolver({ __ring: '2px', __ringColor: 'blue' }, {})
    expect(result).toEqual({ boxShadow: '0 0 0 2px blue' })
  })

  test('ring width alone defaults color to currentColor', () => {
    const result = composedResolver({ __ring: '3px' }, {})
    expect(result).toEqual({ boxShadow: '0 0 0 3px currentColor' })
  })

  test('ring inset adds inset keyword', () => {
    const result = composedResolver(
      { __ring: '2px', __ringInset: true, __ringColor: 'red' },
      {}
    )
    expect(result).toEqual({ boxShadow: 'inset 0 0 0 2px red' })
  })

  test('ring stacks with existing shadow', () => {
    const result = composedResolver(
      { __ring: '2px', __ringColor: 'blue', __shadow: '0 1px 2px red' },
      {}
    )
    expect(result).toEqual({ boxShadow: '0 0 0 2px blue, 0 1px 2px red' })
  })

  test('inset ring + inset shadow stack together', () => {
    const result = composedResolver(
      {
        __insetShadowGeometry: 'inset 0 2px 4px',
        __insetShadowColor: 'blue',
        __insetRingWidth: '2px',
        __insetRingColor: 'red',
      },
      {}
    )
    expect(result).toEqual({
      boxShadow: 'inset 0 2px 4px blue, inset 0 0 0 2px red',
    })
  })

  test('no composed props → null (no-op)', () => {
    const result = composedResolver({ padding: 4 }, {})
    expect(result).toBeNull()
  })

  // ── Gradients ───────────────────────────────────────────────────────
  test('gradient from/via/to → backgroundImage', () => {
    const result = composedResolver(
      {
        __gradientDirection: 'to right',
        __gradientFrom: 'red',
        __gradientVia: 'yellow',
        __gradientTo: 'blue',
      },
      {}
    )
    expect(result).toEqual({
      backgroundImage: 'linear-gradient(to right, red, yellow, blue)',
    })
  })

  test('gradient without via → two-stop gradient', () => {
    const result = composedResolver(
      { __gradientDirection: 'to bottom', __gradientFrom: 'red', __gradientTo: 'blue' },
      {}
    )
    expect(result).toEqual({
      backgroundImage: 'linear-gradient(to bottom, red, blue)',
    })
  })

  test('ring + gradient compose together', () => {
    const result = composedResolver(
      {
        __ring: '2px',
        __ringColor: 'blue',
        __gradientDirection: 'to right',
        __gradientFrom: 'red',
        __gradientTo: 'green',
      },
      {}
    )
    expect(result).toEqual({
      boxShadow: '0 0 0 2px blue',
      backgroundImage: 'linear-gradient(to right, red, green)',
    })
  })

  // ── Filters & Drop Shadow ───────────────────────────────────────────
  test('filters compose in canonical filterOrder', () => {
    const result = composedResolver(
      {
        __filter_blur: '8px',
        __filter_brightness: '50%',
        __filter_contrast: '125%',
        __filter_sepia: '100%',
      },
      {}
    )
    expect(result).toEqual({
      filter: 'blur(8px) brightness(50%) contrast(125%) sepia(100%)',
    })
  })

  test('drop-shadow composes into filter', () => {
    const result = composedResolver(
      {
        __filter_blur: '4px',
        __dropShadowGeometry: '0 3px 3px',
        __dropShadowColor: 'rgb(0 0 0 / 0.12)',
      },
      {}
    )
    expect(result).toEqual({
      filter: 'blur(4px) drop-shadow(0 3px 3px rgb(0 0 0 / 0.12))',
    })
  })

  // ── Transforms ──────────────────────────────────────────────────────
  test('transforms compose in fixed matrix order', () => {
    const result = composedResolver(
      {
        __transform_skewY: '6deg',
        __transform_rotateX: '45deg',
        __transform_perspective: '500px',
      },
      {}
    )
    expect(result).toEqual({
      transform: 'perspective(500px) rotateX(45deg) skewY(6deg)',
    })
  })

  // ── Text Shadows ────────────────────────────────────────────────────
  test('text-shadow preset + color override', () => {
    const result = composedResolver(
      {
        __textShadow_preset: {
          offset: { width: 0, height: 1 },
          radius: 1,
          defaultColor: 'rgb(0 0 0 / 0.2)',
        },
        __textShadow_color: 'red',
      },
      {}
    )
    expect(result).toEqual({
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 1,
      textShadowColor: 'red',
    })
  })

  // ── Conditional Modifiers ───────────────────────────────────────────
  test('conditional modifier objects produce scoped output', () => {
    const result = composedResolver(
      {
        __gradientDirection: 'to right',
        __gradientFrom: { default: 'red', hover: 'yellow' },
        __gradientTo: 'blue',
      },
      {}
    )
    expect(result).toEqual({
      backgroundImage: {
        default: 'linear-gradient(to right, red, blue)',
        hover: 'linear-gradient(to right, yellow, blue)',
      },
    })
  })

  test('conditional ring widths compose independently', () => {
    const result = composedResolver(
      {
        __ring: { default: '2px', hover: '4px' },
        __ringColor: 'blue',
      },
      {}
    )
    expect(result).toEqual({
      boxShadow: {
        default: '0 0 0 2px blue',
        hover: '0 0 0 4px blue',
      },
    })
  })

  // ── Regular Props ───────────────────────────────────────────────────
  test('regular JSX props (ring, ringColor) compose identically', () => {
    const result = composedResolver({ ring: 2, ringColor: 'blue' }, {})
    expect(result).toEqual({ boxShadow: '0 0 0 2px blue' })
  })
})

describe('.resolve() chain works on styled components', () => {
  test('resolver is attached to the static config', () => {
    const RingView = styled(View, {
      variants: {
        ring: (styled as any).dynamic(),
        ringColor: (styled as any).dynamic(),
      },
    }).resolve((props: any, _env: any) => {
      if (props.ring != null) {
        return { boxShadow: `0 0 0 ${props.ring}px ${props.ringColor ?? 'currentColor'}` }
      }
      return null
    })

    const staticConfig = (RingView as any).staticConfig
    expect(staticConfig.resolvers).toBeDefined()
    expect(staticConfig.resolvers.length).toBe(1)

    const resolver = staticConfig.resolvers[0]
    expect(resolver({ ring: 2, ringColor: 'blue' }, {})).toEqual({
      boxShadow: '0 0 0 2px blue',
    })
  })
})

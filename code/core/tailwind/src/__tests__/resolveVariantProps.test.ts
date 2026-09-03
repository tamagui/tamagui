/**
 * Proof of concept: className-resolved variant props flow into .resolve()
 * and the composedResolver produces correct boxShadow/backgroundImage.
 */
import { beforeAll, describe, expect, test } from 'vitest'
import { createTamagui, styled, View, getConfig } from '@tamagui/web'
import { getDefaultTamaguiConfig } from '../../../config-default/src'
import { composedResolver } from '../composedResolver'

beforeAll(() => {
  createTamagui(getDefaultTamaguiConfig() as any)
})

describe('composedResolver produces correct styles', () => {
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
      { __ring: '2px', __ringColor: 'blue', __existingShadow: '0 1px 2px red' },
      {}
    )
    expect(result).toEqual({ boxShadow: '0 0 0 2px blue, 0 1px 2px red' })
  })

  test('no ring props → null (no-op)', () => {
    const result = composedResolver({ padding: 4 }, {})
    expect(result).toBeNull()
  })

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

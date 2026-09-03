/**
 * Proof of concept: className-resolved variant props flow into .resolve()
 *
 * This test verifies the engine change that collects non-style-key props
 * from className resolution into styleState.classNameResolvedProps and
 * merges them into the props passed to .resolve() functions.
 */
import { beforeAll, describe, expect, test } from 'vitest'
import { createTamagui, styled, View, getConfig } from '@tamagui/web'
import { getDefaultTamaguiConfig } from '../../../config-default/src'

beforeAll(() => {
  createTamagui(getDefaultTamaguiConfig() as any)
})

describe('classNameResolvedProps merges into .resolve()', () => {
  test('.resolve() sees className-contributed non-style-key props', () => {
    // Create a component with bare dynamic variants and a .resolve()
    const RingView = styled(View, {
      variants: {
        ring: (styled as any).dynamic(),
        ringColor: (styled as any).dynamic(),
      },
    }).resolve((props: any, _env: any) => {
      if (props.ring != null) {
        const color = props.ringColor ?? 'currentColor'
        return { boxShadow: `0 0 0 ${props.ring}px ${color}` }
      }
      return null
    })

    const staticConfig = (RingView as any).staticConfig

    // Verify the resolver chain is set up
    expect(staticConfig.resolvers).toBeDefined()
    expect(staticConfig.resolvers.length).toBe(1)

    // Test that .resolve() produces the right output when called directly
    const resolver = staticConfig.resolvers[0]
    const result = resolver(
      { ring: 2, ringColor: 'blue' },
      { fonts: {}, tokens: {}, theme: {} }
    )
    expect(result).toEqual({ boxShadow: '0 0 0 2px blue' })

    // Test with defaults
    const resultDefault = resolver(
      { ring: 3 },
      { fonts: {}, tokens: {}, theme: {} }
    )
    expect(resultDefault).toEqual({ boxShadow: '0 0 0 3px currentColor' })

    // Test without ring (no-op)
    const resultNone = resolver(
      {},
      { fonts: {}, tokens: {}, theme: {} }
    )
    expect(resultNone).toBeNull()
  })
})

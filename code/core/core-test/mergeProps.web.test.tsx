import { mergeProps } from '@tamagui/web'
import { describe, expect, test } from 'vitest'

describe('mergeProps', () => {
  test('maintains prop order based on last spread object', () => {
    const result = mergeProps({ a: 1, b: 2 }, { b: 1, a: 2 })
    expect(Object.keys(result)).toEqual(['b', 'a'])
    expect(result).toEqual({ b: 1, a: 2 })
  })

  test('simple order test', () => {
    const result = mergeProps(
      { pressStyle: { bg: 'blue' }, variant: 'default' },
      { variant: 'primary', pressStyle: { bg: 'orange' } }
    )
    // Should be variant first, pressStyle second (order from the second object)
    expect(Object.keys(result)).toEqual(['variant', 'pressStyle'])
  })

  test('pseudo props should be merged, not skipped when conflict occurs', () => {
    const defaultProps = {
      pressStyle: { backgroundColor: 'green', scale: 1 },
      variant: 'default',
    }
    const runtimeProps = {
      pressStyle: { backgroundColor: 'red' }, // this should merge with defaultProps.pressStyle
      variant: 'primary',
    }

    const result = mergeProps(defaultProps, runtimeProps)

    // Pseudo props should be merged: runtime props override conflicting keys, but preserve others
    // Expected: { pressStyle: { backgroundColor: 'red', scale: 1 }, variant: 'primary' }
    expect(result.variant).toBe('primary')
    expect(result.pressStyle).toEqual({ backgroundColor: 'red', scale: 1 })
  })

  test('prop order should follow runtime props order', () => {
    // This simulates the issue you described:
    // mergeProps is called with (styledDefinition, runtimeProps)
    // The order should reflect runtimeProps order

    const styledDefinition = {
      pressStyle: { bg: 'blue' },
      variant: 'default',
    }

    // Case 1: variant first, then pressStyle in runtime props
    const runtimeProps1 = {
      variant: 'primary',
      pressStyle: { bg: 'orange' },
    }

    const result1 = mergeProps(styledDefinition, runtimeProps1)

    // Case 2: pressStyle first, then variant in runtime props
    const runtimeProps2 = {
      pressStyle: { bg: 'orange' },
      variant: 'primary',
    }

    const result2 = mergeProps(styledDefinition, runtimeProps2)

    // Prop order should follow runtime props order
    expect(Object.keys(result1)).toEqual(['variant', 'pressStyle']) // runtime order
    expect(Object.keys(result2)).toEqual(['pressStyle', 'variant']) // runtime order

    // PressStyle should be merged: runtime props override but preserve other styled properties
    expect(result1.pressStyle).toEqual({ bg: 'orange' }) // runtime props win for conflicting keys
    expect(result2.pressStyle).toEqual({ bg: 'orange' }) // runtime props win for conflicting keys
  })

  test('styled component with variant-based pressStyle - case 1: variant first', () => {
    // Based on: const StyledButton = styled(Stack, {
    //   name: 'StyledButton',
    //   pressStyle: { backgroundColor: 'green' },
    //   variants: {
    //     variant: {
    //       prim: { pressStyle: { backgroundColor: 'blue' } }
    //     }
    //   }
    // })
    // Simulates: <StyledButton variant='prim' pressStyle={{ backgroundColor: 'orange' }} />
    const styledDefinition = {
      name: 'StyledButton',
      pressStyle: {
        backgroundColor: 'blue', // final value after variant.prim.pressStyle overrides base
      },
      variants: {
        variant: {
          prim: {
            pressStyle: { backgroundColor: 'blue' },
          },
        },
      },
    }

    const runtimeProps = {
      variant: 'prim',
      pressStyle: { backgroundColor: 'orange' },
    }

    const result = mergeProps(styledDefinition, runtimeProps)

    // Should follow runtime props order: variant first, then pressStyle
    expect(Object.keys(result)).toEqual(['variant', 'pressStyle', 'name', 'variants'])
    expect(result.variant).toBe('prim')
    // Runtime pressStyle should merge with styled pressStyle, overriding backgroundColor
    expect(result.pressStyle).toEqual({ backgroundColor: 'orange' })
  })

  test('styled component with variant-based pressStyle - case 2: pressStyle first', () => {
    // Based on: const StyledButton = styled(Stack, {
    //   name: 'StyledButton',
    //   pressStyle: { backgroundColor: 'green' },
    //   variants: {
    //     variant: {
    //       prim: { pressStyle: { backgroundColor: 'blue' } }
    //     }
    //   }
    // })
    // Simulates: <StyledButton pressStyle={{ backgroundColor: 'orange' }} variant='prim' />
    const styledDefinition = {
      name: 'StyledButton',
      pressStyle: {
        backgroundColor: 'blue', // final value after variant.prim.pressStyle overrides base
      },
      variants: {
        variant: {
          prim: {
            pressStyle: { backgroundColor: 'blue' },
          },
        },
      },
    }

    const runtimeProps = {
      pressStyle: { backgroundColor: 'orange' },
      variant: 'prim',
    }

    const result = mergeProps(styledDefinition, runtimeProps)

    // Should follow runtime props order: pressStyle first, then variant
    expect(Object.keys(result)).toEqual(['pressStyle', 'variant', 'name', 'variants'])
    expect(result.variant).toBe('prim')
    // Runtime pressStyle should merge with styled pressStyle, overriding backgroundColor
    expect(result.pressStyle).toEqual({ backgroundColor: 'orange' })
  })
})

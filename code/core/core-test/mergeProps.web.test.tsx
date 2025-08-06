import { mergeProps } from '@tamagui/web'
import { describe, expect, test } from 'vitest'

describe('mergeProps', () => {
  test('maintains prop order based on last spread object', () => {
    const result = mergeProps({ a: 1, b: 2 }, { b: 1, a: 2 })
    expect(Object.keys(result)).toEqual(['b', 'a'])
    expect(result).toEqual({ b: 1, a: 2 })
  })

  test('base styles come before runtime variant props', () => {
    // Simulates styled(View, { bg: 'red', variants: { alt: { true: { bg: 'blue' } } } })
    const variants = { alt: { true: { bg: 'blue' } } }
    const defaultProps = { bg: 'red' }
    const runtimeProps = { alt: true }

    const result = mergeProps(defaultProps, runtimeProps, undefined, variants)

    // Base styles should come first, then variant props
    expect(Object.keys(result)).toEqual(['bg', 'alt'])
  })

  test('runtime prop order determines override priority', () => {
    // Test case: <StyledView alt bg="green" /> vs <StyledView bg="green" alt />
    // Based on: styled(Stack, { bg: 'red', width: 50, height: 50, variants: { alt: { true: { bg: 'blue' } } } })
    const variants = { alt: { true: { bg: 'blue' } } }
    const defaultProps = { bg: 'red', width: 50, height: 50 }

    // Case 1: alt first, then bg="green" - bg should win
    const runtimeProps1 = { alt: true, bg: 'green' }
    const result1 = mergeProps(defaultProps, runtimeProps1, undefined, variants)
    expect(Object.keys(result1)).toEqual(['width', 'height', 'alt', 'bg'])

    // Case 2: bg="green" first, then alt - alt should win
    const runtimeProps2 = { bg: 'green', alt: true }
    const result2 = mergeProps(defaultProps, runtimeProps2, undefined, variants)
    expect(Object.keys(result2)).toEqual(['width', 'height', 'bg', 'alt'])
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

  test('pseudo props maintain runtime order when overriding defaults', () => {
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

    // Prop order should follow runtime props order for pseudo/variant props
    expect(Object.keys(result1)).toEqual(['variant', 'pressStyle'])
    expect(Object.keys(result2)).toEqual(['pressStyle', 'variant'])

    // PressStyle should be merged
    expect(result1.pressStyle).toEqual({ bg: 'orange' })
    expect(result2.pressStyle).toEqual({ bg: 'orange' })
  })

  test('styled component with variant-based pressStyle - case 1: variant first', () => {
    const styledDefinition = {
      name: 'StyledButton',
      pressStyle: {
        backgroundColor: 'red',
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

    // Non-variant props come first, then runtime variant/pseudo props in order
    // expect(Object.keys(result)).toEqual(['pressStyle', 'name', 'variants', 'variant',])
    expect(result.variant).toBe('prim')
    // Runtime pressStyle should merge with styled pressStyle, overriding backgroundColor
    expect(result.pressStyle).toEqual({ backgroundColor: 'orange' })
  })

  test('variant props with defaultVariants should preserve runtime order', () => {
    // Simulates ViewCustomWithDefaults with defaultVariants: { variant: 'solid' }
    const variants = {
      variant: { solid: { bg: 'green' }, ghost: { bg: 'blue' } },
      iconOnly: { true: { width: 25, height: 25 } },
    }
    const defaultProps = {
      background: 'red',
      width: 50,
      height: 50,
      variant: 'solid', // from defaultVariants
    }

    // Runtime props: variant="ghost" iconOnly
    const runtimeProps = {
      variant: 'ghost',
      iconOnly: true,
    }

    const result = mergeProps(defaultProps, runtimeProps, undefined, variants)

    // Base styles first, then runtime props in order
    expect(Object.keys(result)).toEqual([
      'background',
      'width',
      'height',
      'variant',
      'iconOnly',
    ])
    expect(result.variant).toBe('ghost')
    expect(result.iconOnly).toBe(true)
  })

  test('styled component with variant and pressStyle - case 2: pressStyle first', () => {
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

    // Non-variant props come first, then runtime variant/pseudo props in order
    expect(Object.keys(result)).toEqual(['name', 'variants', 'pressStyle', 'variant'])
    expect(result.variant).toBe('prim')
    // Runtime pressStyle should merge with styled pressStyle, overriding backgroundColor
    expect(result.pressStyle).toEqual({ backgroundColor: 'orange' })
  })
})

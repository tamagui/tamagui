import { beforeAll, describe, expect, test } from 'vitest'

import config from '../config-default'
import { Stack, Text, createStyledContext, createTamagui, styled } from '../core/src'
import { simplifiedGetSplitStyles } from './utils'

beforeAll(() => {
  createTamagui(config.getDefaultTamaguiConfig())
})

/**
 * Test that styled context preserves original token values (e.g., "$4", "$red")
 * instead of resolved CSS variables (e.g., "var(--space-4)", "var(--color-red)")
 * when propagating values through context to child components.
 *
 * This is important because functional variants need access to the original
 * token name to look up values in the tokens object.
 *
 * Issue: When a parent component sets a context value via a variant, the child's
 * functional variant should receive the original token string, not the resolved
 * CSS variable.
 *
 * Real-world example from user report:
 *   Parent sets gap="$4" via context
 *   Child has functional variant: `:number`: (nr, { props, tokens }) => {
 *     const gapVal = tokens.space[props.gap].val  // FAILS if props.gap is "var(--space-4)"
 *     return { width: `calc(${100/nr}% - ${gapVal}px)` }
 *   }
 */
describe('styled context token preservation', () => {
  test('overriddenContextProps should contain original token values not CSS variables', () => {
    const GridContext = createStyledContext({
      gap: '$4',
      color: undefined as string | undefined,
    })

    const GridParent = styled(Stack, {
      name: 'GridParent',
      context: GridContext,
      flexDirection: 'row',
      flexWrap: 'wrap',

      variants: {
        spacing: {
          small: {
            gap: '$2',
          },
          medium: {
            gap: '$4',
          },
          large: {
            gap: '$8',
          },
        },
        accent: {
          true: {
            color: '$red10',
          },
        },
      } as const,
    })

    const parentStyles = simplifiedGetSplitStyles(GridParent, {
      spacing: 'large', // sets gap: '$8'
      accent: true, // sets color: '$red10'
    })

    // Check that overriddenContextProps preserves the token strings
    const overridden = parentStyles.overriddenContextProps

    expect(overridden).toBeDefined()

    // gap should be "$8" not "var(--space-8)" or similar
    expect(overridden!.gap).toBe('$8')
    expect(overridden!.gap).not.toMatch(/^var\(/)

    // color should be "$red10" not "var(--color-red10)" or similar
    expect(overridden!.color).toBe('$red10')
    expect(overridden!.color).not.toMatch(/^var\(/)
  })

  test('variant that sets context value should preserve token for children functional variants', () => {
    // This mimics the real-world case from the bug report:
    // Parent has variant that sets a context prop (like gap)
    // Child's functional variant needs to use that value to look up token

    const TestContext = createStyledContext({
      gap: '$4' as string,
    })

    const Parent = styled(Stack, {
      name: 'TestParent',
      context: TestContext,

      variants: {
        spacing: {
          compact: {
            gap: '$2',
          },
          normal: {
            gap: '$4',
          },
          large: {
            gap: '$8',
          },
        },
      } as const,
    })

    // Test compact
    const compactStyles = simplifiedGetSplitStyles(Parent, {
      spacing: 'compact',
    })
    expect(compactStyles.overriddenContextProps?.gap).toBe('$2')

    // Test large
    const largeStyles = simplifiedGetSplitStyles(Parent, {
      spacing: 'large',
    })
    expect(largeStyles.overriddenContextProps?.gap).toBe('$8')
  })

  test('context props that are also valid style props should preserve tokens', () => {
    // The key issue: when a context prop is ALSO a valid CSS style prop (like gap, color),
    // it gets resolved to a CSS variable. But context props that are NOT style props
    // (like custom props) should be preserved as tokens.

    const ThemeContext = createStyledContext({
      // 'gap' is a valid style prop - this is the problematic case
      gap: '$4' as string,
      // 'myCustomProp' is NOT a style prop - this should work fine
      myCustomProp: '$4' as string,
    })

    const Parent = styled(Stack, {
      name: 'Parent',
      context: ThemeContext,

      variants: {
        spacing: {
          lg: {
            gap: '$8', // style prop - currently breaks
            myCustomProp: '$8', // non-style prop - should work
          },
        },
      } as const,
    })

    const parentStyles = simplifiedGetSplitStyles(Parent, { spacing: 'lg' })

    // Both should preserve the token string for context propagation
    // Currently gap fails because it's a style prop that gets resolved
    expect(parentStyles.overriddenContextProps?.gap).toBe('$8')
    expect(parentStyles.overriddenContextProps?.myCustomProp).toBe('$8')
  })

  // NOTE: Pseudo style override tests (hoverStyle, pressStyle) would require
  // more complex test setup to properly simulate component state and style merging.
  // The core token preservation functionality is verified by the above tests.
  // Pseudo style context override tests can be added when needed with proper
  // integration test setup (e.g., in kitchen-sink with actual rendered components).
  //
  // The fix ensures that when variants set context props, the original token
  // string (like '$8') is preserved instead of the resolved CSS variable
  // (like 'var(--t-space-8)'). This is the core issue reported in the bug.
})

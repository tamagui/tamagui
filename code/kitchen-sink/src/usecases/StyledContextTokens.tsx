import { Stack, Text, createStyledContext, styled, useMedia } from 'tamagui'

/**
 * Test case for styled context token preservation (issues #3670, #3676)
 *
 * This tests that when a parent component sets a context value via a variant,
 * the child's functional variant receives the original token string (like '$4')
 * instead of the resolved CSS variable (like 'var(--t-space-4)').
 *
 * The child uses a functional variant that looks up the gap token value
 * to calculate width. If it receives 'var(--t-space-4)' instead of '$4',
 * the token lookup fails.
 */

const GridContext = createStyledContext({
  gap: '$4' as string,
  columns: 2 as number,
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
  } as const,
})

const GridChild = styled(Stack, {
  name: 'GridChild',
  context: GridContext,
  height: 50,
  backgroundColor: '$blue10',

  variants: {
    columns: {
      // Functional variant that uses context props
      ':number': (columns, { props, tokens }) => {
        const gapToken = props.gap as string

        // Test: gapToken should be '$2', '$4', or '$8' - NOT 'var(--t-space-X)'
        // If it's a CSS variable, the token lookup below will fail
        const isTokenString = gapToken?.startsWith('$')

        // Try to get the gap value from tokens
        let gapValue = 0
        if (isTokenString && gapToken) {
          const tokenKey = gapToken.slice(1) // remove '$'
          const spaceToken = tokens.space[`$${tokenKey}`]
          if (spaceToken) {
            gapValue = typeof spaceToken.val === 'number' ? spaceToken.val : 0
          }
        }

        // Calculate width based on columns and gap
        // width = (100% / columns) - (gap * (columns - 1) / columns)
        const widthPercent = 100 / columns
        const gapAdjustment = (gapValue * (columns - 1)) / columns

        return {
          width: `calc(${widthPercent}% - ${gapAdjustment}px)`,
        }
      },
    },
  } as const,
})

// Component that displays debug info about the context props
const DebugInfo = styled(Text, {
  name: 'DebugInfo',
  context: GridContext,
  fontSize: 12,
  fontFamily: '$mono',
})

function DebugDisplay({ id }: { id: string }) {
  // Access context to show what values the child receives
  const context = GridContext.useStyledContext()
  const isToken = context.gap?.startsWith('$')

  return (
    <Stack id={id} padding="$2" backgroundColor={isToken ? '$green5' : '$red5'}>
      <DebugInfo>gap: {context.gap}</DebugInfo>
      <DebugInfo>isToken: {String(isToken)}</DebugInfo>
      <DebugInfo id={`${id}-gap-value`}>{context.gap}</DebugInfo>
    </Stack>
  )
}

export function StyledContextTokens() {
  const media = useMedia()

  return (
    <Stack padding="$4" gap="$4">
      <Text fontWeight="bold">Styled Context Token Preservation Test</Text>

      {/* Test 1: Variant sets gap to $2 */}
      <Stack>
        <Text>Test 1: spacing="small" should set gap="$2"</Text>
        <GridParent spacing="small" id="test-small">
          <DebugDisplay id="debug-small" />
          <GridChild columns={2} id="child-small-1" />
          <GridChild columns={2} id="child-small-2" />
        </GridParent>
      </Stack>

      {/* Test 2: Variant sets gap to $8 */}
      <Stack>
        <Text>Test 2: spacing="large" should set gap="$8"</Text>
        <GridParent spacing="large" id="test-large">
          <DebugDisplay id="debug-large" />
          <GridChild columns={2} id="child-large-1" />
          <GridChild columns={2} id="child-large-2" />
        </GridParent>
      </Stack>

      {/* Test 3: Default gap (no variant) */}
      <Stack>
        <Text>Test 3: no spacing prop, default gap="$4"</Text>
        <GridParent id="test-default">
          <DebugDisplay id="debug-default" />
          <GridChild columns={2} id="child-default-1" />
          <GridChild columns={2} id="child-default-2" />
        </GridParent>
      </Stack>

      {/* Show current media state for debugging */}
      <Stack padding="$2" backgroundColor="$gray5">
        <Text fontSize={10}>
          Media: sm={String(media.sm)} md={String(media.md)} lg={String(media.lg)}
        </Text>
      </Stack>
    </Stack>
  )
}

import { Text, styled } from 'tamagui'

// Test case for GitHub issue #3789: Nested Text breaks inheritance of some styles/props

const BoldText = styled(Text, {
  fontWeight: 'bold',
})

export function TextNestedInheritance() {
  return (
    <>
      {/* Test 1: numberOfLines should apply to nested text */}
      <Text
        testID="parent-number-of-lines"
        numberOfLines={1}
        width={200}
        color="red"
      >
        This is a very long text that should be truncated with an ellipsis and
        <Text testID="nested-in-number-of-lines" fontWeight="bold">
          {' '}
          this nested bold text
        </Text>{' '}
        should also be truncated
      </Text>

      {/* Test 2: color should inherit to nested text */}
      <Text testID="parent-color" color="blue">
        Parent blue text with
        <Text testID="nested-color" fontWeight="bold">
          {' '}
          nested bold text that should also be blue
        </Text>
      </Text>

      {/* Test 3: fontFamily should inherit to nested text */}
      <Text testID="parent-font-family" fontFamily="$body">
        Parent with body font and
        <Text testID="nested-font-family" fontWeight="bold">
          {' '}
          nested text should inherit font
        </Text>
      </Text>

      {/* Test 4: whiteSpace should inherit (important for numberOfLines) */}
      <Text
        testID="parent-whitespace"
        whiteSpace="nowrap"
        width={200}
        overflow="hidden"
      >
        Long text that should not wrap because whiteSpace is nowrap and
        <Text testID="nested-whitespace" fontWeight="bold">
          {' '}
          nested text should inherit nowrap
        </Text>
      </Text>

      {/* Test 5: letterSpacing should inherit */}
      <Text testID="parent-letter-spacing" letterSpacing={5}>
        Spaced text with
        <Text testID="nested-letter-spacing" fontWeight="bold">
          {' '}
          nested text
        </Text>
      </Text>

      {/* Test 6: Using styled component for nested text */}
      <Text testID="parent-styled" color="green">
        Parent green with
        <BoldText testID="nested-styled"> styled bold child</BoldText>
      </Text>

      {/* Test 7: Explicit override should still work */}
      <Text testID="parent-override" color="purple">
        Parent purple with
        <Text testID="nested-override" color="orange">
          {' '}
          nested orange (explicit override)
        </Text>
      </Text>
    </>
  )
}

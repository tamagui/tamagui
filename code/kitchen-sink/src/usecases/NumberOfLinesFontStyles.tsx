import { Paragraph, SizableText, Text } from 'tamagui'

// Test case: numberOfLines should not change fontWeight or lineHeight
// Issue: Specifying numberOfLines on text results in changes to font styling

export function NumberOfLinesFontStyles() {
  return (
    <>
      {/* Test 1: SizableText with size="$4", no numberOfLines */}
      <SizableText testID="sized-no-lines" size="$4">
        Reference text without numberOfLines
      </SizableText>

      {/* Test 2: SizableText with size="$4" and numberOfLines={1} */}
      <SizableText testID="sized-one-line" size="$4" numberOfLines={1} width={200}>
        Text with numberOfLines={1} - should have same font styling as reference
      </SizableText>

      {/* Test 3: SizableText with size="$4" and numberOfLines={2} */}
      <SizableText testID="sized-two-lines" size="$4" numberOfLines={2} width={200}>
        Text with numberOfLines=2 that is long enough to wrap and test multi-line
        clamping behavior while maintaining font styling consistency
      </SizableText>

      {/* Test 4: Paragraph with no numberOfLines */}
      <Paragraph testID="para-no-lines">Reference paragraph without numberOfLines</Paragraph>

      {/* Test 5: Paragraph with numberOfLines={1} */}
      <Paragraph testID="para-one-line" numberOfLines={1} width={200}>
        Paragraph with numberOfLines=1 should have same font styling as reference paragraph
      </Paragraph>

      {/* Test 6: Paragraph with numberOfLines={2} */}
      <Paragraph testID="para-two-lines" numberOfLines={2} width={200}>
        Paragraph with numberOfLines=2 that is long enough to wrap and test multi-line
        clamping behavior while maintaining consistent font styling
      </Paragraph>

      {/* Test 7: Plain Text (no size variant) with no numberOfLines */}
      <Text testID="text-no-lines">Plain text without numberOfLines</Text>

      {/* Test 8: Plain Text with numberOfLines={1} */}
      <Text testID="text-one-line" numberOfLines={1} width={200}>
        Plain text with numberOfLines=1
      </Text>

      {/* Test 9: Plain Text with numberOfLines={2} */}
      <Text testID="text-two-lines" numberOfLines={2} width={200}>
        Plain text with numberOfLines=2 that is long enough to wrap
      </Text>
    </>
  )
}

import { Paragraph, SizableText, Span, Text } from 'tamagui'

// Test case: Span inside Paragraph should inherit fontFamily
// Issue: When Span is nested inside Paragraph with fontFamily="$mono",
// the Span does not inherit the mono font family

export function ParagraphSpanFontInheritance() {
  return (
    <>
      {/* Test 1: Span should inherit $mono fontFamily from Paragraph */}
      <Paragraph testID="parent-mono" fontFamily="$mono">
        mono paragraph with <Span testID="nested-span-mono">span text</Span> inside
      </Paragraph>

      {/* Test 2: Span should inherit $body fontFamily from Paragraph */}
      <Paragraph testID="parent-body" fontFamily="$body">
        body paragraph with <Span testID="nested-span-body">span text</Span> inside
      </Paragraph>

      {/* Test 3: Text inside Text (for comparison) */}
      <Text testID="parent-text-mono" fontFamily="$mono">
        mono text with <Text testID="nested-text-mono">nested text</Text> inside
      </Text>

      {/* Test 4: Span with explicit fontFamily override */}
      <Paragraph testID="parent-mono-override" fontFamily="$mono">
        mono paragraph with{' '}
        <Span testID="nested-span-override" fontFamily="$body">
          span with body font
        </Span>{' '}
        inside
      </Paragraph>

      {/* Test 5: SizableText (which explicitly sets fontFamily) should keep its explicit font */}
      <Text testID="parent-mono-sizable" fontFamily="$mono">
        mono text with{' '}
        <SizableText testID="nested-sizable-body">
          sizable text with body font
        </SizableText>{' '}
        inside
      </Text>

      {/* Test 6: Text (like Link) inside Paragraph should inherit fontFamily */}
      <Paragraph testID="parent-para-link" fontFamily="$mono">
        mono paragraph with{' '}
        <Text testID="nested-link-text" render="a" cursor="pointer">
          link text
        </Text>{' '}
        inside
      </Paragraph>
    </>
  )
}

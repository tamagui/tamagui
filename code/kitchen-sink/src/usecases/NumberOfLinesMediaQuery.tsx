import { SizableText, Text } from 'tamagui'

// Test case: numberOfLines should work inside media queries and platform props
export function NumberOfLinesMediaQuery() {
  return (
    <>
      {/* Test 1: numberOfLines in $platform-web */}
      <SizableText
        testID="platform-web-nol"
        size="$4"
        width={200}
        $platform-web={{ numberOfLines: 1 }}
      >
        This text should be truncated to one line on web via platform prop. It needs to be
        long enough to actually trigger truncation behavior.
      </SizableText>

      {/* Test 2: numberOfLines=2 in $platform-web */}
      <SizableText
        testID="platform-web-nol-2"
        size="$4"
        width={200}
        $platform-web={{ numberOfLines: 2 }}
      >
        This text should be clamped to two lines on web via platform prop. It needs to be
        long enough to actually trigger multi-line truncation behavior and overflow.
      </SizableText>

      {/* Test 3: numberOfLines at top level (reference) */}
      <SizableText testID="top-level-nol" size="$4" width={200} numberOfLines={1}>
        This text should be truncated to one line at top level. It needs to be long enough
        to actually trigger truncation behavior.
      </SizableText>

      {/* Test 4: numberOfLines in a media query (xs = small viewport) */}
      <Text testID="media-nol" width={200} $xs={{ numberOfLines: 1 }}>
        This text should be truncated to one line at xs breakpoint. It needs to be long
        enough to actually trigger truncation behavior.
      </Text>

      {/* Test 5: reference without any numberOfLines */}
      <SizableText testID="no-nol" size="$4" width={200}>
        This text has no numberOfLines set so it should wrap normally without any
        truncation behavior applied to it.
      </SizableText>
    </>
  )
}

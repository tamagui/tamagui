import { Text, View } from 'tamagui'

// Smoke test for $textOverflow="ellipsis" cross-platform.
// Web: applies CSS text-overflow: ellipsis (plus overflow:hidden + white-space:nowrap via the
//   existing webOnlyStylePropsText path).
// Native: getSplitStyles maps textOverflow="ellipsis" on Text to numberOfLines={1}
//   + ellipsizeMode="tail" (see webPropsToSkip.native.ts + native branch in getSplitStyles.tsx).

export function TextOverflowEllipsis() {
  return (
    <View padding="$4" gap="$3" width={240}>
      <Text
        testID="text-overflow-ellipsis"
        textOverflow="ellipsis"
        overflow="hidden"
        whiteSpace="nowrap"
        backgroundColor="$background"
      >
        this is a very long line of text that should truncate with an ellipsis on both web
        and native
      </Text>

      {/* explicit numberOfLines wins on native (?? in mapping leaves it alone) */}
      <Text
        testID="text-overflow-ellipsis-with-numlines"
        textOverflow="ellipsis"
        numberOfLines={2}
        overflow="hidden"
      >
        when numberOfLines is set explicitly on native, the textOverflow mapping should
        not override it, allowing two-line ellipsis truncation
      </Text>
    </View>
  )
}

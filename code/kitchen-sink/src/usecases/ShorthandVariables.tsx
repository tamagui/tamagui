import { Stack } from 'tamagui'

export function ShorthandVariables() {
  return (
    <Stack gap="$4" padding="$4">
      {/* boxShadow with $variable - works on web and native (RN 0.76+) */}
      <Stack
        testID="boxshadow-var"
        id="boxshadow-var"
        width={100}
        height={100}
        backgroundColor="$background"
        boxShadow="0px 0px 10px $shadowColor"
      />

      {/* boxShadow with multiple $variables */}
      <Stack
        testID="boxshadow-multi"
        id="boxshadow-multi"
        width={100}
        height={100}
        backgroundColor="$background"
        boxShadow="0px 0px 5px $shadowColor, 0px 0px 15px $color"
      />

      {/* border with $variable - use individual props for cross-platform */}
      <Stack
        testID="border-var"
        id="border-var"
        width={100}
        height={100}
        backgroundColor="$background"
        borderWidth={2}
        borderStyle="solid"
        borderColor="$color"
      />

      {/* boxShadow without variables (passthrough) */}
      <Stack
        testID="boxshadow-plain"
        id="boxshadow-plain"
        width={100}
        height={100}
        backgroundColor="$background"
        boxShadow="0px 0px 10px rgba(0, 0, 0, 0.2)"
      />
    </Stack>
  )
}

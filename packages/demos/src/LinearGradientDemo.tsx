import { XStack } from 'tamagui'
import { LinearGradient } from 'tamagui/linear-gradient'

export function LinearGradientDemo() {
  return (
    <XStack space>
      {/* tokens */}
      <LinearGradient
        width="$6"
        height="$6"
        borderRadius="$4"
        colors={['$red10', '$yellow10']}
        start={[0, 1]}
        end={[0, 0]}
      />

      {/* theme values */}
      <LinearGradient
        width="$6"
        height="$6"
        borderRadius="$4"
        colors={['$background', '$color']}
        start={[1, 1]}
        end={[0, 0]}
      />
    </XStack>
  )
}

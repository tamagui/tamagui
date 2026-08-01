import { XStack } from 'tamagui'
import { LinearGradient } from '@tamagui/linear-gradient'

export function LinearGradientDemo() {
  return (
    <XStack gap="4">
      {/* tokens */}
      <LinearGradient
        width="6"
        height="6"
        rounded="4"
        start={[0, 1]}
        end={[0, 0]}
        colors={['$red10', '$yellow10']}
      />

      {/* theme values */}
      <LinearGradient
        width="6"
        height="6"
        rounded="4"
        start={[1, 1]}
        end={[0, 0]}
        colors={['$background', '$color']}
      />
    </XStack>
  )
}

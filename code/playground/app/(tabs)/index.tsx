import { Anchor, H2, Paragraph, XStack, YStack } from 'tamagui'
import { ToastControl } from 'components/CurrentToast'

export default function TabOneScreen() {
  return (
    <YStack flex={1} items="center" gap="$8" px="$10" pt="$5" bg="$background">
      <YStack width={100} height={100} backgroundColor="$color2" />
    </YStack>
  )
}

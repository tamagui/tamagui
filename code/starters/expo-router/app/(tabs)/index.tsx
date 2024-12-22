import { ExternalLink } from '@tamagui/lucide-icons'
import { Anchor, H2, Paragraph, XStack, YStack } from 'tamagui'
import { ToastControl } from 'app/CurrentToast'

export default function TabOneScreen() {
  return (
    <YStack f={1} ai="center" gap="$8" px="$10" pt="$5" bg="$background">
      <H2>Tamagui + Expo</H2>

      <ToastControl />

      <XStack ai="center" jc="center" fw="wrap" gap="$1.5" pos="absolute" b="$8">
        <Paragraph fos="$5">Add</Paragraph>

        <Paragraph fos="$5" px="$2" py="$1" col="$blue10" bg="$blue5">
          tamagui.config.ts
        </Paragraph>

        <Paragraph fos="$5">to root and follow the</Paragraph>

        <XStack
          ai="center"
          gap="$1.5"
          px="$2"
          py="$1"
          br="$3"
          bg="$purple5"
          hoverStyle={{ bg: '$purple6' }}
          pressStyle={{ bg: '$purple4' }}
        >
          <Anchor
            href="https://tamagui.dev/docs/core/configuration"
            textDecorationLine="none"
            col="$purple10"
            fos="$5"
          >
            Configuration guide
          </Anchor>
          <ExternalLink size="$1" col="$purple10" />
        </XStack>

        <Paragraph fos="$5" ta="center">
          to configure your themes and tokens.
        </Paragraph>
      </XStack>
    </YStack>
  )
}

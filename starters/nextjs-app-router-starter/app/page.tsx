'use client'

import { ExternalLink } from '@tamagui/lucide-icons'
import { Anchor, H1, Paragraph, XStack, YStack } from 'tamagui'
import { ToastViewport } from '@tamagui/toast'
import SwitchThemeButton from './SwitchThemeButton'
import { ToastControl, CurrentToast } from './CurrentToast'

export default function Home() {
  return (
    <YStack fullscreen ai="center" jc="center" gap="$8" mx="$10" bg="$alt1">
      <H1>Tamagui + Next.js (App router) + React</H1>

      <SwitchThemeButton />

      <ToastControl />
      <CurrentToast />
      <ToastViewport top="$5" left="$5" right="$5" />

      <XStack ai="center" fw="wrap" gap="$1.5" pos="absolute" b="$8">
        <Paragraph fos="$5">Add</Paragraph>

        <Paragraph fos="$5" px="$2" py="$1" col="$blue10Light" bg="$blue5Light" br="$3">
          tamagui.config.ts
        </Paragraph>

        <Paragraph fos="$5">to root and follow the</Paragraph>

        <XStack
          ai="center"
          gap="$1.5"
          px="$2"
          py="$1"
          br="$3"
          bg="$purple5Light"
          hoverStyle={{ bg: '$purple6Light' }}
        >
          <Anchor
            href="https://tamagui.dev/docs/core/configuration"
            textDecorationLine="none"
            col="$purple10Light"
            fos="$5"
          >
            Configuration guide
          </Anchor>
          <ExternalLink size="$1" col="$purple10Light" />
        </XStack>

        <Paragraph fos="$5">to configure your themes and tokens.</Paragraph>
      </XStack>
    </YStack>
  )
}

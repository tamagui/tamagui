import { colorSchemes } from '@tamagui/theme-base'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Button, H2, H3, Paragraph, Text, Theme, XStack, YStack } from 'tamagui'

import { Code, CodeInline } from './Code'
import { ContainerLarge } from './Container'
import { MediaPlayer } from './MediaPlayer'

export function HeroExampleAnimations() {
  return (
    <YStack>
      <ContainerLarge position="relative">
        <YStack zi={1} space="$2">
          <H2 als="center">First class animations</H2>
          <H3 theme="alt2" als="center" fow="400">
            Swappable animation drivers for every platform.
          </H3>
        </YStack>
      </ContainerLarge>
    </YStack>
  )
}

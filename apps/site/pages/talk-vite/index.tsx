import { LogoWords, TamaguiLogo } from '@tamagui/logo'
import { NextSeo } from 'next-seo'
import { useEffect, useState } from 'react'
import { Spacer, XStack, YStack } from 'tamagui'

import { Slides, slideDimensions } from '../../components/Slides'
import { ThemeToggle } from '../../components/ThemeToggle'

export default function TamaguiTalk() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <YStack {...slideDimensions}>
      <NextSeo title="Tamagui Vite Talk" description="Tamagui Vite Talk" />
      <XStack pos="absolute" t="$0" l="$0" r="$0" p="$4" zi={1000}>
        <YStack>
          <TamaguiLogo y={15} x={10} downscale={2} />
        </YStack>

        <YStack fullscreen ai="center" jc="center">
          <LogoWords />
        </YStack>

        <Spacer flex />

        <ThemeToggle borderWidth={0} chromeless />
      </XStack>

      <YStack pos="absolute" {...slideDimensions} ov="hidden">
        <YStack o={0.6} fullscreen>
          <YStack fullscreen className="bg-grid" />
        </YStack>
        {/* <RibbonContainer /> */}
      </YStack>

      <Slides
        slides={
          [
            //
          ]
        }
      />
    </YStack>
  )
}

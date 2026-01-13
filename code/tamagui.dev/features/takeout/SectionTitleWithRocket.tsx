import type React from 'react'
import { Image } from '@tamagui/image'
import { ThemeTintAlt } from '@tamagui/logo'
import { SizableText, YStack } from 'tamagui'
import { heroHeight } from './useScrollProgress'

export const SectionTitleWithRocket = () => {
  return (
    <YStack
      mt={heroHeight + 350}
      $sm={{ mt: heroHeight + 50 }}
      items="center"
      px="$4"
      position="relative"
      overflow="visible"
    >
      <ThemeTintAlt>
        <SizableText
          size="$10"
          fontFamily="$silkscreen"
          color="$color11"
          letterSpacing={2}
          text="center"
          $sm={{ size: '$8' }}
        >
          FROM IDEA TO PRODUCTION
        </SizableText>
      </ThemeTintAlt>
    </YStack>
  )
}

export const RocketOrbit = ({ children }: { children: React.ReactNode }) => {
  return (
    <YStack position="relative" overflow="visible">
      {children}
      <div className="orbit-container">
        <div className="orbit-planet">
          <Image
            src="/takeout/planet.png"
            alt="Planet"
            width={60}
            height={60}
            objectFit="contain"
          />
        </div>
      </div>
    </YStack>
  )
}

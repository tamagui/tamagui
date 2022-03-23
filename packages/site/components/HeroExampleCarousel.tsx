import React from 'react'
import { ScrollView } from 'react-native'
import { H2, H3, Theme, XStack, YStack } from 'tamagui'

import { colorSchemes } from '../constants/themes'
import { ContainerLarge } from './Container'
import { MediaPlayer } from './MediaPlayer'

export function HeroExampleCarousel() {
  return (
    <YStack
      mb={240 - 20}
      $gtLg={{
        ai: 'center',
      }}
    >
      <ContainerLarge position="relative">
        <YStack zi={1} space="$4">
          <H2 als="center">Truly flexible themes</H2>
          <H3 theme="alt2" als="center" fow="400">
            Unlimited sub-themes, down to the component.
          </H3>
        </YStack>
      </ContainerLarge>

      {/* <ScrollView horizontal showsHorizontalScrollIndicator={false}> */}
      {[{ name: null }, ...colorSchemes.slice(2, 5)].map(({ name }, index) => {
        return (
          <Theme key={name} name={name}>
            <XStack
              pos="relative"
              zi={100 - index}
              px="$6"
              mb={-240}
              py="$4"
              className="faded-container"
              x={index * 50}
              opacity={(4 - index) / 3}
            >
              <MediaPlayer />
              <MediaPlayer alt={1} />
              <MediaPlayer alt={2} />
              <MediaPlayer alt={3} />
            </XStack>
          </Theme>
        )
      })}

      {/* </ScrollView> */}
    </YStack>
  )
}

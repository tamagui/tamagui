import React from 'react'
import { ScrollView } from 'react-native'
import { Button, H2, H3, H4, Paragraph, Text, Theme, XStack, YStack } from 'tamagui'

import { colorSchemes } from '../constants/themes'
import { ContainerLarge } from './Container'
import { MediaPlayer } from './MediaPlayer'

export function HeroExampleCarousel() {
  return (
    <YStack
      $gtLg={{
        ai: 'center',
      }}
    >
      <ContainerLarge position="relative">
        <YStack zi={1} space="$2">
          <H2 als="center">Truly flexible themes</H2>
          <H3 theme="alt2" als="center" fow="400">
            Unlimited sub-themes, down to the component.
          </H3>
        </YStack>
      </ContainerLarge>

      {/* <ScrollView horizontal showsHorizontalScrollIndicator={false}> */}
      <YStack mb={250}>
        {[{ name: null }, ...colorSchemes.slice(2, 5)].map(({ name }, index) => {
          return (
            <Theme key={name} name={name}>
              <XStack
                pos="relative"
                zi={100 - index}
                px="$6"
                mb={-250}
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
      </YStack>

      {/* </ScrollView> */}

      <ContainerLarge position="relative">
        <YStack ai="center" als="center" maxWidth={480} space="$2">
          {/* <H4 size="$8">Nest sub-themes infinitely</H4> */}

          <Paragraph mb="$3" ta="center" size="$6">
            Create a dark theme, give it a variety of dark <span className="rainbow">colors</span>.
            For&nbsp;each&nbsp;color, a <strong>stronger</strong> or more subtle tint. For each
            tint, a unique Button or Input theme.{' '}
            <Text fontStyle="italic">
              Unlimited nesting, with optional custom component themes at any level.
            </Text>
          </Paragraph>

          <Button theme="blue" tag="a">
            How themes work &raquo;
          </Button>
        </YStack>
      </ContainerLarge>
    </YStack>
  )
}

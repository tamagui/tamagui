import { FastForward, Pause, Rewind } from '@tamagui/feather-icons'
import React from 'react'
import { Button, Card, Image, Paragraph, Separator, Square, Theme, XStack, YStack } from 'tamagui'

export const MediaPlayer = ({ alt = 0 }: { alt?: number }) => {
  const themeName = alt ? (`alt${alt}` as any) : null
  const mainButtonTheme = `alt${alt + 2}` as any
  const barTheme = `alt${alt + 1}` as any

  return (
    <YStack>
      <Theme name={themeName}>
        <YStack pb="$6" pt="$4" px="$2">
          <Card flex={1} overflow="visible" bordered size="$6" pl={0} pr={0} pb={0} pt={0}>
            <YStack w="100%">
              <XStack ai="center" p="$3" space="$5">
                <Square br="$2" size="$12">
                  <Image w={150} h={150} src="http://placekitten.com/200/200" />
                </Square>

                <YStack jc="center" space="$0.5">
                  <Paragraph fontWeight="700">Spaceship</Paragraph>
                  <Paragraph>Kanye West??</Paragraph>
                  <Paragraph>College Dropout</Paragraph>
                </YStack>
              </XStack>

              <Separator />

              <Theme name={barTheme}>
                <XStack
                  w="100%"
                  px="$8"
                  bc="$background"
                  bbrr="$2"
                  bblr="$2"
                  ai="center"
                  p="$2"
                  space="$8"
                  jc="center"
                >
                  <Rewind />
                  <Button
                    // animation="spring"
                    theme={mainButtonTheme}
                    bordered
                    // bc="$background"
                    hoverStyle={{
                      elevation: '$6',
                      scale: 1.05,
                    }}
                    my="$-6"
                    icon={Pause}
                    scaleIcon={2}
                    circular
                    size="$8"
                    elevation="$4"
                  />
                  <FastForward />
                </XStack>
              </Theme>
            </YStack>
          </Card>
        </YStack>
      </Theme>
    </YStack>
  )
}

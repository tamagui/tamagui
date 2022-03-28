import { FastForward, Pause, Rewind } from '@tamagui/feather-icons'
import React, { memo } from 'react'
import {
  Button,
  Card,
  Image,
  Paragraph,
  Separator,
  Square,
  Theme,
  ThemeName,
  XStack,
  YStack,
} from 'tamagui'

export const MediaPlayer = memo(
  ({
    theme,
    alt: altProp,
    onHoverSection,
  }: {
    theme?: ThemeName
    alt?: number | null
    onHoverSection?: (name: string) => void
  }) => {
    const alt = altProp ?? 0
    const themeName = theme ?? (alt ? (`alt${alt}` as any) : null)
    const mainButtonTheme = theme ?? (`alt${alt + 2}` as any)
    const barTheme = theme ?? (`alt${alt + 1}` as any)

    return (
      <YStack>
        <Theme name={themeName}>
          <YStack>
            <Card flex={1} overflow="visible" bordered size="$6" pl={0} pr={0} pb={0} pt={0}>
              <YStack w="100%">
                <XStack ai="center" p="$3" space="$5">
                  <Square br="$6" size="$11">
                    <Image width={150} height={150} src="http://placekitten.com/200/200" />
                  </Square>

                  <YStack mt={-10} jc="center">
                    <Paragraph fontWeight="700">Spaceship</Paragraph>
                    <Paragraph theme={barTheme} size="$3">
                      Kanye West
                    </Paragraph>
                    <Paragraph theme={barTheme} size="$3">
                      College Dropout
                    </Paragraph>
                  </YStack>
                </XStack>

                <Separator />

                <Theme name={barTheme}>
                  <XStack
                    w="100%"
                    px="$8"
                    py="$2"
                    bc="$background"
                    bbrr="$2"
                    bblr="$2"
                    ai="center"
                    space="$7"
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
)

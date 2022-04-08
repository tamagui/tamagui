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

import image from '../public/tamagui-icon.png'

export const MediaPlayer = memo(
  ({
    theme,
    alt: altProp,
    onHoverSection,
    pointerEvents,
    pointerEventsControls,
  }: {
    theme?: ThemeName
    alt?: number | null
    onHoverSection?: (name: string) => void
    pointerEvents?: any
    pointerEventsControls?: any
  }) => {
    const alt = altProp ?? 0
    const themeName = theme ?? (alt ? (`alt${alt}` as any) : null)
    const barTheme = theme ?? (`alt${Math.min(4, alt + 1)}` as any)
    const mainButtonTheme = theme ?? (`alt${Math.min(4, alt + 2)}` as any)

    return (
      <Theme name={themeName}>
        <Card
          overflow="visible"
          bordered
          size="$6"
          pointerEvents={pointerEvents}
          pl={0}
          pr={0}
          pb={0}
          pt={0}
          ai="stretch"
        >
          <XStack ai="center" p="$3" space="$5">
            <Square br="$6" size="$11">
              <Image width={150} height={150} src={image.src} />
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
              pointerEvents={pointerEvents}
            >
              <Rewind />
              <Button
                theme={mainButtonTheme}
                bordered
                hoverStyle={{
                  elevation: '$6',
                  scale: 1.025,
                }}
                my="$-6"
                icon={Pause}
                size="$8"
                circular
                elevation="$4"
                pointerEvents={pointerEventsControls}
              />
              <FastForward />
            </XStack>
          </Theme>
        </Card>
      </Theme>
    )
  }
)

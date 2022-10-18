import { FastForward, Pause, Rewind } from '@tamagui/lucide-icons'
import React, { memo } from 'react'
import {
  Button,
  Card,
  CardProps,
  Image,
  Paragraph,
  Separator,
  Square,
  Theme,
  ThemeName,
  XStack,
  YStack,
} from 'tamagui'

import image from '../public/kanye.jpg'

export const MediaPlayer = memo(
  ({
    theme,
    alt,
    onHoverSection,
    pointerEvents,
    pointerEventsControls,
    ...cardProps
  }: CardProps & {
    alt?: number | null
    onHoverSection?: (name: string) => void
    pointerEventsControls?: any
  }) => {
    return (
      <Theme name={!alt ? null : (`alt${alt}` as ThemeName)}>
        <Card
          overflow="visible"
          bordered
          br="$7"
          pointerEvents={pointerEvents}
          p={0}
          ai="stretch"
          {...cardProps}
        >
          <XStack ai="center" p="$4" space="$5">
            <Square pos="relative" ov="hidden" br="$6" size={90}>
              <Image width={90} height={90} src={image.src} />
            </Square>

            <YStack miw={165} mt={-10} jc="center">
              <Paragraph fontWeight="700">Spaceship</Paragraph>
              <Paragraph color="$colorHover" size="$3">
                Kanye West
              </Paragraph>
              <Paragraph color="$colorHover" size="$3">
                College Dropout
              </Paragraph>
            </YStack>
          </XStack>

          <Separator mb={-1} />

          <XStack
            zi={1000}
            w="100%"
            px="$6"
            py="$4"
            bc="$backgroundHover"
            bbrr={17}
            bblr={17}
            ai="center"
            space="$5"
            jc="center"
            pointerEvents={pointerEvents}
          >
            <Rewind size={20} />
            <Button
              bordered
              hoverStyle={{
                elevation: '$6',
                scale: 1.025,
              }}
              my="$-7"
              icon={Pause}
              size="$8"
              circular
              elevation="$2"
              shac="rgba(0,0,0,0.12)"
              pointerEvents={pointerEventsControls}
            />
            <FastForward size={20} />
          </XStack>
        </Card>
      </Theme>
    )
  }
)

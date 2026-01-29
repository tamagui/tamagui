import { Image } from '@tamagui/image'
import { FastForward, Pause, Rewind } from '@tamagui/lucide-icons'
import { memo } from 'react'
import type { ThemeName, YStackProps } from 'tamagui'
import { Button, Paragraph, Separator, Square, Theme, XStack, YStack } from 'tamagui'

import image from './mj.jpg'

export const MediaPlayer = memo(
  (
    props: YStackProps & {
      alt?: number | null
      onHoverSection?: (name: string) => void
      pointerEventsControls?: any
    }
  ) => {
    const {
      theme,
      alt,
      onHoverSection,
      pointerEvents,
      pointerEventsControls,
      ...cardProps
    } = props
    const tint = !alt ? null : (`alt${alt}` as ThemeName)

    return (
      <YStack display="flex" items="stretch" contain="strict" minW={330} minH={222}>
        <Theme name={tint}>
          <YStack
            overflow="visible"
            borderWidth={1}
            borderColor="$borderColor"
            bg="$color1"
            rounded="$7"
            pointerEvents={pointerEvents}
            p={0}
            items="stretch"
            mb={40}
            {...cardProps}
          >
            <XStack items="center" p="$4" gap="$5">
              <Square position="relative" overflow="hidden" rounded="$6" size="$8">
                <Image src={image} width={90} height={90} />
              </Square>

              <YStack items="center" y={-3} minW={165} justify="center">
                <Paragraph fontWeight="700">Billie Jean</Paragraph>
                <Paragraph color="$color11" size="$3">
                  Michael Jackson
                </Paragraph>
                <Paragraph color="$color11" opacity={0.65} size="$3">
                  Thriller
                </Paragraph>
              </YStack>
            </XStack>

            <Separator mb={-1} />

            <XStack
              z={1000}
              width="100%"
              px="$6"
              py="$4"
              bg="$backgroundHover"
              borderBottomRightRadius={17}
              borderBottomLeftRadius={17}
              items="center"
              gap="$5"
              justify="center"
              pointerEvents={pointerEvents}
            >
              <Rewind size={20} />
              <Button
                variant="outlined"
                hoverStyle={{
                  elevation: '$6',
                  scale: 1.025,
                }}
                my="$-7"
                icon={Pause}
                size="$8"
                circular
                elevation="$2"
                aria-label="Pause"
                pointerEvents={pointerEventsControls}
              />
              <FastForward size={20} />
            </XStack>
          </YStack>
        </Theme>
      </YStack>
    )
  }
)

import { FastForward, Pause, Rewind } from '@tamagui/lucide-icons'
import { memo } from 'react'
import type { ThemeName, YStackProps } from 'tamagui'
import { Image } from '@tamagui/image-next'
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
      <YStack
        display="flex"
        alignItems="stretch"
        contain="strict"
        minWidth={330}
        minHeight={222}
      >
        <Theme name={tint}>
          <YStack
            overflow="visible"
            borderWidth={1}
            borderColor="$borderColor"
            backgroundColor="$color1"
            br="$7"
            pointerEvents={pointerEvents}
            p={0}
            ai="stretch"
            mb={40}
            {...cardProps}
          >
            <XStack ai="center" p="$4" space="$5">
              <Square pos="relative" ov="hidden" br="$6" size="$8">
                <Image src={image} width={90} height={90} />
              </Square>

              <YStack als="center" y={-3} miw={165} jc="center">
                <Paragraph fontWeight="700">Billie Jean</Paragraph>
                <Paragraph color="$color11" size="$3">
                  Michael Jackson
                </Paragraph>
                <Paragraph color="$color11" o={0.65} size="$3">
                  Thriller
                </Paragraph>
              </YStack>
            </XStack>

            <Separator mb={-1} />

            <XStack
              zi={1000}
              w="100%"
              px="$6"
              py="$4"
              bg="$backgroundHover"
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
                accessibilityLabel="Pause"
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

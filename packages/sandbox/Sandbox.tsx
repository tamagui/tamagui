import { Heart, Pause } from '@tamagui/feather-icons'
import React, { useState } from 'react'
import { useLayoutEffect } from 'react'
import { Button, Card, Image, Paragraph, Square, Theme, ThemeName, XStack, YStack } from 'tamagui'

import Tamagui from './tamagui.config'

const Scale = ({ between, ...props }: any) => {
  return props.children
  return React.cloneElement(props.children, {
    ...props,
  })
}

export const Sandbox = () => {
  return (
    <Tamagui.Provider injectCSS>
      <YStack space>
        <XStack>
          <Theme name="dark">
            <MediaPlayer subTheme={0} />
            <MediaPlayer subTheme={1} />
            <MediaPlayer subTheme={3} />
            <MediaPlayer subTheme={4} />
            <MediaPlayer subTheme={5} />
          </Theme>
        </XStack>
        <XStack>
          <Theme name="light">
            <MediaPlayer subTheme={0} />
            <MediaPlayer subTheme={1} />
            <MediaPlayer subTheme={3} />
            <MediaPlayer subTheme={4} />
            <MediaPlayer subTheme={5} />
          </Theme>
        </XStack>
      </YStack>
    </Tamagui.Provider>
  )
}

export const MediaPlayer = ({ subTheme }: { subTheme: number }) => {
  const str = subTheme
  const mainButtonTheme = `alt${str}`
  const barTheme = `alt${str + 1}`

  // alternatively have
  // <Scale.Container> for non-viewport usage

  return (
    <YStack bc="$bg2">
      <YStack p="$4">
        <Scale
          // could be `container` as well
          // is container="viewport" default?
          container="viewport"
          scaleProps={['size', 'space']}
          scaleBy={1}
          scaleOffset={{
            size: 2,
          }}
          scaleDirection="vertical"
        >
          <Card flex={1} overflow="visible" bordered size="$6" pl={0} pr={0} pb={0} pt={0}>
            <YStack w="100%" space="$5">
              <XStack ai="center" p="$4" space="$5">
                <Square br="$2" size="$12">
                  <Image w="150%" h="150%" src="http://placekitten.com/200/200" />
                </Square>

                <YStack jc="center" space="$1">
                  <Paragraph fontWeight="700">Spaceship</Paragraph>
                  <Paragraph>Kanye West</Paragraph>
                  <Paragraph>College Dropout</Paragraph>
                </YStack>

                {/* <Button als="asdsda" w="100">
                  hello
                </Button> */}
              </XStack>

              <Theme name={barTheme}>
                <XStack
                  borderTopWidth={1}
                  borderTopColor="$borderColor"
                  w="100%"
                  px="$8"
                  bc="$bg"
                  bbrr="$2"
                  bblr="$2"
                  ai="center"
                  p="$2"
                  space="$8"
                  jc="center"
                >
                  <Heart />
                  <Button
                    theme={mainButtonTheme}
                    bc="$bg"
                    // animation="spring"
                    bw={1}
                    my="$-6"
                    icon={Pause}
                    scaleIcon={2}
                    circular
                    size="$8"
                    elevation="$4"
                    hoverStyle={{
                      bc: '$bg2',
                      scale: 1.1,
                    }}
                  />
                  <Heart />
                </XStack>
              </Theme>
            </YStack>
          </Card>
        </Scale>
      </YStack>
    </YStack>
  )
}

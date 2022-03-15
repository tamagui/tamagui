import { FastForward, Pause, Rewind } from '@tamagui/feather-icons'
import React from 'react'
import { Button, Card, Image, Paragraph, Separator, Square, Theme, XStack, YStack } from 'tamagui'

import Tamagui from './tamagui.config'
import { colorNames } from './themes'

const blocks = Tamagui.getCSS().split('}\n')
console.groupCollapsed('CSS')
for (const block of blocks) {
  console.groupCollapsed(block.slice(0, block.indexOf('{')))
  console.log(block)
  console.groupEnd()
}
console.groupEnd()

const Scale = ({ between, ...props }: any) => {
  return props.children
  return React.cloneElement(props.children, {
    ...props,
  })
}

export const Sandbox = () => {
  // return (
  //   <Tamagui.Provider injectCSS>
  //     <Button>Hello</Button>
  //     <Button theme="blue">Hello</Button>
  //     <Button theme="red">Hello</Button>
  //     <Button theme="green">Hello</Button>
  //     <Button theme="dark">Hello</Button>
  //   </Tamagui.Provider>
  // )

  // return (
  //   <Tamagui.Provider injectCSS>
  //     <Theme name="blue">
  //       <XStack p="$4" space="$4">
  //         <Button debug bordered icon={Pause} circular size="$8" elevation="$4" />
  //         <YStack width={100} height={100} bc="$background" br="$10" elevation="$4" />
  //       </XStack>
  //     </Theme>
  //     {/* <Button theme="yellow" bordered icon={Pause} circular size="$8" elevation="$4" /> */}
  //   </Tamagui.Provider>
  // )

  const players = (
    <>
      <YStack>
        <XStack>
          <MediaPlayer />
          <MediaPlayer alt={1} />
          <MediaPlayer alt={2} />
          <MediaPlayer alt={3} />
          <MediaPlayer alt={4} />
        </XStack>
        {colorNames.map((name) => (
          <Theme key={name} name={name}>
            <XStack>
              <MediaPlayer />
              <MediaPlayer alt={1} />
              <MediaPlayer alt={2} />
              <MediaPlayer alt={3} />
              <MediaPlayer alt={4} />
            </XStack>
          </Theme>
        ))}
      </YStack>
    </>
  )

  return (
    <Tamagui.Provider injectCSS>
      <XStack>
        <Theme name="dark">{players}</Theme>
        <Theme name="light">{players}</Theme>
      </XStack>
    </Tamagui.Provider>
  )
}

export const MediaPlayer = ({ alt = 0 }: { alt?: number }) => {
  const themeName = alt ? (`alt${alt}` as any) : null
  const mainButtonTheme = `alt${alt}` as any
  const barTheme = `alt${alt + 1}` as any

  // alternatively have
  // <Scale.Container> for non-viewport usage

  return (
    <YStack bc="$background">
      <Theme name={themeName}>
        <YStack py="$6" px="$4">
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
              <YStack w="100%">
                <XStack ai="center" p="$3" space="$5">
                  <Square br="$2" size="$12">
                    <Image w="150%" h="150%" src="http://placekitten.com/200/200" />
                  </Square>

                  <YStack jc="center" space="$1">
                    <Paragraph fontWeight="700">Spaceship</Paragraph>
                    <Paragraph>Kanye West</Paragraph>
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
          </Scale>
        </YStack>
      </Theme>
    </YStack>
  )
}

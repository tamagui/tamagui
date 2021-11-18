// //! debug

// import React from 'react'
// import { H3, H4, Paragraph, Text, YStack, useMedia } from 'tamagui'

// export function Hero() {
//   return <H4 size="$1">Input</H4>
// }

import { ArrowRight, Check, Compass, Copy, Cpu, ExternalLink, Layers } from '@tamagui/feather-icons'
import copy from 'copy-to-clipboard'
import NextLink from 'next/link'
import React from 'react'
import { Button, H3, Paragraph, Spacer, Text, Theme, Title, Tooltip, XStack, YStack } from 'tamagui'

import { ContainerLarge } from './Container'
import { Header } from './Header'
import { IconStack } from './IconStack'

export function Hero() {
  const [hasCopied, setHasCopied] = React.useState(false)

  return (
    <>
      <Theme name="blue">
        <YStack backgroundColor="$bg">
          <Header />

          <ContainerLarge mb={-20}>
            <YStack space="$8" position="relative" pt="$6" $gtSm={{ pt: '$8' }}>
              <YStack space="$7">
                <YStack ai="flex-start" $gtSm={{ ai: 'center' }} space="$6">
                  <Title
                    size="$7"
                    letterSpacing={-1}
                    fontWeight="700"
                    $gtSm={{
                      // TODO $12 not working?
                      size: '$9',
                      px: 70,
                      ta: 'center',
                      my: -5,
                    }}
                    $gtMd={{
                      size: '$10',
                      px: 50,
                      my: -10,
                    }}
                  >
                    Universal React design systems that optimize for every platform
                    {/* <Tooltip contents="Web, iOS & Android">
              <span
                className="test-hero"
                style={{
                  textDecoration: 'underline',
                  textDecorationThickness: 3,
                  textDecorationColor: 'var(--blue7)',
                  textDecorationStyle: 'dotted',
                  cursor: 'help',
                  font: 'inherit',
                }}
              >

              </span>
            </Tooltip> */}
                  </Title>

                  <YStack
                    px={0}
                    maxWidth={550}
                    $gtSm={{
                      px: 50,
                      maxWidth: 900,
                    }}
                    $gtMd={{
                      px: 90,
                    }}
                  >
                    <Paragraph
                      color="$color"
                      opacity={0.7}
                      size="$5"
                      $gtSm={{
                        // TODO
                        size: '$6',
                        ta: 'center',
                      }}
                    >
                      React Native & Web interfaces with an optimizing compiler for themes, media
                      queries and&nbsp;typed&nbsp;inline styles — share&nbsp;more code, get better
                      performance.
                    </Paragraph>
                  </YStack>
                </YStack>

                <XStack jc="center" space>
                  <NextLink href="/docs/intro/introduction" passHref>
                    <Button
                      // TODO check why hoverStyle not overriding
                      // backgroundColor="$bg3"
                      // hoverStyle={{
                      //   backgroundColor: '$bg4',
                      // }}
                      textProps={{ fontWeight: '700' }}
                      borderRadius={1000}
                      iconAfter={<ArrowRight color="var(--color3)" size={12} />}
                      tag="a"
                    >
                      Documentation
                    </Button>
                  </NextLink>
                  <Button
                    chromeless
                    tag="a"
                    href="https://github.com/tamagui/tamagui"
                    target="_blank"
                    rel="noopener noreferrer"
                    borderRadius={1000}
                    iconAfter={
                      <ExternalLink
                        color="var(--color2)"
                        style={{ marginLeft: 4, opacity: 0.5 }}
                        size={12}
                      />
                    }
                  >
                    GitHub
                  </Button>
                </XStack>
              </YStack>

              <XStack
                borderWidth={1}
                borderColor="$borderColor"
                px="$5"
                height={48}
                ai="center"
                als="center"
                br="$6"
                backgroundColor="$bg2"
              >
                {/* TODO user defined constants + $mono */}
                <Paragraph color="$color" fontSize={14} fontFamily="$mono">
                  npm install tamagui
                </Paragraph>
                <YStack width={60} />
                <Tooltip contents="Copy to clipboard">
                  <Button
                    borderRadius="$8"
                    mr={-18}
                    // TODO broken in latest
                    icon={
                      hasCopied ? (
                        <Check size={16} color="var(--color2)" />
                      ) : (
                        <Copy size={16} color="var(--color2)" />
                      )
                    }
                    aria-label="Copy the install snippet to Clipboard"
                    onClick={() => {
                      copy('npm install tamagui')
                      setHasCopied(true)
                    }}
                  />
                </Tooltip>
              </XStack>
            </YStack>
          </ContainerLarge>
        </YStack>
      </Theme>

      <Spacer size="$9" />

      <ContainerLarge>
        <XStack
          flex={1}
          overflow="hidden"
          maxWidth="100%"
          space="$6"
          flexWrap="nowrap"
          $sm={{ flexDirection: 'column' }}
        >
          <YStack width="33%" $sm={{ width: 'auto' }} flexShrink={1}>
            <IconStack>
              <Cpu size={20} color="var(--blue9)" />
            </IconStack>
            <H3 size="$4" mb="$2">
              Performant
            </H3>
            <Paragraph size="$3" color="$color4">
              Compiles inline styles to atomic CSS, media query styles and hooks into CSS, and theme
              hooks & tokens into CSS variables, even with conditional logic.
            </Paragraph>
          </YStack>

          <YStack width="33%" $sm={{ width: 'auto' }} flexShrink={1}>
            <IconStack>
              <Compass size={20} color="var(--blue9)" />
            </IconStack>
            <H3 size="$4" mb="$2">
              Compatible
            </H3>
            <Paragraph size="$3" color="$color4">
              Augments{' '}
              <Text tag="a" href="http://google.com">
                react-native-web
              </Text>
              , reducing overhead for faster running apps. Build your own design system or use our
              lightweight component kit.
            </Paragraph>
          </YStack>

          <YStack width="33%" $sm={{ width: 'auto' }} flexShrink={1}>
            <IconStack>
              <Layers size={20} color="var(--blue9)" />
            </IconStack>
            <H3 size="$4" mb="$2">
              Intuitive
            </H3>
            <Paragraph size="$3" color="$color4">
              Supports the incredible DX advances in design systems of late: themes, tokens,
              shorthands, media queries, and typed inline styles that just work.
            </Paragraph>
          </YStack>

          {/* <YStack flexShrink={1}>
    <IconStack>
      <FastForward size={20} color="var(--blue9)" />
    </IconStack>
    <H3 mb="$2">Native</H3>
    <Paragraph size="$3" color="$color3">
      On the web Tamagui extracts styles to atomic CSS using CSS variables for themes and
      CSS media queries - even if you use hooks. On native, it extracts StyleSheet.
    </Paragraph>
  </YStack> */}
        </XStack>
      </ContainerLarge>

      <Spacer size="$4" />
    </>
  )
}

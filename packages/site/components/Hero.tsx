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
import {
  Button,
  GenericTamaguiConfig,
  H3,
  Paragraph,
  Shorthands,
  Spacer,
  TamaguiConfig,
  TamaguiCustomConfig,
  Text,
  Theme,
  Title,
  Tooltip,
  VisuallyHidden,
  XStack,
  YStack,
} from 'tamagui'

import { ContainerLarge } from './Container'
import { DiscordIcon } from './DiscordIcon'
import { GithubIcon } from './GithubIcon'
import { Header } from './Header'
import { IconStack } from './IconStack'

type y = Shorthands
type x = TamaguiConfig['shorthands']
type z = TamaguiCustomConfig['shorthands']

interface TamaguiConfigTest
  extends Omit<GenericTamaguiConfig, keyof TamaguiCustomConfig>,
    TamaguiCustomConfig {}

type a = TamaguiConfigTest['shorthands']

export function Hero() {
  const [hasCopied, setHasCopied] = React.useState(false)

  return (
    <>
      <Theme name="blue">
        <YStack backgroundColor="$bg" borderBottomWidth={0.5} borderColor="$borderColor">
          <Header />

          <ContainerLarge mb={-20}>
            <YStack space="$8" position="relative" pt="$6" $gtSm={{ pt: '$8' }}>
              <YStack
                $sm={{
                  maxWidth: 550,
                  mx: 'auto',
                }}
                space="$7"
              >
                <YStack ai="flex-start" $gtSm={{ ai: 'center' }} space="$5">
                  <Title
                    size="$10"
                    $gtSm={{
                      size: '$11',
                      ta: 'center',
                    }}
                    $gtMd={{
                      size: '$12',
                    }}
                  >
                    <Tooltip contents="Works the same on iOS, Android, and web">
                      <span className="rainbow help">Universal</span>
                    </Tooltip>{' '}
                    React design systems that optimize for native & web
                  </Title>

                  <YStack
                    px={0}
                    maxWidth={550}
                    $gtSm={{
                      px: 100,
                      maxWidth: 900,
                    }}
                    $gtMd={{
                      px: 90,
                    }}
                  >
                    <Paragraph
                      color="$color"
                      opacity={0.7}
                      size="$4"
                      letterSpacing={0}
                      $gtSm={{
                        ta: 'center',
                        size: '$5',
                        letterSpacing: 0,
                        fontWeight: '400',
                      }}
                      $gtMd={{
                        size: '$7',
                        fontWeight: '400',
                      }}
                    >
                      React Native + Web UIs much faster with an optimizing compiler.
                      Themes,&nbsp;media&nbsp;queries & typed inline styles that run better,
                      everywhere.
                    </Paragraph>
                  </YStack>
                </YStack>

                {/* <Theme name="purple"> */}
                <XStack ai="center" jc="center" space="$4">
                  <NextLink href="/docs/intro/introduction" passHref>
                    <Button
                      // theme="green"
                      // TODO check why hoverStyle not overriding
                      // backgroundColor="$bg3"
                      // hoverStyle={{
                      //   backgroundColor: '$bg4',
                      // }}
                      textProps={{ fontWeight: '700', color: '$color3' }}
                      borderRadius={1000}
                      iconAfter={<ArrowRight color="var(--color3)" size={12} />}
                      tag="a"
                    >
                      Documentation
                    </Button>
                  </NextLink>

                  <NextLink href="https://github.com/tamagui/tamagui" passHref>
                    <YStack opacity={0.65} hoverStyle={{ opacity: 1 }} tag="a" target="_blank">
                      <VisuallyHidden>
                        <Text>Github</Text>
                      </VisuallyHidden>
                      <GithubIcon width={23} />
                    </YStack>
                  </NextLink>

                  <NextLink
                    href="https://discord.gg/4qh6tdcVDa"
                    passHref
                    // css={{ mr: '$5', '@bp2': { mr: '$7' } }}
                  >
                    <YStack
                      $sm={{ height: 0, width: 0, overflow: 'hidden', mx: -18 }}
                      opacity={0.65}
                      hoverStyle={{ opacity: 1 }}
                      tag="a"
                      target="_blank"
                    >
                      <VisuallyHidden>
                        <Text>Discord</Text>
                      </VisuallyHidden>
                      <DiscordIcon plain width={23} />
                    </YStack>
                  </NextLink>
                </XStack>
                {/* </Theme> */}
              </YStack>

              <XStack
                borderWidth={1}
                borderColor="$borderColor2"
                px="$5"
                height={48}
                ai="center"
                als="center"
                br="$10"
                bc="$bg"
                hoverStyle={{
                  bc: '$bg2',
                }}
              >
                <Paragraph size="$5" fontWeight="500" fontFamily="$mono">
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
          space="$8"
          flexWrap="nowrap"
          px="$4"
          $sm={{ flexDirection: 'column' }}
        >
          <YStack width="33%" $sm={{ width: 'auto', maxWidth: 500, mx: 'auto' }} flexShrink={1}>
            <Theme name="purple">
              <IconStack>
                <Cpu size={20} color="var(--color3)" />
              </IconStack>
            </Theme>
            {/* TODO why weight is removed */}
            <H3 fontWeight="700" size="$5" mb="$2">
              Performant
            </H3>
            <Paragraph size="$4" color="$color3">
              Compile inline styles, media queries and themes to atomic CSS. Even conditional logic
              compiles away!
            </Paragraph>
          </YStack>

          <YStack width="33%" $sm={{ width: 'auto', maxWidth: 500, mx: 'auto' }} flexShrink={1}>
            <Theme name="green">
              <IconStack>
                <Compass size={20} color="var(--color3)" />
              </IconStack>
            </Theme>
            <H3 fontWeight="700" size="$5" mb="$2">
              Compatible
            </H3>
            <Paragraph size="$4" color="$color3">
              Augments{' '}
              <Text tag="a" href="https://necolas.github.io/react-native-web/">
                react-native-web
              </Text>{' '}
              and reduces overhead. Use it as a plain styling library, or an accessible component
              kit.
            </Paragraph>
          </YStack>

          <YStack width="33%" $sm={{ width: 'auto', maxWidth: 500, mx: 'auto' }} flexShrink={1}>
            <Theme name="pink">
              <IconStack>
                <Layers size={20} color="var(--color3)" />
              </IconStack>
            </Theme>
            <H3 fontWeight="700" size="$5" mb="$2">
              Intuitive
            </H3>
            <Paragraph size="$4" color="$color3">
              Supports DX advances in modern design systems: themes, tokens, shorthands, media
              queries, and typed inline styles.
            </Paragraph>
          </YStack>

          {/* <YStack flexShrink={1}>
    <IconStack>
      <FastForward size={20} color="var(--color2)" />
    </IconStack>
    <H3 mb="$2">Native</H3>
    <Paragraph size="$3" color="$color3">
      On the web Tamagui extracts styles to atomic CSS using CSS variables for themes and
      CSS media queries - even if you use hooks. On native, it extracts StyleSheet.
    </Paragraph>
  </YStack> */}
        </XStack>
      </ContainerLarge>
    </>
  )
}

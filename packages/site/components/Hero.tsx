// debug

// import React from 'react'
// import { H3, H4, Paragraph, Text, YStack, useMedia } from 'tamagui'

// export function Hero() {
//   return <H4 size="$1">Input</H4>
// }

import { ArrowRight } from '@tamagui/feather-icons'
import NextLink from 'next/link'
import { memo } from 'react'
import {
  Button,
  Paragraph,
  Spacer,
  Text,
  Theme,
  Title,
  Tooltip,
  VisuallyHidden,
  XStack,
  YStack,
} from 'tamagui'

import { useTint } from './ColorToggleButton'
import { ContainerLarge } from './Container'
import { DiscordIcon } from './DiscordIcon'
import { GithubIcon } from './GithubIcon'
import { Header } from './Header'

export function Hero() {
  const { tint } = useTint()

  return (
    <YStack pos="relative" borderBottomWidth={1} borderColor="$borderColor">
      <Theme name={tint}>
        <YStack fullscreen zi={0} className="hero-gradient-2" opacity={1} />
        <HeroTop />
      </Theme>
    </YStack>
  )
}

const HeroTop = memo(() => {
  return (
    <ContainerLarge pos="relative">
      <YStack
        className="bg-grid mask-gradient-up"
        fullscreen
        left={-1000}
        right={-1000}
        // top={302}
        opacity={0.3}
      />

      <Header />

      <YStack
        space="$6"
        position="relative"
        pt="$8"
        $sm={{
          maxWidth: 550,
          mx: 'auto',
        }}
      >
        <YStack ai="flex-start" $gtSm={{ ai: 'center' }} space="$5">
          <Title
            size="$9"
            $gtSm={{
              size: '$11',
              ta: 'center',
            }}
            $gtMd={{
              size: '$12',
              maxWidth: 900,
              mx: '$4',
            }}
          >
            <Tooltip contents="Works the same on iOS, Android, and web">
              <span className="rainbow clip-text help">Universal</span>
            </Tooltip>{' '}
            design systems for React&nbsp;Native&nbsp;&&nbsp;Web, faster.
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
              size="$5"
              letterSpacing={0}
              $gtSm={{
                ta: 'center',
                size: '$6',
                maxWidth: 600,
                letterSpacing: 0,
                fontWeight: '400',
              }}
              $gtMd={{
                size: '$8',
                maxWidth: 700,
                fontWeight: '400',
              }}
            >
              An optimizing compiler for 🔼 performance with 🔽 code.
              Write&nbsp;once,&nbsp;run&nbsp;everywhere - easy.
            </Paragraph>
          </YStack>
        </YStack>

        <XStack ai="center" jc="center" space="$2">
          <NextLink href="/docs/intro/introduction" passHref>
            <Button borderRadius={1000} iconAfter={ArrowRight} tag="a" fontWeight="800">
              Documentation
            </Button>
          </NextLink>

          <NextLink href="https://github.com/tamagui/tamagui" passHref>
            <YStack p="$2" opacity={0.65} hoverStyle={{ opacity: 1 }} tag="a" target="_blank">
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
              p="$2"
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
      </YStack>

      <Spacer size="$10" />
    </ContainerLarge>
  )
})

import { ArrowRight } from '@tamagui/feather-icons'
import { Link } from '@tamagui/unagi'
import React from 'react'
import { memo } from 'react'
import {
  Button,
  H1,
  Paragraph,
  Spacer,
  Text,
  VisuallyHidden,
  XStack,
  YStack,
  styled,
} from 'tamagui'

import { ContainerLarge } from '../Container.server'
import { Header } from '../Header.server'
import { DiscordIcon } from '../icons/DiscordIcon.server'
import { GithubIcon } from '../icons/GithubIcon.server'
import { TintTheme } from '../TintTheme.client'
import { HeroTagline } from './HeroTaglint.client'

export function Hero() {
  return (
    <YStack pos="relative" pe="auto">
      <TintTheme>
        <YStack fullscreen zi={0} className="hero-gradient-2" opacity={0.48} />
        <HeroTop />
      </TintTheme>
    </YStack>
  )
}

const HeroTop = memo(() => {
  return (
    <ContainerLarge className="okok" pos="relative">
      <YStack
        contain="strict"
        className="bg-grid mask-gradient-up"
        fullscreen
        top="auto"
        height={521}
        left={-1000}
        right={-1000}
        pe="none"
      />

      <Header />

      <YStack
        f={1}
        ov="hidden"
        space="$6"
        position="relative"
        pt="$12"
        mb="$11"
        $sm={{
          maxWidth: '100%',
          mx: 'auto',
        }}
      >
        <YStack ai="flex-start" $gtSm={{ ai: 'center' }} space="$5">
          <H1
            ta="left"
            size="$9"
            als="center"
            maw={500}
            $gtSm={{
              mx: 0,
              maxWidth: 800,
              size: '$11',
              ta: 'center',
            }}
            $gtMd={{
              maxWidth: 900,
              ta: 'center',
              size: '$12',
            }}
            $gtLg={{
              size: '$13',
              maxWidth: 1200,
            }}
          >
            <HeroTagline />
          </H1>

          <YStack
            px={0}
            maw={500}
            $gtMd={{
              px: 90,
              maw: 1000,
            }}
          >
            <Paragraph
              color="$gray10"
              size="$6"
              fontFamily="$silkscreen"
              ta="left"
              letterSpacing={-1.3}
              $gtSm={{
                ta: 'center',
                size: '$7',
                fontWeight: '400',
                maw: 650,
              }}
              $gtMd={{
                size: '$8',
                fontWeight: '400',
                maw: 650,
              }}
            >
              <span className="rainbow clip-text">Write&nbsp;once,&nbsp;run&nbsp;everywhere</span>{' '}
              without downsides thanks&nbsp;to&nbsp;an optimizing&nbsp;compiler.
            </Paragraph>
          </YStack>
        </YStack>

        <XStack ai="center" jc="center" space="$4">
          <Link to="/docs/intro/introduction">
            <Button
              accessibilityLabel="Get started (docs)"
              fontFamily="$silkscreen"
              iconAfter={ArrowRight}
              size="$5"
              borderRadius={1000}
              fontWeight="800"
              bordered
              bw={2}
              // @ts-ignore
              tabIndex={0}
            >
              Get started
            </Button>
          </Link>

          <Link to="https://github.com/tamagui/tamagui">
            <YStack p="$2" opacity={0.65} hoverStyle={{ opacity: 1 }} target="_blank">
              <VisuallyHidden>
                <Text>Github</Text>
              </VisuallyHidden>
              <GithubIcon width={23} />
            </YStack>
          </Link>

          <Link to="https://discord.gg/4qh6tdcVDa">
            <YStack
              p="$2"
              ml="$-2"
              $sm={{ height: 0, width: 0, overflow: 'hidden', mx: -18 }}
              opacity={0.65}
              hoverStyle={{ opacity: 1 }}
              target="_blank"
            >
              <VisuallyHidden>
                <Text>Discord</Text>
              </VisuallyHidden>
              <DiscordIcon plain width={23} />
            </YStack>
          </Link>
        </XStack>
      </YStack>

      <Spacer size="$9" />
    </ContainerLarge>
  )
})

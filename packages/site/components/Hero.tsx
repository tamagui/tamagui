import { ArrowRight } from '@tamagui/feather-icons'
import NextLink from 'next/link'
import { memo } from 'react'
import {
  Button,
  H1,
  Paragraph,
  Spacer,
  Text,
  Theme,
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
    <YStack pos="relative">
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
        className="bg-grid-big mask-gradient-up"
        fullscreen
        top="auto"
        height={500}
        left={-1000}
        right={-1000}
        opacity={0.6}
        pe="none"
      />

      <Header />

      <YStack
        f={1}
        ov="hidden"
        space="$6"
        position="relative"
        pt="$8"
        pb="$4"
        $sm={{
          maxWidth: '100%',
          mx: 'auto',
        }}
      >
        <YStack ai="flex-start" $gtSm={{ ai: 'center' }} space="$4">
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
            <Tooltip contents="Works the same on iOS, Android, and web">
              <span className="universal">
                <span className="rainbow clip-text help">Universal</span>
              </span>
            </Tooltip>{' '}
            design systems for React Native &&nbsp;Web, faster
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
              without downside thanks&nbsp;to&nbsp;an optimizing&nbsp;compiler.
            </Paragraph>
          </YStack>
        </YStack>

        <XStack ai="center" jc="center" space="$4">
          <NextLink href="/docs/intro/introduction" passHref>
            <Button
              fontFamily="$silkscreen"
              borderRadius={1000}
              iconAfter={ArrowRight}
              tag="a"
              size="$5"
              fontWeight="800"
            >
              Get started
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

          <NextLink href="https://discord.gg/4qh6tdcVDa" passHref>
            <YStack
              p="$2"
              ml="$-2"
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

      <Spacer size="$9" />
    </ContainerLarge>
  )
})

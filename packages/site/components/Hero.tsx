import { ArrowRight } from '@tamagui/feather-icons'
import NextLink from 'next/link'
import { memo } from 'react'
import {
  Button,
  Heading,
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
      {/* casuing hydration mismatch... */}
      {/* <img
        src={require('../public/tamaguy2.png').default.src}
        style={{
          position: 'absolute',
          bottom: -270,
          left: -10,
          transform: 'scale(0.125)',
          width: 544,
          height: 569,
        }}
      /> */}
      {/* <Image
        className="tamaguy"
        pos="absolute"
        bottom={-250}
        left={-50}
        // not merging at compile time right
        // x={-500}
        // y={200}
        scale={0.2}
        src={require('../public/tamaguy2.png').default.src}
        width={544}
        height={569}
      /> */}

      <YStack
        className="bg-grid mask-gradient-up"
        fullscreen
        top="auto"
        height={420}
        left={-1000}
        right={-1000}
        opacity={0.6}
        pe="none"
      />

      <Header />

      <YStack
        f={1}
        ov="hidden"
        space="$7"
        position="relative"
        pt="$8"
        $sm={{
          maxWidth: '100%',
          mx: 'auto',
        }}
      >
        <YStack ai="flex-start" $gtSm={{ ai: 'center' }} space="$4">
          <Heading
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
              <span className="universal">
                <span className="rainbow clip-text help">Universal</span>
              </span>
            </Tooltip>{' '}
            design systems for React&nbsp;Native &&nbsp;Web, faster
          </Heading>

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
              color="$gray10"
              size="$5"
              fontFamily="$silkscreen"
              letterSpacing={-1.5}
              $gtSm={{
                ta: 'center',
                size: '$6',
                fontWeight: '400',
                maw: 450,
              }}
              $gtMd={{
                size: '$7',
                fontWeight: '400',
                maw: 550,
              }}
            >
              <span className="rainbow clip-text">Write&nbsp;once,&nbsp;run&nbsp;everywhere</span>{' '}
              without downside thanks to an optimizing&nbsp;compiler.
            </Paragraph>
          </YStack>
        </YStack>

        <XStack ai="center" jc="center" space="$2">
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

      <Spacer size="$11" />
    </ContainerLarge>
  )
})

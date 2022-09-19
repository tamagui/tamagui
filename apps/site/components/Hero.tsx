import { ArrowRight } from '@tamagui/feather-icons'
import NextLink from 'next/link'
import { memo, useCallback } from 'react'
import {
  Button,
  ButtonText,
  H1,
  Paragraph,
  Spacer,
  Text,
  Theme,
  TooltipSimple,
  VisuallyHidden,
  XStack,
  YStack,
  styled,
} from 'tamagui'

import { ContainerLarge } from './Container'
import { DiscordIcon } from './DiscordIcon'
import { GithubIcon } from './GithubIcon'
import { Header } from './Header'
import { useHeroHovered } from './heroState'
import { useTint } from './useTint'

export const HeroGlow = () => {
  return <YStack o={0.4} zi={-1} pos="absolute" t={0} l={0} r={0} h={2000} className="hero-blur" />
}

export function Hero() {
  const { tint } = useTint()
  return (
    <Theme name={tint}>
      <YStack o={0.5} zi={-1} pos="absolute" t={0} l={0} r={0} h={2000} className="hero-blur" />
      <HeroTop />
    </Theme>
  )
}

const HeroTop = memo(() => {
  const [hovered, setHovered] = useHeroHovered()

  const spaceEl = <> + </>

  return (
    <ContainerLarge pos="relative">
      <YStack
        contain="strict"
        className="bg-grid mask-gradient-up"
        fullscreen
        top="auto"
        height={521}
        left={-1000}
        right={-1000}
        pe="none"
        o={0.1}
      />

      <Header />

      <YStack
        f={1}
        ov="hidden"
        space="$6"
        position="relative"
        pt="$13"
        mb="$10"
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
            // prevent layout shift
            $xxs={{
              h: 96,
            }}
            $gtXs={{
              h: 70,
            }}
            $gtSm={{
              h: 126,
              mx: 0,
              maxWidth: 800,
              size: '$11',
              ta: 'center',
            }}
            $gtMd={{
              h: 136,
              maxWidth: 900,
              ta: 'center',
              size: '$12',
            }}
            $gtLg={{
              h: 166,
              size: '$13',
              maxWidth: 1200,
            }}
          >
            <TooltipSimple label="Works the same on iOS, Android, and web">
              <span className="rainbow clip-text help">Universal</span>
            </TooltipSimple>{' '}
            design systems for React&nbsp;Native&nbsp;and&nbsp;Web
            <Text fontSize="inherit" ls="inherit" fontFamily="inherit" $sm={{ display: 'none' }}>
              , faster.
            </Text>
          </H1>

          <YStack
            px={0}
            maw="calc(100vw - 20px)"
            // prevent layout shift
            h={84}
            $gtMd={{
              h: 86,
              px: 90,
              maw: 1000,
            }}
          >
            <Paragraph
              color="$gray10"
              size="$6"
              fontFamily="$silkscreen"
              ta="left"
              $gtSm={{
                ta: 'center',
                size: '$8',
              }}
              $gtMd={{
                size: '$9',
              }}
            >
              UI faster on React Native + Web
              <br />
              <Tag color="$green10" onHoverIn={() => setHovered(0)} active={hovered === 0}>
                styles
              </Tag>
              {spaceEl}
              <Tag color="$blue10" onHoverIn={() => setHovered(1)} active={hovered === 1}>
                Components
              </Tag>
              {spaceEl}
              <Tag color="$purple10" onHoverIn={() => setHovered(2)} active={hovered === 2}>
                compiler
              </Tag>
            </Paragraph>
          </YStack>
        </YStack>

        <XStack ai="center" jc="center" space="$4">
          <NextLink prefetch={false} href="/docs/intro/introduction" passHref>
            <Button
              accessibilityLabel="Get started (docs)"
              fontFamily="$silkscreen"
              iconAfter={ArrowRight}
              tag="a"
              size="$6"
              borderRadius={1000}
              fontWeight="800"
              bordered
              bw={2}
              // @ts-ignore
              tabIndex={0}
            >
              <ButtonText fontFamily="$silkscreen" size="$7">
                Start
              </ButtonText>
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

const Tag = styled(Text, {
  className: 'hero-tag',
  fontFamily: 'inherit',
  fontSize: 'inherit',
  cursor: 'default',

  hoverStyle: {
    color: '$color',
  },

  variants: {
    active: {
      true: {
        color: '$color',
      },
    },
  },
})

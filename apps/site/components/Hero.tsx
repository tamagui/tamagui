import NextLink from 'next/link'
import { memo } from 'react'
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
  getTokens,
  styled,
} from 'tamagui'

import { ContainerLarge } from './Container'
import { DiscordIcon } from './DiscordIcon'
import { GithubIcon } from './GithubIcon'
import { Header } from './Header'
import { useHeroHovered } from './heroState'
import { useTint } from './useTint'

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
        o={0.08}
      />
      <YStack
        f={1}
        ov="hidden"
        space="$6"
        position="relative"
        pt="$13"
        mb="$8"
        $sm={{
          maxWidth: '100%',
          mx: 'auto',
        }}
      >
        <YStack ai="flex-start" $gtSm={{ ai: 'center' }} space="$2">
          <H1
            ta="left"
            size="$10"
            maw={500}
            h={130}
            // FOR CLS IMPORTANT TO SET EXACT HEIGHT IDK WHY LINE HEIGHT SHOULD BE STABLE
            $gtSm={{
              mx: 0,
              maxWidth: 800,
              size: '$13',
              h: 190,
              ta: 'center',
              als: 'center',
            }}
            $gtMd={{
              maxWidth: 900,
              size: '$14',
              h: 240,
            }}
            $gtLg={{
              size: '$16',
              lh: '$15',
              maxWidth: 1200,
              h: 290,
            }}
          >
            <span className="rainbow clip-text">Write less,</span>
            <br />
            runs&nbsp;faster.
          </H1>

          <YStack
            px={0}
            maw={420}
            // prevent layout shift
            h={70}
            $gtSm={{
              maw: 500,
            }}
            $gtMd={{
              h: 90,
              px: 90,
              maw: 700,
            }}
            $gtLg={{
              maw: 900,
            }}
          >
            <Subtitle>
              <NextLink legacyBehavior href="/docs/core/configuration" passHref>
                <Tag
                  tag="a"
                  theme="green_alt2"
                  bc="$color3"
                  onHoverIn={() => setHovered(0)}
                  active={hovered === 0}
                >
                  styles
                </Tag>
              </NextLink>
              ,{' '}
              <NextLink legacyBehavior href="/docs/intro/compiler" passHref>
                <Tag
                  tag="a"
                  theme="blue_alt2"
                  bc="$color3"
                  onHoverIn={() => setHovered(1)}
                  active={hovered === 1}
                >
                  optimizing compiler
                </Tag>
              </NextLink>{' '}
              &{' '}
              <NextLink legacyBehavior href="/docs/components/stacks" passHref>
                <Tag
                  tag="a"
                  theme="purple_alt2"
                  bc="$color3"
                  onHoverIn={() => setHovered(2)}
                  active={hovered === 2}
                >
                  UI&nbsp;kit
                </Tag>
              </NextLink>{' '}
              that&nbsp;unify&nbsp;React Native + Web
            </Subtitle>
          </YStack>
        </YStack>

        <XStack ai="center" jc="center" $xxs={{ ai: 'center', fw: 'wrap' }}>
          <NextLink legacyBehavior href="https://github.com/tamagui/tamagui" passHref>
            <YStack
              p="$6"
              $sm={{ p: '$3' }}
              opacity={0.65}
              hoverStyle={{ opacity: 1 }}
              tag="a"
              target="_blank"
            >
              <VisuallyHidden>
                <Text>Github</Text>
              </VisuallyHidden>
              <GithubIcon width={23} />
            </YStack>
          </NextLink>

          <XStack
            ai="center"
            jc="center"
            space="$2"
            $xxs={{
              // words web-only
              // @ts-ignore
              order: '-1',
              mx: '50%',
            }}
          >
            <NextLink legacyBehavior prefetch={false} href="/docs/intro/compiler" passHref>
              <Button
                accessibilityLabel="Get started (docs)"
                fontFamily="$silkscreen"
                tag="a"
                size="$5"
                borderRadius={1000}
                fontWeight="800"
                bordered
                bw={2}
                mx="$2"
                // @ts-ignore
                tabIndex={0}
                elevation="$2"
                pressStyle={{
                  elevation: '$0',
                }}
              >
                <ButtonText fontFamily="$silkscreen" size="$7">
                  How?
                </ButtonText>
              </Button>
            </NextLink>

            <NextLink legacyBehavior prefetch={false} href="/docs/intro/introduction" passHref>
              <Button
                accessibilityLabel="Get started (docs)"
                fontFamily="$silkscreen"
                tag="a"
                size="$5"
                borderRadius={1000}
                fontWeight="800"
                bordered
                bw={2}
                mx="$2"
                // @ts-ignore
                tabIndex={0}
                elevation="$2"
                pressStyle={{
                  elevation: '$0',
                }}
              >
                <ButtonText fontFamily="$silkscreen" size="$7">
                  Docs
                </ButtonText>
              </Button>
            </NextLink>
          </XStack>

          <NextLink legacyBehavior href="https://discord.gg/4qh6tdcVDa" passHref>
            <YStack
              p="$6"
              $sm={{ p: '$3' }}
              ml="$-2"
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

      <Spacer size="$7" />
    </ContainerLarge>
  )
})

const Subtitle = styled(Paragraph, {
  color: '$gray10',
  size: '$6',
  fontFamily: '$silkscreen',
  className: 'font-smooth',
  ta: 'left',
  ls: -1,

  $gtSm: {
    ta: 'center',
    size: '$7',
  },

  $gtMd: {
    size: '$8',
  },

  $gtLg: {
    size: '$9',
    lh: 50,
  },
})

const Tag = styled(Text, {
  className: 'hero-tag text-decoration-none',
  fontFamily: 'inherit',
  fontSize: 'inherit',
  borderRadius: '$2',
  px: '$1',
  mx: '$-1',
  cursor: 'pointer',
  color: '$color10',
  backgroundColor: '$color5',

  hoverStyle: {
    color: '$color',
    backgroundColor: '$color5',
  },

  variants: {
    active: {
      true: {
        color: '$color10',
      },
    },
  },
})

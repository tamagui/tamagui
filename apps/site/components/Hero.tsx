import { default as Link, default as NextLink } from 'next/link'
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
            size="$10"
            als="center"
            maw={500}
            $gtSm={{
              mx: 0,
              maxWidth: 800,
              size: '$12',
              ta: 'center',
            }}
            $gtMd={{
              maxWidth: 900,
              ta: 'center',
              size: '$14',
            }}
            $gtLg={{
              size: '$16',
              maxWidth: 1200,
            }}
          >
            <span className="rainbow clip-text">Write less,</span>
            <br />
            runs&nbsp;faster.
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
              className="font-smooth"
              ta="left"
              $sm={{
                ls: -1,
              }}
              $gtSm={{
                ta: 'center',
                size: '$8',
              }}
              $gtMd={{
                size: '$9',
              }}
            >
              Universal UI for React Native / Web
              <br />
              <Spacer size="$2" />
              <Link href="/docs/core/configuration" passHref>
                <Tag
                  tag="a"
                  theme="green_alt2"
                  bc="$color3"
                  onHoverIn={() => setHovered(0)}
                  active={hovered === 0}
                >
                  styles
                </Tag>
              </Link>
              {spaceEl}
              <Link href="/docs/components/stacks" passHref>
                <Tag
                  tag="a"
                  theme="blue_alt2"
                  bc="$color3"
                  onHoverIn={() => setHovered(1)}
                  active={hovered === 1}
                >
                  Components
                </Tag>
              </Link>
              {spaceEl}
              <Link href="/docs/intro/compiler" passHref>
                <Tag
                  tag="a"
                  theme="purple_alt2"
                  bc="$color3"
                  onHoverIn={() => setHovered(2)}
                  active={hovered === 2}
                >
                  compiler
                </Tag>
              </Link>
            </Paragraph>
          </YStack>
        </YStack>

        <XStack ai="center" jc="center" space="$2" $xxs={{ ai: 'center', fw: 'wrap' }}>
          <NextLink href="https://github.com/tamagui/tamagui" passHref>
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
            <NextLink prefetch={false} href="/docs/intro/compiler" passHref>
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

            <NextLink prefetch={false} href="/docs/intro/introduction" passHref>
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

          <NextLink href="https://discord.gg/4qh6tdcVDa" passHref>
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

const Tag = styled(Text, {
  className: 'hero-tag text-decoration-none',
  fontFamily: 'inherit',
  fontSize: 'inherit',
  cursor: 'default',
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

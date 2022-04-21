import Link from 'next/link'
import {
  Button,
  Card,
  FontSizeTokens,
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
  Paragraph,
  Separator,
  XStack,
  YStack,
} from 'tamagui'

import { useTint } from './ColorToggleButton'
import { ContainerLarge } from './Container'
import { HomeH2, HomeH3 } from './HomeH2'

export const HeroTypography = () => {
  return (
    <>
      <YStack fullscreen className="bg-grid mask-gradient-both" o={0.5} />
      {/* <YStack theme="alt2" fullscreen className="hero-gradient-white mask-gradient-down" /> */}
      <ContainerLarge position="relative" space="$8">
        <YStack ai="center" space="$2">
          <HomeH2>Typography, easy.</HomeH2>
          <HomeH3>Plug-and-play fonts, individually tuned.</HomeH3>
        </YStack>

        <XStack
          ai="center"
          jc="center"
          pos="relative"
          space="$8"
          flexDirection="row-reverse"
          $sm={{
            flexDirection: 'row',
          }}
        >
          <OverlayCard />

          <YStack className="rainbow clip-text ta-right" display="block" zi={-1} space="$0.5">
            <H1>Hot-swappable</H1>
            <H2>individually-styled</H2>
            <H3>typed and optimized</H3>
            <H4>premade or custom</H4>
            <H5>easy to author</H5>
            <H6>font themes</H6>
          </YStack>
        </XStack>
      </ContainerLarge>
    </>
  )
}

const OverlayCard = () => {
  const { tint } = useTint()

  // {/* TODO elevation not overriding? */}
  return (
    <Card bw={1} boc="$borderColor" br="$6" elevation="$6" shadowRadius={60}>
      <YStack jc="center" p="$6" space="$4" maw="calc(min(90vw, 400px))">
        <Paragraph ta="left" size="$8" fow="400" maw="75%">
          Every font prop,
          <br /> tuned to each size.
        </Paragraph>

        <Paragraph ta="left" size="$5" theme="alt2">
          Each font family can define independent styles for everything from weight to spacing,
          unique to each font size.
        </Paragraph>

        <Paragraph ta="left" size="$5" theme="alt2">
          This enables fully-typed, shareable fonts as easy as an npm install.
        </Paragraph>

        <Link href="/docs/intro/configuration" passHref>
          <Button fontFamily="$silkscreen" tag="a" als="flex-end" theme={tint}>
            Learn more &raquo;
          </Button>
        </Link>
      </YStack>
    </Card>
  )
}

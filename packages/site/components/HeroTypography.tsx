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
      <YStack fullscreen className="bg-grid mask-gradient-both" o={0.25} />
      {/* <YStack theme="alt2" fullscreen className="hero-gradient-white mask-gradient-down" /> */}
      <ContainerLarge position="relative" space="$8">
        <YStack ai="center" space="$2">
          <HomeH2>
            <span className="rainbow clip-text">Typography</span> (easier)
          </HomeH2>
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

          <YStack ai="flex-end" scale={1.2} zi={-1} x={-40}>
            <H1 theme="blue_alt2">Hot-swappable</H1>
            <H2 theme="purple_alt2">individually-styled</H2>
            <H3 theme="pink_alt2">typed and optimized</H3>
            <H4 theme="red_alt2">premade or custom</H4>
            <H5 theme="orange_alt2">easy to author</H5>
            <H6 theme="yellow_alt2">font themes</H6>
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
        <Paragraph ta="left" size="$8" fow="400">
          Typed fonts,
          <br />
          Vertical rythyms,
          <br />
          Custom styles per-size.
        </Paragraph>

        <Paragraph ta="left" size="$5" theme="alt2">
          Each font family can be styled fully independently with unique styles per-size, including
          line-height.
        </Paragraph>

        <Paragraph ta="left" size="$5" theme="alt2">
          This enables fully-typed font packages that are easy as npm install.
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

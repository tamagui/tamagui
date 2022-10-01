import { ChevronRight, Code, Cpu, Layers } from '@tamagui/feather-icons'
import Link from 'next/link'
import { memo, useEffect, useState } from 'react'
import { useWindowDimensions } from 'react-native'
import { H3, Paragraph, XStack, YStack, YStackProps } from 'tamagui'

import { CodeInline } from './Code'
import { ContainerLarge } from './Container'
import { useHeroHovered } from './heroState'
import { IconStack } from './IconStack'
import { useTintSectionIndex } from './TintSection'
import { ThemeTint, useTint } from './useTint'

const TitleLink = ({ href, children, ...props }: any) => {
  return (
    <Link passHref href={href}>
      <H3 cursor="pointer" tag="a" color="$color" size="$6" my="$3">
        <CodeInline
          cursor="pointer"
          fontFamily="$silkscreen"
          bc="$color2"
          hoverStyle={{
            backgroundColor: '$color3',
          }}
          size="$7"
          {...props}
        >
          {children} <ChevronRight size={12} />
        </CodeInline>
      </H3>
    </Link>
  )
}

export const HeroBelow = memo(() => {
  const [top, setTop] = useState(0)

  return (
    <>
      <Glow top={top} />
      <YStack pos="relative" zi={1000} elevation="$1" py="$9" pb="$10">
        <ThemeTint>
          <YStack
            onLayout={(event) => {
              setTop(event.nativeEvent.layout.y - event.nativeEvent.layout.height)
            }}
            fullscreen
            bc="$color3"
            zi={-1}
            o={0.33}
          />
          <HeroBelowContent />
        </ThemeTint>
      </YStack>
    </>
  )
})

const Glow = ({ top }: { top: number }) => {
  const { tint } = useTint()
  const isHeroBelowColor = tint === 'blue' || tint === 'green' || tint === 'purple'
  const [index, setIndex] = useState(0)
  const isAtTop = index <= 1
  const isOnHeroBelow = isAtTop && isHeroBelowColor
  const [scrollTop, setScrollTop] = useState(0)
  const windowWidth = useWindowDimensions().width
  const xs = Math.min(400, windowWidth * 0.25)

  useEffect(() => {
    if (typeof document === 'undefined') return
    const next = document.documentElement?.scrollTop ?? 0
    setScrollTop(next + 100)
  }, [index])

  useTintSectionIndex(setIndex)

  const scale = isOnHeroBelow ? 0.5 : 1

  return (
    <YStack
      pos="absolute"
      t={0}
      l={0}
      pe="none"
      animation="lazy"
      key={0}
      zi={-1}
      x={0}
      y={scrollTop}
      {...(isOnHeroBelow && {
        animation: 'quick',
        x: tint === 'green' ? -xs : tint === 'purple' ? xs : 0,
        y: top - 70,
      })}
    >
      <YStack
        overflow="hidden"
        h="100vh"
        w={1200}
        theme={tint}
        o={0.5}
        fullscreen
        left="calc(50vw - 600px)"
        scale={scale}
        className="hero-blur"
      />
    </YStack>
  )
}

export const HeroBelowContent = memo(() => {
  const [hovered, setHovered] = useHeroHovered()

  return (
    <ContainerLarge>
      <XStack
        flex={1}
        overflow="hidden"
        maxWidth="100%"
        space="$8"
        flexWrap="nowrap"
        px="$2"
        mb={-8}
        py="$2"
        $sm={{ flexDirection: 'column' }}
      >
        <Section onHoverIn={() => setHovered(0)}>
          <IconStack o={hovered === 0 ? 1 : 0.5} theme="green_alt2">
            <Code size={20} color="var(--colorHover)" />
          </IconStack>
          <TitleLink theme="green_alt2" href="/docs/core/configuration">
            Core
          </TitleLink>
          <Paragraph o={hovered === 0 ? 1 : 0.75} size="$4" theme="green_alt2">
            A lightweight design-system library for React Native & Web with tokens, themes, fonts
            and more + a nice typed <CodeInline>styled</CodeInline> utility.
          </Paragraph>
        </Section>

        <Section onHoverIn={() => setHovered(1)}>
          <IconStack o={hovered === 1 ? 1 : 0.5} theme="blue_alt2">
            <Layers size={20} color="var(--colorHover)" />
          </IconStack>
          <TitleLink theme="blue_alt2" href="/docs/components/stacks">
            Tamagui
          </TitleLink>
          <Paragraph o={hovered === 1 ? 1 : 0.75} size="$4" theme="blue_alt2">
            UI kit that adapts to native and web, built using Core. Composable component APIs,
            consistent size props, nested themes, and more.
          </Paragraph>
        </Section>

        <Section onHoverIn={() => setHovered(2)}>
          <IconStack o={hovered === 2 ? 1 : 0.5} theme="purple_alt2">
            <Cpu size={20} color="var(--colorHover)" />
          </IconStack>
          <TitleLink theme="purple_alt2" href="/docs/intro/compiler">
            Static
          </TitleLink>
          <Paragraph o={hovered === 2 ? 1 : 0.75} size="$4" theme="purple_alt2">
            An optimizing compiler for styles both static and inline. Partial evaluation, tree
            flattening & more. Plugins for Next, Webpack, Vite, Metro.
          </Paragraph>
        </Section>
      </XStack>
    </ContainerLarge>
  )
})

const Section = (props: YStackProps) => (
  <YStack
    width="33%"
    $sm={{ width: 'auto', maxWidth: 500, mx: 'auto' }}
    flexShrink={1}
    {...props}
  />
)

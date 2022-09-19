import { ChevronRight, Code, Compass, Cpu, Layers } from '@tamagui/feather-icons'
import Link from 'next/link'
import React from 'react'
import { memo } from 'react'
import { H3, Paragraph, Theme, XStack, YStack, YStackProps, getTokens, styled } from 'tamagui'

import { CodeInline } from './Code'
import { ContainerLarge } from './Container'
import { useHeroHovered } from './heroState'
import { IconStack } from './IconStack'
import { useTint } from './useTint'

const TitleLink = ({ href, children }: { children: any; href: string }) => {
  return (
    <Link passHref href={href}>
      <H3 cursor="pointer" tag="a" fontFamily="$mono" color="$color" size="$6" my="$5">
        <CodeInline
          cursor="pointer"
          hoverStyle={{
            backgroundColor: '$backgroundStrong',
          }}
          size="$7"
        >
          {children} <ChevronRight size={12} />
        </CodeInline>
      </H3>
    </Link>
  )
}

export const HeroBelow = memo(() => {
  const { tint } = useTint()

  return (
    <Theme name={tint}>
      <HeroBelowContent />
    </Theme>
  )
})

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
        py="$4"
        $sm={{ flexDirection: 'column' }}
      >
        <Section onHoverIn={() => setHovered(0)}>
          <IconStack o={hovered === 0 ? 1 : 0.5} theme="pink_alt2">
            <Code size={20} color="var(--colorHover)" />
          </IconStack>
          <TitleLink href="/docs/core/configuration">Core</TitleLink>
          <Paragraph o={hovered === 0 ? 1 : 0.75} size="$4" theme="alt1">
            A lightweight design-system library for React Native (and Web) that takes tokens,
            themes, fonts and more and gives you a typed <CodeInline>styled</CodeInline>
            function with all sorts of goodies.
          </Paragraph>
        </Section>

        <Section onHoverIn={() => setHovered(1)}>
          <IconStack o={hovered === 1 ? 1 : 0.5} theme="purple_alt2">
            <Layers size={20} color="var(--colorHover)" />
          </IconStack>
          <TitleLink href="/docs/components/stacks">Tamagui</TitleLink>
          <Paragraph o={hovered === 1 ? 1 : 0.75} size="$4" theme="alt1">
            A large universal UI kit built on top of Core with a complete set of composable
            components, size scaling, themes, and more.
          </Paragraph>
        </Section>

        <Section onHoverIn={() => setHovered(2)}>
          <IconStack o={hovered === 2 ? 1 : 0.5} theme="green_alt2">
            <Cpu size={20} color="var(--colorHover)" />
          </IconStack>
          <TitleLink href="/docs/intro/benchmarks">Static</TitleLink>
          <Paragraph o={hovered === 2 ? 1 : 0.75} size="$4" theme="alt1">
            Plugs into many Webpack, Vite, Metro and more to compile-time optimize styles and take
            work out of render functions using partial evaluation and tree flattening.
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

const x = <Section />

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

const TitleLink = ({ href, children, ...props }: { children: any; href: string }) => {
  return (
    <Link passHref href={href}>
      <H3 cursor="pointer" tag="a" color="$color" size="$6" my="$5">
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
          <TitleLink theme="purple_alt2" href="/docs/intro/benchmarks">
            Static
          </TitleLink>
          <Paragraph o={hovered === 2 ? 1 : 0.75} size="$4" theme="purple_alt2">
            Compile-time optimize styles both static and inline, with partial evaluation and tree
            flattening. Plugins for Webpack, Vite, Metro & more.
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

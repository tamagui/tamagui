import { ChevronRight, Code, Cpu, Layers } from '@tamagui/feather-icons'
import Link from 'next/link'
import { memo, useEffect } from 'react'
import { H3, Paragraph, XStack, YStack, YStackProps } from 'tamagui'

import { CodeInline } from './Code'
import { ContainerLarge } from './Container'
import { useHeroHovered } from './heroState'
import { IconStack } from './IconStack'
import { ThemeTint } from './useTint'

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

export const HeroBelow = memo((props: any) => {
  return (
    <>
      <YStack pos="relative" zi={1000} elevation="$1" py="$9" pb="$10">
        <ThemeTint>
          <YStack
            onLayout={(event) => {
              props.onChangeTop(event.nativeEvent.layout.y - event.nativeEvent.layout.height)
            }}
            fullscreen
            bc="$color3"
            className="all linear s1"
            zi={-1}
            o={0.33}
          />
          <HeroBelowContent />
        </ThemeTint>
      </YStack>
    </>
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
            A lightweight style + design system library for React Native & Web. Themes, responsive
            styles, <CodeInline>styled</CodeInline> with variants and a host of features.
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
            Large UI kit built using Core. All the base views for apps, with composable
            component-first APIs, size variance, incredible themes, platform optimized.
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

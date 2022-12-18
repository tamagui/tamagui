import { ChevronRight, Code, Cpu, Layers } from '@tamagui/lucide-icons'
import NextLink from 'next/link'
import { memo, useEffect, useRef } from 'react'
import { H3, Paragraph, XStack, YStack, YStackProps, debounce } from 'tamagui'

import { CodeInline } from './Code'
import { ContainerLarge } from './Container'
import { useHeroHovered } from './heroState'
import { IconStack } from './IconStack'
import { ThemeTint } from './useTint'

const TitleLink = ({ href, children, ...props }: any) => {
  return (
    <NextLink legacyBehavior passHref href={href}>
      <H3 cursor="pointer" tag="a" color="$color" size="$6" my="$3">
        <CodeInline
          cursor="pointer"
          fontFamily="$silkscreen"
          bc="$color2"
          hoverStyle={{
            backgroundColor: '$color3',
          }}
          size="$9"
          fontSize="$7"
          ls={0}
          {...props}
        >
          {children} <ChevronRight size={12} />
        </CodeInline>
      </H3>
    </NextLink>
  )
}

export const HeroBelow = memo(() => {
  return (
    <>
      <YStack pos="relative" zi={1000} elevation="$1" py="$9" pb="$10">
        <ThemeTint>
          <YStack fullscreen bc="$color3" zi={-1} o={0.33} />
          <HeroBelowContent />
        </ThemeTint>
      </YStack>
    </>
  )
})

export const HeroBelowContent = memo(() => {
  const [hovered, setHovered] = useHeroHovered()

  const greenTheme = hovered === 0 ? 'green_alt2' : 'green'
  const purpleTheme = hovered === 1 ? 'purple_alt2' : 'purple'
  const blueTheme = hovered === 2 ? 'blue_alt2' : 'blue'

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
        $gtSm={{
          px: '$6',
        }}
      >
        <Section theme={greenTheme} onHoverIn={() => setHovered(0)}>
          <IconStack>
            <Code size={20} color="var(--colorHover)" />
          </IconStack>
          <TitleLink href="/docs/core/configuration">Core</TitleLink>
          <Paragraph size="$4">
            A lightweight style + design system library for React Native & Web. Themes, responsive
            styles, <CodeInline>styled()</CodeInline> with variants and a host of features.
          </Paragraph>
        </Section>

        <Section theme={purpleTheme} onHoverIn={() => setHovered(1)}>
          <IconStack>
            <Cpu size={20} color="var(--colorHover)" />
          </IconStack>
          <TitleLink href="/docs/intro/compiler">Static</TitleLink>
          <Paragraph size="$4">
            An <CodeInline>optimizing compiler</CodeInline> for styles both static and inline.
            Partial evaluation, tree flattening & more. Plugins for Next, Webpack, Vite, Metro.
          </Paragraph>
        </Section>

        <Section theme={blueTheme} onHoverIn={() => setHovered(2)}>
          <IconStack>
            <Layers size={20} color="var(--colorHover)" />
          </IconStack>
          <TitleLink href="/docs/components/stacks">Tamagui</TitleLink>
          <Paragraph size="$4">
            A complete <CodeInline>suite of UI components</CodeInline> built using Core. Composable
            component APIs, size variance, incredible themes, platform optimized.
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

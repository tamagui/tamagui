import { ChevronRight, Code, Cpu, Layers, Star } from '@tamagui/lucide-icons'
import { NextLink } from 'components/NextLink'
import Link from 'next/link'
import { memo } from 'react'
import { Button, H3, Paragraph, Theme, XStack, YStack, YStackProps } from 'tamagui'

import { CodeInline } from './Code'
import { ContainerLarge } from './Container'
import { GithubIcon } from './GithubIcon'
import { useHeroHovered } from './heroState'
import { IconStack } from './IconStack'

const TitleLink = ({ href, children, ...props }: any) => {
  return (
    <NextLink prefetch={false} href={href}>
      <H3 cursor="pointer" color="$color" my="$2">
        <CodeInline
          cursor="pointer"
          fontFamily="$silkscreen"
          bc="$color2"
          hoverStyle={{
            backgroundColor: '$color3',
          }}
          size="$10"
          fontSize="$8"
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
      <YStack
        pos="relative"
        zi={1000}
        elevation="$4"
        // $theme-light={{
        //   elevation: '$1',
        // }}
        py="$4"
        pt="$6"
        pb="$10"
      >
        <YStack fullscreen bc="$color3" zi={-1} o={0.25} btw={1} btc="$borderColor" />

        <HeroBelowContent />
      </YStack>
    </>
  )
})

export const HeroBelowContent = memo(() => {
  const [hovered, setHovered] = useHeroHovered()

  const greenTheme = hovered === 0 ? 'green_alt1' : 'green'
  const blueTheme = hovered === 1 ? 'blue_alt1' : 'blue'
  const purpleTheme = hovered === 2 ? 'purple_alt1' : 'purple'

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
        py="$1"
        $sm={{ flexDirection: 'column' }}
        $gtSm={{
          px: '$6',
        }}
      >
        <Section theme={greenTheme} onHoverIn={() => setHovered(0)}>
          <IconStack>
            <Code size={16} color="var(--color9)" />
          </IconStack>
          <TitleLink href="/docs/core/configuration">Core</TitleLink>
          <Paragraph o={0.7} size="$5">
            0-dependency style library for React. Use it web-only, or target React Native
            with the same code. It adds many missing features to the RN style API in
            ~24Kb.
          </Paragraph>
        </Section>

        <Section theme={blueTheme} onHoverIn={() => setHovered(1)}>
          <IconStack>
            <Cpu size={16} color="var(--color9)" />
          </IconStack>
          <TitleLink href="/docs/intro/why-a-compiler">Static</TitleLink>
          <Paragraph o={0.7} size="$5">
            An smart optimizer that does partial analysis, extracts CSS, flattens your
            tree, and removes code. Supports Next, Webpack, Vite, Babel and Metro.
          </Paragraph>
        </Section>

        <Section theme={purpleTheme} onHoverIn={() => setHovered(2)}>
          <IconStack>
            <Layers size={16} color="var(--color9)" />
          </IconStack>
          <TitleLink href="/docs/components/stacks">Tamagui</TitleLink>
          <Paragraph o={0.7} size="$5">
            All the components you'd want, cross platform and adaptable to each other.
            Composable Component APIs, styled or unstyled, sizable, themeable, and more.
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

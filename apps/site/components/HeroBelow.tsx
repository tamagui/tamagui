import { ChevronRight, Code, Compass, Cpu, Layers } from '@tamagui/feather-icons'
import Link from 'next/link'
import React from 'react'
import { memo } from 'react'
import { H3, Paragraph, Theme, XStack, YStack, YStackProps, getTokens } from 'tamagui'

import { CodeInline } from './Code'
import { ContainerLarge } from './Container'
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
        <YStack width="33%" $sm={{ width: 'auto', maxWidth: 500, mx: 'auto' }} flexShrink={1}>
          <IconStack theme="pink_alt2">
            <Code size={18} color="var(--colorHover)" />
          </IconStack>
          <TitleLink href="/docs/core/configuration">Core</TitleLink>
          <Paragraph size="$4" theme="alt1">
            A lightweight design-system library for React Native (and Web) that takes tokens,
            themes, fonts and more and gives you a typed <CodeInline>styled</CodeInline>
            function with all sorts of goodies.
          </Paragraph>
        </YStack>

        <YStack width="33%" $sm={{ width: 'auto', maxWidth: 500, mx: 'auto' }} flexShrink={1}>
          <IconStack theme="purple_alt2">
            <Cpu size={18} color="var(--colorHover)" />
          </IconStack>
          <TitleLink href="/docs/intro/benchmarks">Static</TitleLink>
          <Paragraph size="$4" theme="alt1">
            The <CodeInline>@tamagui/static</CodeInline> package plugs into many build tools and
            compile-time optimizes your app on native and web, with CSS extraction, partial
            evaluation and tree flattening.
          </Paragraph>
        </YStack>

        <YStack width="33%" $sm={{ width: 'auto', maxWidth: 500, mx: 'auto' }} flexShrink={1}>
          <IconStack theme="green_alt2">
            <Layers size={18} color="var(--colorHover)" />
          </IconStack>
          <TitleLink href="/docs/components/stacks">Tamagui</TitleLink>
          <Paragraph size="$4" theme="alt1">
            A large universal UI kit built on top of Core and Static that features typed sizing
            across every component, and Radix-style composable components.
          </Paragraph>
        </YStack>
      </XStack>
    </ContainerLarge>
  )
})

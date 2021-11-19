import { LogoWords, TamaguiLogo } from '@components/TamaguiLogo'
import { ThemeToggle } from '@components/ThemeToggle'
import NextLink from 'next/link'
import React from 'react'
import { Paragraph, Text, VisuallyHidden, XStack, YStack } from 'tamagui'

import { DiscordIcon } from './DiscordIcon'
import { GithubIcon } from './GithubIcon'

export function Header() {
  return (
    <XStack
      ai="center"
      position="relative"
      tag="header"
      py="$4"
      px="$4"
      jc="space-between"
      p="relative"
      zi={1}
    >
      <NextLink href="/" passHref>
        <YStack my={-20}>
          <VisuallyHidden>
            <Text>Tamagui homepage</Text>
          </VisuallyHidden>

          <TamaguiLogo />
        </YStack>
      </NextLink>

      <XStack
        position="absolute"
        $sm={{
          display: 'none',
        }}
        zIndex={-1}
        jc="center"
        fullscreen
        pointerEvents="none"
        ai="center"
      >
        <LogoWords />
      </XStack>

      <XStack pointerEvents="auto" tag="nav" ai="center" space="$6">
        <NextLink href="/docs/intro/installation" passHref>
          <Paragraph size="$3" opacity={0.5} hoverStyle={{ opacity: 1 }} tag="a">
            Docs
          </Paragraph>
        </NextLink>

        <NextLink href="/blog" passHref>
          <Paragraph size="$3" opacity={0.5} hoverStyle={{ opacity: 1 }} tag="a">
            Blog
          </Paragraph>
        </NextLink>

        <NextLink href="https://github.com/tamagui/tamagui" passHref>
          <YStack opacity={0.65} hoverStyle={{ opacity: 1 }} tag="a" target="_blank">
            <VisuallyHidden>
              <Text>Github</Text>
            </VisuallyHidden>
            <GithubIcon width={25} />
          </YStack>
        </NextLink>

        <NextLink
          href="https://discord.gg/uUtvv6GM"
          passHref
          // css={{ mr: '$5', '@bp2': { mr: '$7' } }}
        >
          <YStack
            $sm={{ height: 0, width: 0, overflow: 'hidden', mx: -18 }}
            opacity={0.65}
            hoverStyle={{ opacity: 1 }}
            tag="a"
            target="_blank"
          >
            <VisuallyHidden>
              <Text>Discord</Text>
            </VisuallyHidden>
            <DiscordIcon width={25} />
          </YStack>
        </NextLink>
        <ThemeToggle />
      </XStack>
    </XStack>
  )
}

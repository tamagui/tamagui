import { LogoWords, TamaguiLogo } from '@components/TamaguiLogo'
import { ThemeToggle } from '@components/ThemeToggle'
import NextLink from 'next/link'
import React from 'react'
import { Paragraph, Text, XStack, YStack } from 'tamagui'

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
          <Text
            className="clip-invisible"
            display="flex"
            position="absolute"
            width={1}
            height={1}
            padding={0}
            color="$color2"
            margin={-1}
            overflow="hidden"
            whiteSpace="nowrap"
            borderWidth={0}
          >
            Tamagui homepage
          </Text>

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

      <XStack pointerEvents="auto" tag="nav" ai="center" space="$5">
        <NextLink href="/docs/intro/installation" passHref>
          <Paragraph size="$3" opacity={0.5} hoverStyle={{ opacity: 1 }} tag="a">
            Docs
          </Paragraph>
        </NextLink>
        {/* <NextLink href="/blog" passHref>
          <Paragraph size="$3" opacity={0.5} hoverStyle={{ opacity: 1 }}>Blog</Paragraph>
        </NextLink> */}
        <NextLink href="https://github.com/tamagui/tamagui" passHref>
          <Paragraph
            size="$3"
            opacity={0.5}
            hoverStyle={{ opacity: 1 }}
            tag="a"
            $sm={{ height: 0, width: 0, overflow: 'hidden', mx: -10 }}
          >
            GitHub
          </Paragraph>
        </NextLink>
        <NextLink
          href="https://discord.gg/uUtvv6GM"
          passHref
          // css={{ mr: '$5', '@bp2': { mr: '$7' } }}
        >
          <Paragraph size="$3" opacity={0.5} hoverStyle={{ opacity: 1 }} tag="a">
            Discord
          </Paragraph>
        </NextLink>
        <ThemeToggle />
      </XStack>
    </XStack>
  )
}

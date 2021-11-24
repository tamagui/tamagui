import { TamaguiLogo } from '@components/TamaguiLogo'
import React from 'react'
import { H4, Paragraph, Separator, Text, XStack, YStack } from 'tamagui'

import { ContainerLarge } from './Container'
import { ExternalIcon } from './ExternalIcon'
import { Link } from './Link'

export const Footer = () => {
  return (
    <ContainerLarge>
      <YStack mt="$4" justifyContent="center">
        <Separator />
      </YStack>
      <XStack py="$8" $sm={{ flexDirection: 'column', ai: 'center' }}>
        <YStack
          $sm={{ ai: 'center' }}
          py="$5"
          flex={2}
          ai="flex-start"
          mt="$1"
          pb="$6"
          px="$4"
          space="$2"
        >
          <Link href="/" marginBottom={20}>
            <Text
              className="clip-invisible"
              position="absolute"
              width={1}
              height={1}
              padding={0}
              margin={-1}
              overflow="hidden"
            >
              homepage
            </Text>
            <TamaguiLogo showWords />
          </Link>
          <Paragraph size="$2" color="$color3">
            by{' '}
            <Link fontSize="inherit" href="https://twitter.com/natebirdman" target="_blank">
              nate
            </Link>
            .
          </Paragraph>
          <Paragraph size="$2" color="$color3">
            built with Tamagui
          </Paragraph>
          <Paragraph size="$2" color="$color3">
            site forked from{' '}
            <Link fontSize="inherit" href="https://github.com/modulz" target="_blank">
              modulz
            </Link>
            .
          </Paragraph>
        </YStack>

        <YStack $sm={{ ai: 'center' }} px="$4" py="$5" flex={1.5} space>
          <H4>Overview</H4>
          <Link href="/docs/intro/introduction">Introduction</Link>
          <Link href="/docs/intro/configuration">Configuration</Link>
          <Link href="/docs/guides/design-systems">Guides</Link>
          {/* <Link href="/docs/api">API</Link>
          <Link href="/docs/frequently-asked-questions">FAQ</Link> */}
        </YStack>

        <YStack $sm={{ ai: 'center' }} px="$4" py="$5" flex={1.5} space>
          <H4>Docs</H4>
          <Link href="/docs/intro/installation">Installation</Link>
          <Link href="/docs/intro/themes">Themes</Link>
          <Link href="/docs/core/styled">Variants</Link>
        </YStack>

        <YStack $sm={{ ai: 'center' }} px="$4" py="$5" flex={1.5} space>
          <H4>Community</H4>
          {/* <Link href="/blog">Blog</Link> */}
          <XStack space="$1" ai="center">
            <Link ai="center" href="https://github.com/tamagui/tamagui" target="_blank">
              GitHub
            </Link>
            <ExternalIcon />
          </XStack>
          <XStack space="$1" ai="center">
            <Link ai="center" href="https://twitter.com/tamagui_js" target="_blank">
              Twitter
            </Link>
            <ExternalIcon />
          </XStack>
          <XStack space="$1" ai="center">
            <Link ai="center" href="https://discord.gg/4qh6tdcVDa" target="_blank">
              Discord
            </Link>
            <ExternalIcon />
          </XStack>
        </YStack>
      </XStack>
    </ContainerLarge>
  )
}

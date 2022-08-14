import { TamaguiLogo } from '@tamagui/logo'
import React from 'react'
import { H4, Paragraph, Spacer, Text, XStack, YStack } from 'tamagui'

import { ContainerLarge } from './Container.server'

// import { ExternalIcon } from './ExternalIcon'
// import { ParagraphLink } from './Link'

const ExternalIcon = () => null
const ParagraphLink = Paragraph
const Link = Paragraph

export const Footer = () => {
  return (
    <YStack tag="footer" pos="relative">
      <YStack fullscreen className="bg-dot-grid mask-gradient-up" pe="none" zi={-1} />
      <ContainerLarge>
        <XStack py="$7" $sm={{ flexDirection: 'column', ai: 'center' }}>
          <YStack
            ai="flex-start"
            $sm={{ ai: 'center' }}
            py="$5"
            flex={2}
            mt="$-1"
            mb="$2"
            px="$4"
            space="$4"
          >
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
            <Link href="/">
              <TamaguiLogo showWords downscale={1} />
            </Link>
            <Paragraph tag="span" mt="$2" size="$3">
              by{' '}
              <ParagraphLink
                fontSize="inherit"
                href="https://twitter.com/natebirdman"
                target="_blank"
              >
                nate
              </ParagraphLink>
            </Paragraph>
            <Paragraph size="$3">built with Tamagui</Paragraph>
          </YStack>

          <YStack ai="flex-start" $sm={{ ai: 'center' }} px="$4" py="$5" flex={1.5} space="$3">
            <H4 mb="$3" size="$4" fontFamily="$silkscreen">
              Overview
            </H4>
            <ParagraphLink href="/docs/intro/introduction">Introduction</ParagraphLink>
            <ParagraphLink href="/docs/intro/configuration">Configuration</ParagraphLink>
            <ParagraphLink href="/docs/guides/design-systems">Guides</ParagraphLink>
          </YStack>

          <YStack ai="flex-start" $sm={{ ai: 'center' }} px="$4" py="$5" flex={1.5} space="$3">
            <H4 mb="$3" size="$4" fontFamily="$silkscreen">
              Docs
            </H4>
            <ParagraphLink href="/docs/intro/installation">Installation</ParagraphLink>
            <ParagraphLink href="/docs/intro/themes">Themes</ParagraphLink>
            <ParagraphLink href="/docs/core/styled">Variants</ParagraphLink>
          </YStack>

          <YStack ai="flex-start" $sm={{ ai: 'center' }} px="$4" py="$5" flex={1.5} space="$3">
            <H4 mb="$3" size="$4" fontFamily="$silkscreen">
              Community
            </H4>
            <ParagraphLink href="/blog">Blog</ParagraphLink>
            <XStack space="$1" ai="center">
              <ParagraphLink href="https://github.com/tamagui/tamagui" target="_blank">
                GitHub
              </ParagraphLink>
              <ExternalIcon />
            </XStack>
            <XStack space="$1" ai="center">
              <ParagraphLink href="https://twitter.com/tamagui_js" target="_blank">
                Twitter
              </ParagraphLink>
              <ExternalIcon />
            </XStack>
            <XStack space="$1" ai="center">
              <ParagraphLink href="https://discord.gg/4qh6tdcVDa" target="_blank">
                Discord
              </ParagraphLink>
              <ExternalIcon />
            </XStack>
          </YStack>
        </XStack>
      </ContainerLarge>
    </YStack>
  )
}

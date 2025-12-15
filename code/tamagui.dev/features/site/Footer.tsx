import { TamaguiLogo } from '@tamagui/logo'
import { memo } from 'react'
import { H4, Paragraph, Spacer, VisuallyHidden, XStack, YStack } from 'tamagui'

import { ContainerLarge } from '~/components/Containers'
import { Link, ParagraphLink } from '~/components/Link'
import { ExternalIcon } from '../icons/ExternalIcon'

export const Footer = memo(() => {
  return (
    <YStack render="footer" position="relative" mb="$10">
      <ContainerLarge>
        <XStack py="$7" $sm={{ flexDirection: 'column', items: 'center' }}>
          <YStack
            items="flex-start"
            $sm={{ items: 'center' }}
            py="$5"
            flex={2}
            mb="$2"
            px="$6"
            gap="$4"
          >
            <Link href="/" aria-label="Homepage">
              <VisuallyHidden>homepage</VisuallyHidden>
              <TamaguiLogo showWords downscale={1} />
            </Link>
            <Paragraph size="$3" opacity={0.25}>
              built with Tamagui
            </Paragraph>
          </YStack>

          <YStack
            items="flex-start"
            $sm={{ items: 'center' }}
            px="$4"
            py="$5"
            flex={1.5}
            gap="$3"
          >
            <H4 mb="$3" fontFamily="$mono" size="$4" letterSpacing={0.5} opacity={0.5}>
              Overview
            </H4>
            <ParagraphLink href="/docs/intro/introduction">Introduction</ParagraphLink>
            <ParagraphLink href="/docs/core/configuration">Configuration</ParagraphLink>
            <ParagraphLink href="/privacy">Privacy Policy</ParagraphLink>
            <ParagraphLink href="/pro-policy">Fulfillment Policy</ParagraphLink>
            <ParagraphLink href="/dpa">Data Processing Agreement</ParagraphLink>
            {/* <ParagraphLink href="/docs/api">API</ParagraphLink>
          <ParagraphLink href="/docs/frequently-asked-questions">FAQ</ParagraphLink> */}
          </YStack>

          <YStack
            items="flex-start"
            $sm={{ items: 'center' }}
            px="$4"
            py="$5"
            flex={1.5}
            gap="$3"
          >
            <H4 mb="$3" fontFamily="$mono" size="$4" letterSpacing={0.5} opacity={0.5}>
              Docs
            </H4>
            <ParagraphLink href="/docs/intro/introduction">Introduction</ParagraphLink>
            <ParagraphLink href="/docs/intro/installation">Installation</ParagraphLink>
            <ParagraphLink href="/docs/core/introduction">Core</ParagraphLink>
            <ParagraphLink href="/docs/core/styled">styled()</ParagraphLink>
            <ParagraphLink href="/docs/intro/why-a-compiler">Compiler</ParagraphLink>
          </YStack>

          <YStack
            items="flex-start"
            $sm={{ items: 'center' }}
            px="$4"
            py="$5"
            flex={1.5}
            gap="$3"
          >
            <H4 mb="$3" fontFamily="$mono" size="$4" letterSpacing={0.5} opacity={0.5}>
              Community
            </H4>
            <XStack gap="$1" items="center">
              <ParagraphLink href="/community">Community</ParagraphLink>
            </XStack>
            <XStack gap="$1" items="center">
              <ParagraphLink href="/blog">Blog</ParagraphLink>
            </XStack>
            <XStack gap="$1" items="center">
              <ParagraphLink href="https://github.com/tamagui/tamagui" target="_blank">
                GitHub
              </ParagraphLink>
              <ExternalIcon />
            </XStack>
            <XStack gap="$1" items="center">
              <ParagraphLink href="https://x.com/tamagui_js" target="_blank">
                X
              </ParagraphLink>
              <ExternalIcon />
            </XStack>
            <XStack gap="$1" items="center">
              <ParagraphLink href="https://discord.gg/4qh6tdcVDa" target="_blank">
                Discord
              </ParagraphLink>
              <ExternalIcon />
            </XStack>
          </YStack>
        </XStack>

        <Spacer />
        <Spacer />
        <Spacer />
      </ContainerLarge>
    </YStack>
  )
})

import { ExternalLink } from '@tamagui/lucide-icons'
import React from 'react'
import {
  H2,
  Paragraph,
  Separator,
  SizableText,
  Text,
  VisuallyHidden,
  XStack,
  YStack,
} from 'tamagui'

import { Features } from './Features'
import { FrontmatterContext } from './FrontmatterContext'
import { Link } from './Link'

export function Highlights({ features, disableLinks }: any) {
  const frontmatter = React.useContext(FrontmatterContext)

  return (
    <YStack
      my="$2"
      f={1}
      $gtSm={{
        fd: 'row',
      }}
    >
      <YStack
        f={1}
        mih={142}
        $gtSm={{
          flex: 1,
          mr: '$5',
        }}
      >
        <H2 fontFamily="$body" size="$6" mb="$2" fow="800">
          Features
        </H2>

        <YStack tag="ul" p={0} m={0} space>
          <Features space="$2" items={features} />
        </YStack>
      </YStack>

      {!disableLinks && (
        <YStack space="$3" tag="nav" aria-labelledby="site-component-info-header">
          <VisuallyHidden>
            <h2 id="site-component-info-heading">Component Reference Links</h2>
          </VisuallyHidden>

          <Separator />

          <YStack mb="$4" space="$1">
            <Link
              href={`https://github.com/tamagui/tamagui/tree/master/packages/${
                frontmatter.package
                  ? `${frontmatter.package}/src/${frontmatter.component}.tsx`
                  : `tamagui/src/views/${frontmatter.component}.tsx`
              }`}
              target="_blank"
            >
              <XStack ai="center" space="$1">
                <SizableText size="$2">View source</SizableText>
                <YStack opacity={0.5} ml="$0.5">
                  <ExternalLink size={12} color="var(--colorHover)" />
                </YStack>
              </XStack>
            </Link>
            <Link href={`https://www.npmjs.com/package/tamagui`} target="_blank">
              <XStack ai="center" space="$1">
                <SizableText size="$2">View on npm</SizableText>
                <YStack opacity={0.5} ml="$0.5">
                  <ExternalLink size={12} color="var(--colorHover)" />
                </YStack>
              </XStack>
            </Link>
            <Link href="https://github.com/tamagui/tamagui/issues/new/choose" target="_blank">
              <XStack ai="center" space="$1">
                <SizableText size="$2">Report an issue</SizableText>
                <YStack opacity={0.5} ml="$0.5">
                  <ExternalLink size={12} color="var(--colorHover)" />
                </YStack>
              </XStack>
            </Link>

            {/* @ts-ignore */}
            {frontmatter.aria && (
              <YStack mb="$2">
                {/* @ts-ignore */}
                <Link theme="blue" href={frontmatter.aria} target="_blank">
                  <XStack position="relative">
                    <Paragraph size="$2" theme="alt1">
                      ARIA design pattern
                    </Paragraph>
                    <YStack ml="$1">
                      <Text theme="alt2">
                        <ExternalLink size={12} color="var(--color)" />
                      </Text>
                    </YStack>
                  </XStack>
                </Link>
              </YStack>
            )}
          </YStack>
        </YStack>
      )}
    </YStack>
  )
}

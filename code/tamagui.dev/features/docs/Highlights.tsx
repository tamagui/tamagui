import { ExternalLink } from '@tamagui/lucide-icons'
import React from 'react'
import { H2, Paragraph, SizableText, Text, VisuallyHidden, XStack, YStack } from 'tamagui'

import { Features } from '~/components/Features'
import { Link } from '~/components/Link'
import { FrontmatterContext } from './FrontmatterContext'

export function Highlights({ features, disableLinks, disableTitle, large }: any) {
  const frontmatter = React.useContext(FrontmatterContext)

  return (
    <YStack
      mb="$2"
      f={1}
      $gtSm={{
        fd: 'row',
        justifyContent: 'space-between',
      }}
      {...(disableTitle && {
        mt: 0,
      })}
    >
      <YStack
        f={1}
        mih={142}
        $gtSm={{
          flex: 1,
          maw: disableLinks ? '100%' : 400,
          mr: '$5',
        }}
      >
        {!disableTitle && (
          <H2 fontFamily="$body" size="$6" mb="$1" fow="800">
            Features
          </H2>
        )}

        <YStack tag="ul" p={0} m={0} gap="$4">
          <Features large={large} items={features} />
        </YStack>
      </YStack>

      {!disableLinks && (
        <YStack gap="$3" tag="nav" aria-labelledby="site-component-info-header" miw={140}>
          <VisuallyHidden>
            <h2 id="site-component-info-heading">Component Reference Links</h2>
          </VisuallyHidden>

          <YStack my="$3" gap="$3">
            <Link
              href={`https://github.com/tamagui/tamagui/tree/master/code/ui/${
                frontmatter.package
                  ? `${frontmatter.package}/src/${frontmatter.component}.tsx`
                  : `tamagui/src/views/${frontmatter.component}.tsx`
              }`}
              target="_blank"
            >
              <XStack ai="center" gap="$1">
                <SizableText size="$3">View source</SizableText>
                <YStack opacity={0.5} ml="$0.5">
                  <ExternalLink size={12} color="var(--colorHover)" />
                </YStack>
              </XStack>
            </Link>
            <Link href={`https://www.npmjs.com/package/tamagui`} target="_blank">
              <XStack ai="center" gap="$1">
                <SizableText size="$3">View on npm</SizableText>
                <YStack opacity={0.5} ml="$0.5">
                  <ExternalLink size={12} color="var(--colorHover)" />
                </YStack>
              </XStack>
            </Link>
            <Link
              href="https://github.com/tamagui/tamagui/issues/new/choose"
              target="_blank"
            >
              <XStack ai="center" gap="$1">
                <SizableText size="$3">Report an issue</SizableText>
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

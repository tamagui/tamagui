import { ExternalLink } from '@tamagui/lucide-icons'
import React from 'react'
import { H2, Paragraph, SizableText, Text, VisuallyHidden, XStack, YStack } from 'tamagui'
import { Features } from '~/components/Features'
import { Link } from '~/components/Link'
import { FrontmatterContext } from './FrontmatterContext'
import { SourceVersionSwitcher } from './SourceVersionSwitcher'

export function Highlights({ features, disableLinks, disableTitle, large }: any) {
  const frontmatter = React.useContext(FrontmatterContext)
  // Use the version from frontmatter (loaded from path)
  const sourceVersion = frontmatter.version || frontmatter.versions?.[0]

  return (
    <YStack
      mb="$2"
      flex={1}
      flexBasis="auto"
      $gtSm={{
        fd: 'row',
        justifyContent: 'space-between',
      }}
      {...(disableTitle && {
        mt: 0,
      })}
    >
      <YStack
        flex={1}
        minH={142}
        $gtSm={{
          flex: 1,
          maxW: disableLinks ? '100%' : 400,
          mr: '$5',
        }}
      >
        {!disableTitle && (
          <H2 fontFamily="$body" size="$6" mb="$1" fontWeight="800">
            Features
          </H2>
        )}

        <YStack tag="ul" p={0} m={0} gap="$4">
          <Features large={large} items={features} />
        </YStack>
      </YStack>

      {!disableLinks && (
        <YStack
          gap="$3"
          tag="nav"
          aria-labelledby="site-component-info-header"
          minW={140}
        >
          <VisuallyHidden>
            <h2 id="site-component-info-heading">Component Reference Links</h2>
          </VisuallyHidden>
          <YStack my="$3" gap="$3">
            {frontmatter.versions && frontmatter.versions.length > 1 && (
              <SourceVersionSwitcher
                versions={frontmatter.versions}
                componentName={frontmatter.name || frontmatter.component || ''}
              />
            )}

            <Link
              href={`https://github.com/tamagui/tamagui/tree/${sourceVersion ? `v${sourceVersion}` : 'main'}/code/ui/${
                frontmatter.package
                  ? `${frontmatter.package}/src/${frontmatter.component}.tsx`
                  : `tamagui/src/views/${frontmatter.component}.tsx`
              }`}
              target="_blank"
            >
              <XStack items="center" gap="$1">
                <SizableText size="$3">View source</SizableText>
                <YStack opacity={0.5} ml="$0.5">
                  <ExternalLink size={12} color="var(--colorHover)" />
                </YStack>
              </XStack>
            </Link>
            <Link href={`https://www.npmjs.com/package/tamagui`} target="_blank">
              <XStack items="center" gap="$1">
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
              <XStack items="center" gap="$1">
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

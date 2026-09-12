import { ExternalLink } from '@tamagui/lucide-icons-2'
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
      mb="5"
      fd="gtSm:row"
      justifyContent="gtSm:space-between"
      {...(disableTitle && {
        mt: 0,
      })}
    >
      <YStack flex="gtSm:1" maxW={disableLinks ? 'gtSm:100%' : 'gtSm:400px'} mr="gtSm:5">
        {!disableTitle && (
          // the gap under the title and the gap between items are two different
          // spacings: the title needs room, the items want almost none. they had
          // been driven off one value, so tightening the list kept closing up the
          // title with it
          <H2 fontFamily="body" mb="3" fontWeight="800" size="6">
            Features
          </H2>
        )}

        <Features large={large} items={features} />
      </YStack>

      {!disableLinks && (
        <YStack
          gap={0}
          minW={140}
          render="nav"
          aria-labelledby="site-component-info-heading"
        >
          <VisuallyHidden>
            <h2 id="site-component-info-heading">Component Reference Links</h2>
          </VisuallyHidden>
          <YStack marginTop={0} marginBottom={0} gap="0-5">
            {frontmatter.versions && frontmatter.versions.length > 1 && (
              // the version switcher reads as this column's heading, so it gets
              // the title gap while the links below it stay tight
              <YStack mb="2">
                <SourceVersionSwitcher
                  versions={frontmatter.versions}
                  componentName={frontmatter.name || frontmatter.component || ''}
                />
              </YStack>
            )}

            <Link
              href={`https://github.com/tamagui/tamagui/tree/${sourceVersion ? `v${sourceVersion}` : 'main'}/code/ui/${
                frontmatter.package
                  ? `${frontmatter.package}/src/${frontmatter.component}.tsx`
                  : `tamagui/src/views/${frontmatter.component}.tsx`
              }`}
              target="_blank"
            >
              <XStack items="center" gap="1">
                <SizableText size="3">View source</SizableText>
                <YStack opacity={0.5} ml="0-5">
                  <ExternalLink size={12} color="var(--color-hover)" />
                </YStack>
              </XStack>
            </Link>
            <Link href={`https://www.npmjs.com/package/tamagui`} target="_blank">
              <XStack items="center" gap="1">
                <SizableText size="3">View on npm</SizableText>
                <YStack opacity={0.5} ml="0-5">
                  <ExternalLink size={12} color="var(--color-hover)" />
                </YStack>
              </XStack>
            </Link>
            <Link
              href="https://github.com/tamagui/tamagui/issues/new/choose"
              target="_blank"
            >
              <XStack items="center" gap="1">
                <SizableText size="3">Report an issue</SizableText>
                <YStack opacity={0.5} ml="0-5">
                  <ExternalLink size={12} color="var(--color-hover)" />
                </YStack>
              </XStack>
            </Link>

            {/* @ts-ignore */}
            {frontmatter.aria && (
              <YStack mb="2">
                {/* @ts-ignore */}
                <Link theme="blue" href={frontmatter.aria} target="_blank">
                  <XStack position="relative">
                    <Paragraph size="2" color="color-10">
                      ARIA design pattern
                    </Paragraph>
                    <YStack ml="1">
                      <Text color="color-9">
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

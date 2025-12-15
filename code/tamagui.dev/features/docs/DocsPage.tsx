import { LinearGradient } from '@tamagui/linear-gradient'
import { ThemeTint } from '@tamagui/logo'
import { ChevronLeft, ChevronRight } from '@tamagui/lucide-icons'
import * as React from 'react'
import { ScrollView } from 'react-native'
import { EnsureFlexed, Paragraph, View, XStack, YStack } from 'tamagui'
import type { Href } from 'one'
import { Container } from '~/components/Containers'
import { Link } from '~/components/Link'
import { ThemeNameEffect } from '~/features/site/theme/ThemeNameEffect'
import { DocsMenuContents } from './DocsMenuContents'
import { useDocsMenu } from './useDocsMenu'

export function DocsPage({ children }: { children: React.ReactNode }) {
  const { currentPath, next, previous, documentVersionPath } = useDocsMenu()

  const GITHUB_URL = 'https://github.com' as const
  const REPO_NAME = 'tamagui/tamagui' as const
  const editUrl =
    `${GITHUB_URL}/${REPO_NAME}/edit/main/code/tamagui.dev/data${currentPath}${documentVersionPath}.mdx` as const

  const pageContents = React.useMemo(() => {
    return (
      <>
        {/* capture all docs pages */}
        <ThemeNameEffect colorKey="$color1" />

        <YStack render="article">
          <Container position="relative">{children}</Container>

          <Container>
            {(previous || next) && (
              <XStack
                aria-label="Pagination navigation"
                my="$9"
                justify="space-between"
                gap="$4"
              >
                {previous && (
                  <Link href={previous.route as Href} asChild>
                    <XStack
                      render="a"
                      group="card"
                      hoverStyle={{
                        borderColor: '$color11',
                      }}
                      flex={1}
                      width="50%"
                      p="$5"
                      rounded="$2"
                      borderWidth={1}
                      borderColor="$borderColor"
                      pressStyle={{
                        bg: '$backgroundPress',
                      }}
                      aria-label={`Previous page: ${previous.title}`}
                      items="center"
                      gap="$4"
                      animation="100ms"
                    >
                      <View
                        opacity={0}
                        l="$-4"
                        $group-card-hover={{ opacity: 1, l: '$0' }}
                        $group-card-press={{ opacity: 0, l: '$-4' }}
                        animation="quickest"
                      >
                        <ChevronLeft color="$color11" />
                      </View>

                      <YStack
                        l="$-8"
                        $group-card-hover={{ l: '$0' }}
                        $group-card-press={{ l: '$-8' }}
                        animation="quicker"
                      >
                        <Paragraph select="none" theme="alt1" size="$5">
                          Previous
                        </Paragraph>
                        <Paragraph select="none" size="$3" color="$gray10">
                          {previous.title}
                        </Paragraph>
                      </YStack>
                    </XStack>
                  </Link>
                )}
                {next && (
                  <Link href={next.route as Href} asChild>
                    <XStack
                      render="a"
                      group="card"
                      hoverStyle={{
                        borderColor: '$color11',
                      }}
                      flex={1}
                      width="50%"
                      p="$5"
                      rounded="$2"
                      borderWidth={1}
                      borderColor="$borderColor"
                      pressStyle={{
                        bg: '$backgroundPress',
                      }}
                      aria-label={`Previous page: ${next.title}`}
                      items="center"
                      justify="flex-end"
                      gap="$4"
                      animation="100ms"
                    >
                      <YStack
                        r="$-8"
                        $group-card-hover={{ r: '$0' }}
                        $group-card-press={{ r: '$-8' }}
                        animation="quicker"
                      >
                        <Paragraph select="none" theme="alt1" size="$5">
                          Next
                        </Paragraph>
                        <Paragraph select="none" size="$3" color="$gray10">
                          {next.title}
                        </Paragraph>
                      </YStack>

                      <View
                        opacity={0}
                        r="$-4"
                        $group-card-hover={{ opacity: 1, r: '$0' }}
                        $group-card-press={{ opacity: 0, r: '$-4' }}
                        animation="quickest"
                      >
                        <ChevronRight color="$color11" />
                      </View>
                    </XStack>
                  </Link>
                )}
              </XStack>
            )}
          </Container>

          <Container my="$3">
            <Link
              href={editUrl}
              // @ts-ignore
              title="Edit this page on GitHub."
              rel="noopener noreferrer"
              target="_blank"
              opacity={0.4}
            >
              Edit this page on GitHub.
            </Link>
          </Container>
        </YStack>
      </>
    )
  }, [children, previous, next, editUrl])

  return (
    <>
      <YStack
        overflow="hidden"
        mx="auto"
        $gtSm={{
          flexDirection: 'row',
        }}
        $gtLg={{
          l: -50,
        }}
        maxW={1250}
        z={100}
        position="relative"
      >
        <EnsureFlexed />
        <YStack
          overflow="hidden"
          $md={{
            display: 'none',
          }}
          $gtSm={{
            position: 'fixed' as any,
            t: 0,
            b: 0,
            width: 245,
          }}
        >
          <LinearGradient
            position="absolute"
            t={0}
            l={0}
            r={0}
            height={100}
            width={300}
            z={100}
            colors={['$background', '$background', '$background0']}
          />
          <ScrollView>
            <ThemeTint>
              <YStack
                display="none"
                contain="paint layout"
                $gtMd={{
                  display: 'block',
                  p: '$0.5',
                  pr: '$3',
                  mt: 108,
                  pb: '$18',
                }}
              >
                <DocsMenuContents />
              </YStack>
            </ThemeTint>
          </ScrollView>
        </YStack>
      </YStack>

      <YStack
        maxW="100%"
        flex={1}
        py="$8"
        $gtLg={{
          l: -50,
        }}
        $gtMd={{
          pb: '$9',
          pl: 250,
          pr: 100,
        }}
      >
        {pageContents}
      </YStack>
    </>
  )
}

export type NavItemProps = {
  children: React.ReactNode
  active?: boolean
  href: string
  pending?: boolean
  external?: boolean
}

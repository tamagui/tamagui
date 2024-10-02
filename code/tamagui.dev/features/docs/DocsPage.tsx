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
    `${GITHUB_URL}/${REPO_NAME}/edit/master/code/tamagui.dev/data${currentPath}${documentVersionPath}.mdx` as const

  const pageContents = React.useMemo(() => {
    return (
      <>
        {/* capture all docs pages */}
        <ThemeNameEffect colorKey="$color1" />

        <YStack tag="article">
          <Container pos="relative">{children}</Container>

          <Container>
            {(previous || next) && (
              <XStack
                aria-label="Pagination navigation"
                my="$9"
                jc="space-between"
                gap="$4"
              >
                {previous && (
                  <Link href={previous.route as Href} asChild>
                    <XStack
                      tag="a"
                      group="card"
                      hoverStyle={{
                        borderColor: '$color11',
                      }}
                      flex={1}
                      width="50%"
                      p="$5"
                      borderRadius="$2"
                      borderWidth={1}
                      borderColor="$borderColor"
                      pressStyle={{
                        backgroundColor: '$backgroundPress',
                      }}
                      aria-label={`Previous page: ${previous.title}`}
                      ai="center"
                      gap="$4"
                      animation="100ms"
                    >
                      <View
                        o={0}
                        l="$-4"
                        $group-card-hover={{ o: 1, l: '$0' }}
                        $group-card-press={{ o: 0, l: '$-4' }}
                        animation="quickest"
                      >
                        <ChevronLeft col="$color11" />
                      </View>

                      <YStack
                        l="$-8"
                        $group-card-hover={{ l: '$0' }}
                        $group-card-press={{ l: '$-8' }}
                        animation="quicker"
                      >
                        <Paragraph userSelect="none" theme="alt1" size="$5">
                          Previous
                        </Paragraph>
                        <Paragraph userSelect="none" size="$3" color="$gray10">
                          {previous.title}
                        </Paragraph>
                      </YStack>
                    </XStack>
                  </Link>
                )}
                {next && (
                  <Link href={next.route as Href} asChild>
                    <XStack
                      tag="a"
                      group="card"
                      hoverStyle={{
                        borderColor: '$color11',
                      }}
                      flex={1}
                      width="50%"
                      p="$5"
                      borderRadius="$2"
                      borderWidth={1}
                      borderColor="$borderColor"
                      pressStyle={{
                        backgroundColor: '$backgroundPress',
                      }}
                      aria-label={`Previous page: ${next.title}`}
                      ai="center"
                      jc="flex-end"
                      gap="$4"
                      animation="100ms"
                    >
                      <YStack
                        r="$-8"
                        $group-card-hover={{ r: '$0' }}
                        $group-card-press={{ r: '$-8' }}
                        animation="quicker"
                      >
                        <Paragraph userSelect="none" theme="alt1" size="$5">
                          Next
                        </Paragraph>
                        <Paragraph userSelect="none" size="$3" color="$gray10">
                          {next.title}
                        </Paragraph>
                      </YStack>

                      <View
                        o={0}
                        r="$-4"
                        $group-card-hover={{ o: 1, r: '$0' }}
                        $group-card-press={{ o: 0, r: '$-4' }}
                        animation="quickest"
                      >
                        <ChevronRight col="$color11" />
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
        maw={1250}
        zi={100}
        pos="relative"
      >
        <EnsureFlexed />
        <YStack
          overflow="hidden"
          $md={{
            display: 'none',
          }}
          // className="custom-scroll"
          $gtSm={{
            position: 'fixed' as any,
            top: 0,
            bottom: 0,
            width: 245,
          }}
        >
          <LinearGradient
            pos="absolute"
            t={0}
            l={0}
            r={0}
            h={100}
            w={300}
            zi={100}
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
        maxWidth="100%"
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

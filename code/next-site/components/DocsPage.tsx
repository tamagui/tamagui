import { allDocsRoutes } from '@lib/docsRoutes'
import { LinearGradient } from '@tamagui/linear-gradient'
import { ThemeTint, useTint } from '@tamagui/logo'
import { NextLink } from 'components/NextLink'
import * as React from 'react'
import { ScrollView } from 'react-native'
import { EnsureFlexed, Paragraph, Theme, View, XStack, YStack } from 'tamagui'

import { Container } from './Container'
import { DocsMenuContents } from './DocsMenuContents'
import { Link } from './Link'
import { useDocsMenu } from './useDocsMenu'
import { ThemeNameEffect } from './ThemeNameEffect'
import { ChevronLeft, ChevronRight } from '@tamagui/lucide-icons'

export const allNotPending = allDocsRoutes.filter((x) => !x['pending'])

export function DocsPage({ children }: { children: React.ReactNode }) {
  const { currentPath, next, previous, documentVersionPath } = useDocsMenu()

  const GITHUB_URL = 'https://github.com'
  const REPO_NAME = 'tamagui/tamagui'
  const editUrl = `${GITHUB_URL}/${REPO_NAME}/edit/master/apps/site/data${currentPath}${documentVersionPath}.mdx`

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
                jc={previous ? 'space-between' : 'flex-end'}
                gap="$4"
              >
                {previous && (
                  <NextLink href={previous.route} passHref>
                    <XStack
                      group="card"
                      hoverStyle={{
                        borderColor: '$color11',
                      }}
                      flex={1}
                      width="50%"
                      maw="50%"
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
                        x="$-4"
                        $group-card-hover={{ o: 1, x: '$0' }}
                        $group-card-press={{ o: 0, x: '$-4' }}
                        animation="quickest"
                      >
                        <ChevronLeft col="$color11" />
                      </View>

                      <YStack
                        x="$-8"
                        $group-card-hover={{ x: '$0' }}
                        $group-card-press={{ x: '$-8' }}
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
                  </NextLink>
                )}
                {next && (
                  <NextLink href={next.route} passHref>
                    <XStack
                      group="card"
                      hoverStyle={{
                        borderColor: '$color11',
                      }}
                      flex={1}
                      width="50%"
                      maw="50%"
                      p="$5"
                      borderRadius="$2"
                      borderWidth={1}
                      borderColor="$borderColor"
                      pressStyle={{
                        backgroundColor: '$backgroundPress',
                      }}
                      aria-label={`Next page: ${next.title}`}
                      ai="center"
                      jc="flex-end"
                      gap="$4"
                      animation="100ms"
                    >
                      <YStack
                        x="$8"
                        $group-card-hover={{ x: '$0' }}
                        $group-card-press={{ x: '$8' }}
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
                        x="$4"
                        $group-card-hover={{ o: 1, x: '$0' }}
                        $group-card-press={{ o: 0, x: '$4' }}
                        animation="quickest"
                      >
                        <ChevronRight col="$color11" />
                      </View>
                    </XStack>
                  </NextLink>
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
          <ScrollView showsVerticalScrollIndicator={false}>
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

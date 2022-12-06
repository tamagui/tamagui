import { allDocsRoutes } from '@lib/docsRoutes'
import NextLink from 'next/link'
import * as React from 'react'
import { ScrollView } from 'react-native'
import { EnsureFlexed, Paragraph, Spacer, Theme, XStack, YStack } from 'tamagui'

import { Container } from './Container'
import { DocsMenuContents } from './DocsMenuContents'
import { HeaderIndependent } from './HeaderIndependent'
import { Link } from './Link'
import { useDocsMenu } from './useDocsMenu'
import { useTint } from './useTint'

export const allNotPending = allDocsRoutes.filter((x) => !x['pending'])

export function DocsPage({ children }: { children: React.ReactNode }) {
  const { tint } = useTint()
  const { currentPath, next, previous, documentVersionPath } = useDocsMenu()

  const GITHUB_URL = 'https://github.com'
  const REPO_NAME = 'tamagui/tamagui'
  const editUrl = `${GITHUB_URL}/${REPO_NAME}/edit/master/apps/site/data${currentPath}${documentVersionPath}.mdx`

  const pageContents = React.useMemo(() => {
    return (
      <>
        <YStack>
          <Container pos="relative">{children}</Container>

          <Container>
            {(previous || next) && (
              <XStack aria-label="Pagination navigation" my="$9" jc="space-between" space>
                {previous && (
                  <NextLink legacyBehavior href={previous.route} passHref>
                    <YStack
                      hoverStyle={{
                        borderColor: '$borderColorHover',
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
                      tag="a"
                      aria-label={`Previous page: ${previous.title}`}
                      ai="flex-start"
                    >
                      <Paragraph selectable={false} theme="alt1" size="$5">
                        Previous
                      </Paragraph>
                      <Paragraph selectable={false} size="$3" color="$gray10">
                        {previous.title}
                      </Paragraph>
                    </YStack>
                  </NextLink>
                )}
                {next && (
                  <NextLink legacyBehavior href={next.route} passHref>
                    <YStack
                      hoverStyle={{
                        borderColor: '$borderColorHover',
                      }}
                      width="50%"
                      flex={1}
                      p="$5"
                      borderRadius="$2"
                      borderWidth={1}
                      borderColor="$borderColor"
                      pressStyle={{
                        backgroundColor: '$backgroundPress',
                      }}
                      tag="a"
                      aria-label={`Previous page: ${next.title}`}
                      ai="flex-end"
                    >
                      <Paragraph selectable={false} theme="alt1" size="$5">
                        Next
                      </Paragraph>
                      <Paragraph selectable={false} size="$3" color="$gray10">
                        {next.title}
                      </Paragraph>
                    </YStack>
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
    <Theme name={tint}>
      <HeaderIndependent alwaysFloating />

      <YStack
        overflow="hidden"
        mx="auto"
        $gtSm={{
          flexDirection: 'row',
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
            left: 'calc(min(100vw, 1250px))px',
            bottom: 0,
            width: 230,
          }}
        >
          <ScrollView>
            <YStack
              display="none"
              $gtMd={{
                display: 'block',
                pr: '$6',
                mt: 108,
                pb: '$18',
              }}
            >
              <DocsMenuContents />
            </YStack>
          </ScrollView>
        </YStack>
      </YStack>

      <YStack
        maxWidth="100%"
        flex={1}
        py="$8"
        $gtMd={{
          pb: '$9',
          pl: 230,
          pr: 100,
        }}
      >
        {pageContents}
      </YStack>
    </Theme>
  )
}

export type NavItemProps = {
  children: React.ReactNode
  active?: boolean
  href: string
  pending?: boolean
  external?: boolean
}

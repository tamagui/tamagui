import { LinearGradient } from '@tamagui/linear-gradient'
import { ThemeTint } from '@tamagui/logo'
import { ChevronLeft, ChevronRight } from '@tamagui/lucide-icons-2'
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
        <ThemeNameEffect colorKey="color1" />

        <YStack render="article">
          <Container position="relative">{children}</Container>

          <Container>
            {(previous || next) && (
              <XStack
                aria-label="Pagination navigation"
                my="9"
                justify="space-between"
                gap="4"
              >
                {previous && (
                  <Link href={previous.route as Href} asChild>
                    <XStack
                      render="a"
                      group="card"
                      borderColor="border-color hover:color11"
                      flex={1}
                      width="50%"
                      p="5"
                      rounded="2"
                      borderWidth={1}
                      bg="press:background-press"
                      items="center"
                      gap="4"
                      transition="100ms"
                      aria-label={`Previous page: ${previous.title}`}
                    >
                      <View
                        opacity="0 group-hover/card:1 group-press/card:0"
                        l="-4 group-hover/card:0 group-press/card:-4"
                        transition="quickest"
                      >
                        <ChevronLeft color="color11" />
                      </View>

                      <YStack
                        l="-8 group-hover/card:0 group-press/card:-8"
                        transition="quicker"
                      >
                        <Paragraph select="none" color="color10" size="5">
                          Previous
                        </Paragraph>
                        <Paragraph select="none" color="gray10" size="3">
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
                      borderColor="border-color hover:color11"
                      flex={1}
                      width="50%"
                      p="5"
                      rounded="2"
                      borderWidth={1}
                      bg="press:background-press"
                      items="center"
                      justify="flex-end"
                      gap="4"
                      transition="100ms"
                      aria-label={`Previous page: ${next.title}`}
                    >
                      <YStack
                        r="-8 group-hover/card:0 group-press/card:-8"
                        transition="quicker"
                      >
                        <Paragraph select="none" color="color10" size="5">
                          Next
                        </Paragraph>
                        <Paragraph select="none" color="gray10" size="3">
                          {next.title}
                        </Paragraph>
                      </YStack>

                      <View
                        opacity="0 group-hover/card:1 group-press/card:0"
                        r="-4 group-hover/card:0 group-press/card:-4"
                        transition="quickest"
                      >
                        <ChevronRight color="color11" />
                      </View>
                    </XStack>
                  </Link>
                )}
              </XStack>
            )}
          </Container>

          <Container my="3">
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
        flexDirection="gtSm:row"
        l="gtLg:-50px"
        maxW={1250}
        z={100}
        position="relative"
      >
        <EnsureFlexed />
        <YStack
          overflow="hidden"
          display="md:none"
          position="gtSm:fixed"
          t="gtSm:0px"
          b="gtSm:0px"
          width="gtSm:245px"
        >
          <LinearGradient
            position="absolute"
            t={0}
            l={0}
            r={0}
            height={100}
            width={300}
            z={100}
            colors={['background', 'background', 'background0']}
          />
          <ScrollView>
            <ThemeTint>
              <YStack
                display="none gtMd:block"
                paddingTop="gtMd:0-5"
                paddingLeft="gtMd:0-5"
                pr="gtMd:3"
                mt="gtMd:108px"
                pb="gtMd:18"
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
        paddingTop="8"
        pb="8 gtMd:9"
        l="gtLg:-50px"
        pl="gtMd:250px"
        pr="gtMd:100px"
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

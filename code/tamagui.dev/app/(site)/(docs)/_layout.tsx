import { LinearGradient } from '@tamagui/linear-gradient'
import { ChevronLeft, ChevronRight } from '@tamagui/lucide-icons'
import { type Href, Slot } from 'one'
import type { ReactNode } from 'react'
import { ScrollView } from 'react-native'
import { EnsureFlexed, Paragraph, View, XStack, YStack } from 'tamagui'
import { Container } from '~/components/Containers'
import { Link } from '~/components/Link'
import { DocsMenuContents } from '~/features/docs/DocsMenuContents'
import { useDocsMenu } from '~/features/docs/useDocsMenu'
import { ThemeNameEffect } from '~/features/site/theme/ThemeNameEffect'

export default function DocsLayout() {
  // TODO this isn't supported, we should probably get loaders in layouts working
  // const frontmatter = useLoader(loader)?.frontmatter
  const { currentPath, next, previous, documentVersionPath, pathname, section } =
    useDocsMenu()

  const getMDXPath = (path: string) => {
    // If it's a UI component doc
    if (path.startsWith('/ui/')) {
      const parts = path.split('/')
      const componentName = parts[2]

      // const version = frontmatter?.version || '1.0.0'

      // return `/docs/components/${componentName}/${version}`
      return `/docs/components/${componentName}`
    }
    return `${path}${documentVersionPath}`
  }

  const GITHUB_URL = 'https://github.com'
  const REPO_NAME = 'tamagui/tamagui'
  const editUrl = `${GITHUB_URL}/${REPO_NAME}/edit/master/code/tamagui.dev/data${getMDXPath(currentPath)}.mdx`

  const themeName =
    section === 'core'
      ? 'red'
      : section === 'ui'
        ? 'blue'
        : section === 'compiler'
          ? 'green'
          : null

  return (
    <ThemeNameEffect theme={themeName} colorKey="$color1">
      <LinearGradient
        position="absolute"
        t={0}
        r={0}
        l={0}
        height="100%"
        maxH={1000}
        z={0}
        colors={['$color1', '$color1']}
      />

      <YStack z={-1} fullscreen bg="$color1" />

      {/* Sidebar container - no transform wrapper to preserve position:fixed */}
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
          </ScrollView>
        </YStack>
      </YStack>

      <YStack
        maxW="100%"
        flex={1}
        py="$8"
        $gtLg={{
          position: 'relative',
          l: -50,
        }}
        $gtMd={{
          pb: '$9',
          pl: 250,
          pr: 100,
        }}
      >
        <>
          <YStack tag="article">
            <Container position="relative">
              <Slot />
            </Container>

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
                        tag="a"
                        group="card"
                        hoverStyle={{
                          borderColor: '$color5',
                        }}
                        flex={1}
                        width="50%"
                        p="$5"
                        rounded="$2"
                        borderWidth={1}
                        borderColor="$borderColor"
                        aria-label={`Previous page: ${previous.title}`}
                        items="center"
                        gap="$4"
                        animation="100ms"
                      >
                        <View
                          opacity={0}
                          l="$-2"
                          $group-card-hover={{ opacity: 1, l: '$0' }}
                          animation="quickest"
                        >
                          <ChevronLeft color="$color11" />
                        </View>

                        <YStack
                          l="$-4"
                          $group-card-hover={{ l: '$0' }}
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
                        tag="a"
                        group="card"
                        hoverStyle={{
                          borderColor: '$color5',
                        }}
                        flex={1}
                        width="50%"
                        p="$5"
                        rounded="$2"
                        borderWidth={1}
                        borderColor="$borderColor"
                        aria-label={`Previous page: ${next.title}`}
                        items="center"
                        justify="flex-end"
                        gap="$4"
                        animation="100ms"
                      >
                        <YStack
                          r="$-4"
                          $group-card-hover={{ r: '$0' }}
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
                          r="$-2"
                          $group-card-hover={{ opacity: 1, r: '$0' }}
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
                href={editUrl as any}
                // @ts-ignore
                title="Edit this page on GitHub."
                rel="noopener noreferrer"
                target="_blank"
                o={0.4}
              >
                Edit this page on GitHub.
              </Link>
            </Container>
          </YStack>
        </>
      </YStack>
    </ThemeNameEffect>
  )
}

export type NavItemProps = {
  children: ReactNode
  active?: boolean
  href: string
  pending?: boolean
  external?: boolean
}

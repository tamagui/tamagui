import { LinearGradient } from '@tamagui/linear-gradient'
import { ChevronLeft, ChevronRight } from '@tamagui/lucide-icons'
import { type Href, Slot } from 'one'
import type { ReactNode } from 'react'
import { ScrollView } from 'react-native'
import { Paragraph, View, XStack, YStack } from 'tamagui'
import { Container } from '~/components/Containers'
import { Link } from '~/components/Link'
import { DocsMenuContents } from '~/features/docs/DocsMenuContents'
import { useDocsMenu } from '~/features/docs/useDocsMenu'
import { Footer } from '~/features/site/Footer'
import { ThemeNameEffect } from '~/features/site/theme/ThemeNameEffect'

export default function DocsLayout() {
  const { currentPath, next, previous, documentVersionPath, pathname, section } =
    useDocsMenu()

  const getMDXPath = (path: string) => {
    if (path.startsWith('/ui/')) {
      const parts = path.split('/')
      const componentName = parts[2]
      return `/docs/components/${componentName}`
    }
    return `${path}${documentVersionPath}`
  }

  const GITHUB_URL = 'https://github.com'
  const REPO_NAME = 'tamagui/tamagui'
  const editUrl = `${GITHUB_URL}/${REPO_NAME}/edit/master/code/tamagui.dev/data${getMDXPath(currentPath)}.mdx`

  const themeName =
    section === 'core' || section === 'compiler'
      ? 'red'
      : section === 'ui'
        ? 'blue'
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
        colors={['$color1', '$accent12']}
      />

      <YStack z={-1} fullscreen bg="$accent12" />

      {/* main layout container */}
      <YStack minH="100vh" position="relative" z={1}>
        {/* content row with sidebar */}
        <XStack mx="auto" maxW={1400} width="100%">
          {/* left sidebar - sticky */}
          <View
            className="is-sticky"
            display="none"
            $gtMd={{
              display: 'flex',
              position: 'sticky' as any,
              t: 20,
              height: 'calc(100vh - 20px)',
              width: 245,
              shrink: 0,
              alignSelf: 'flex-start',
            }}
          >
            <ScrollView showsVerticalScrollIndicator={false}>
              <YStack pt={55} pb="$18" px="$2">
                <DocsMenuContents />
              </YStack>
            </ScrollView>
          </View>

          {/* main content */}
          <YStack flex={1} flexBasis="auto" py="$8" px="$4" $gtLg={{ mr: 280 }}>
            <YStack render="article">
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
                          render="a"
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
                          transition="100ms"
                        >
                          <View
                            opacity={0}
                            x="$-2"
                            $group-card-hover={{ opacity: 1, x: '$0' }}
                            transition="quickest"
                          >
                            <ChevronLeft color="$color11" />
                          </View>

                          <YStack
                            x="$-4"
                            $group-card-hover={{ x: '$0' }}
                            transition="quicker"
                          >
                            <Paragraph select="none" color="$color10" size="$5">
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
                            borderColor: '$color5',
                          }}
                          flex={1}
                          width="50%"
                          p="$5"
                          rounded="$2"
                          borderWidth={1}
                          borderColor="$borderColor"
                          aria-label={`Next page: ${next.title}`}
                          items="center"
                          justify="flex-end"
                          gap="$4"
                          transition="100ms"
                        >
                          <YStack
                            x="$4"
                            $group-card-hover={{ x: '$0' }}
                            transition="quicker"
                          >
                            <Paragraph select="none" color="$color10" size="$5">
                              Next
                            </Paragraph>
                            <Paragraph select="none" size="$3" color="$gray10">
                              {next.title}
                            </Paragraph>
                          </YStack>

                          <View
                            opacity={0}
                            x="$2"
                            $group-card-hover={{ opacity: 1, x: '$0' }}
                            transition="quickest"
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
          </YStack>

        </XStack>
      </YStack>

      {/* footer outside the main layout */}
      <Footer />
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

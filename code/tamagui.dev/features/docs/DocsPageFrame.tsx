import { ChevronLeft, ChevronRight } from '@tamagui/local-icons'
import { usePathname, type Href } from 'one'
import type { ReactNode } from 'react'
import { Paragraph, ScrollView, View, XStack, YStack } from 'tamagui'
import { Container } from '~/components/Containers'
import { Link } from '~/components/Link'
import { DocsQuickNav, type Heading } from './DocsQuickNav'
import { DocsMenuContents } from './DocsMenuContents'
import { MDXTabsSearchProvider } from './MDXTabs'
import { DocsSyntaxPicker, DocsVersionLinks } from './DocsVersionPicker'
import { docsSyntaxes, getDocsSyntax, type DocsVersionFrontmatter } from './docsVersion'

type DocsPageFrameProps = {
  children: ReactNode
  headings?: Heading[]
  editUrl?: string
  previous?: { route: string; title: string } | null
  next?: { route: string; title: string } | null
  frontmatter?: DocsVersionFrontmatter
  initialSearch?: string
}

export function DocsPageFrame({
  children,
  headings,
  editUrl,
  previous,
  next,
  frontmatter,
  initialSearch,
}: DocsPageFrameProps) {
  // the syntax tabs switch this article's code variant, so it is their
  // tabpanel (associated via aria-controls on the tabs, labelled by the
  // selected tab). derived from the pathname: SSR-stable.
  const syntax = getDocsSyntax(usePathname())
  const syntaxes = docsSyntaxes.filter(
    (value) =>
      value === 'styled' ||
      value === syntax ||
      (value === 'tailwind' && frontmatter?.hasTailwindVariant) ||
      (value === 'unstyled' && frontmatter?.hasSourceVariant)
  )
  return (
    <>
      {/* left sidebar - sticky. It lives here rather than in the route layout so
          syntax and version controls share the loader data and render in SSR. */}
      <View
        className="is-sticky"
        display="none lg:flex"
        position="lg:sticky"
        t="lg:28px"
        height="lg:calc(100vh - 28px)"
        width="lg:220px"
        shrink="lg:0px"
        alignSelf="lg:flex-start"
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <YStack pt={36} pb="40" px="1-5">
            <DocsMenuContents
              header={
                <DocsVersionLinks
                  frontmatter={frontmatter}
                  initialSearch={initialSearch}
                />
              }
            />
          </YStack>
        </ScrollView>
      </View>

      {/* main content */}
      <YStack render="main" flex={1} minW={0} flexBasis="auto" py="11" px="4 md:8">
        <YStack
          render="article"
          role="tabpanel"
          id="docs-syntax-panel"
          aria-labelledby={`docs-syntax-${syntax}-tab`}
        >
          {/* block, not flex, so prose margins collapse: the gap above a
              heading is its own margin, not that plus the paragraph's */}
          <Container
            className="docs-flow"
            px={0}
            maxW={860}
            position="relative"
            display="block"
          >
            {syntaxes.length > 1 && (
              <XStack
                justify="flex-end"
                mb="4 lg:0"
                position="lg:absolute"
                t="lg:0px"
                r="lg:0px"
                z={1}
              >
                <DocsSyntaxPicker syntaxes={syntaxes} />
              </XStack>
            )}
            <MDXTabsSearchProvider search={initialSearch}>
              {children}
            </MDXTabsSearchProvider>
          </Container>

          <Container px={0} maxW={860}>
            {(previous || next) && (
              <XStack
                aria-label="Pagination navigation"
                my="14"
                justify="space-between"
                gap="4"
              >
                {!previous && <YStack flex={1} />}
                {previous && (
                  <Link href={previous.route as Href} asChild>
                    <XStack
                      render="a"
                      group="card"
                      borderColor="border-color hover:color-5"
                      flex={1}
                      width="50%"
                      p="6"
                      rounded="3"
                      borderWidth={1}
                      items="center"
                      gap="4"
                      transition="100ms"
                      aria-label={`Previous page: ${previous.title}`}
                    >
                      <View
                        opacity="0 group-hover/card:1"
                        x="-1-5 group-hover/card:0"
                        transition="quickest"
                      >
                        <ChevronLeft color="color-11" />
                      </View>

                      <YStack x="-4 group-hover/card:0" transition="quicker">
                        <Paragraph select="none" color="color-10" size="5">
                          Previous
                        </Paragraph>
                        <Paragraph select="none" color="gray-10" size="3">
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
                      borderColor="border-color hover:color-5"
                      flex={1}
                      width="50%"
                      p="6"
                      rounded="3"
                      borderWidth={1}
                      items="center"
                      justify="flex-end"
                      gap="4"
                      transition="100ms"
                      aria-label={`Next page: ${next.title}`}
                    >
                      <YStack x="4 group-hover/card:0" transition="quicker">
                        <Paragraph select="none" color="color-10" size="5">
                          Next
                        </Paragraph>
                        <Paragraph select="none" color="gray-10" size="3">
                          {next.title}
                        </Paragraph>
                      </YStack>

                      <View
                        opacity="0 group-hover/card:1"
                        x="1-5 group-hover/card:0"
                        transition="quickest"
                      >
                        <ChevronRight color="color-11" />
                      </View>
                    </XStack>
                  </Link>
                )}
                {!next && <YStack flex={1} />}
              </XStack>
            )}
          </Container>

          {editUrl && (
            <Container px={0} maxW={860} my="3">
              <Link
                href={editUrl as Href}
                rel="noopener noreferrer"
                target="_blank"
                opacity={0.4}
              >
                Edit this page on GitHub.
              </Link>
            </Container>
          )}
        </YStack>
      </YStack>

      {/* right sidebar - sticky */}
      <DocsQuickNav headings={headings} />
    </>
  )
}

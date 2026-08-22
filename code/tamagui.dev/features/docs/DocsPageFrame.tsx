import { ChevronLeft, ChevronRight } from '@tamagui/lucide-icons-2'
import type { Href } from 'one'
import type { ReactNode } from 'react'
import { Paragraph, View, XStack, YStack } from 'tamagui'
import { Container } from '~/components/Containers'
import { Link } from '~/components/Link'
import { DocsQuickNav, type Heading } from './DocsQuickNav'
import { DocsVersionPickerPortal } from './DocsVersionPicker'
import type { DocsVersionFrontmatter } from './docsVersion'

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
  return (
    <>
      <DocsVersionPickerPortal frontmatter={frontmatter} initialSearch={initialSearch} />
      {/* main content */}
      <YStack flex={1} flexBasis="auto" py="8" px="4">
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
                      borderColor="border-color hover:color5"
                      flex={1}
                      width="50%"
                      p="5"
                      rounded="2"
                      borderWidth={1}
                      items="center"
                      gap="4"
                      transition="100ms"
                      aria-label={`Previous page: ${previous.title}`}
                    >
                      <View
                        opacity="0 group-hover/card:1"
                        x="-2 group-hover/card:0"
                        transition="quickest"
                      >
                        <ChevronLeft color="color11" />
                      </View>

                      <YStack x="-4 group-hover/card:0" transition="quicker">
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
                      borderColor="border-color hover:color5"
                      flex={1}
                      width="50%"
                      p="5"
                      rounded="2"
                      borderWidth={1}
                      items="center"
                      justify="flex-end"
                      gap="4"
                      transition="100ms"
                      aria-label={`Next page: ${next.title}`}
                    >
                      <YStack x="4 group-hover/card:0" transition="quicker">
                        <Paragraph select="none" color="color10" size="5">
                          Next
                        </Paragraph>
                        <Paragraph select="none" color="gray10" size="3">
                          {next.title}
                        </Paragraph>
                      </YStack>

                      <View
                        opacity="0 group-hover/card:1"
                        x="2 group-hover/card:0"
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

          {editUrl && (
            <Container my="3">
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

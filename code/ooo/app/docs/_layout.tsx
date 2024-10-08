import { ChevronLeft, ChevronRight } from '@tamagui/lucide-icons'
import type { ReactNode } from 'react'
import {
  EnsureFlexed,
  H2,
  Paragraph,
  ScrollView,
  SizableText,
  Spacer,
  View,
  XStack,
  YStack,
} from 'tamagui'
import { type Href, Link, Slot } from 'one'
import { TopNav } from '~/components/TopNav'
import { OneLogo } from '~/features/brand/Logo'
import { DocsMenuContents } from '~/features/docs/DocsMenuContents'
import { useDocsMenu } from '~/features/docs/useDocsMenu'
import { SearchProvider } from '~/features/search/SearchProvider'
import { ContainerDocs, ContainerSm } from '~/features/site/Containers'

const GITHUB_URL = 'https://github.com'
const REPO_NAME = 'one-js/one'

export default function DocsLayout() {
  const { currentPath, next, previous, documentVersionPath } = useDocsMenu()
  const editUrl = `${GITHUB_URL}/${REPO_NAME}/edit/master/code/ooo/data${currentPath}${documentVersionPath}.mdx`
  const isRaise = currentPath === '/docs/seed'

  if (isRaise) {
    return (
      <SearchProvider>
        <TopNav />

        <ContainerSm x={-100} $md={{ x: 0 }}>
          <XStack ai="center" w="100%" jc="space-between" $md={{ dsp: 'none' }}>
            <Link href="/">
              <OneLogo size={1} />
            </Link>
          </XStack>
          <Spacer size="$4" />

          <H2 mb="$4">Seed</H2>

          <Slot />
          <Spacer size="$10" />
          <Spacer size="$10" />
          <Spacer size="$10" />
          <Spacer size="$10" />
          <Spacer size="$10" />
        </ContainerSm>
      </SearchProvider>
    )
  }

  return (
    <SearchProvider>
      <TopNav />

      <View
        overflow="hidden"
        mx="auto"
        $gtMd={{
          flexDirection: 'row',
        }}
        $gtLg={{
          l: -50,
        }}
        maw={1250}
        zi={100}
      >
        <EnsureFlexed />
        <View
          animateOnly={['left']}
          position={'fixed' as any}
          top={0}
          zi={9999}
          overflow="hidden"
          width="100%"
          backgroundColor="$background"
          $gtMd={{
            backgroundColor: 'transparent',
            position: 'fixed' as any,
            top: 0,
            bottom: 0,
            width: 245,
          }}
        >
          <YStack
            $md={{ dsp: 'none' }}
            mt={40}
            h={65}
            maxWidth="fit-content"
            ml="auto"
            zi={100_000}
          >
            <Link href="/">
              <OneLogo size={0.55} />
            </Link>
          </YStack>

          <ScrollView>
            <View
              display="none"
              contain="paint layout"
              $gtMd={{
                display: 'block',
                pt: 20,
                pb: '$10',
              }}
            >
              <DocsMenuContents />

              <YStack h={200} />
            </View>
          </ScrollView>
        </View>
      </View>

      <ContainerDocs>
        <Spacer $md={{ dsp: 'none' }} />
        <Slot />

        {(previous || next) && (
          <XStack
            className="text-decoration-none"
            aria-label="Pagination navigation"
            mt="$14"
            mb="$10"
            jc="space-between"
            gap="$4"
          >
            {previous && (
              <Link href={previous.route as Href} asChild>
                <XStack
                  className="text-underline-none"
                  tag="a"
                  group="card"
                  hoverStyle={{
                    borderColor: '$color6',
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
                  <View o={0} l="$-4" animation="quickest">
                    <ChevronLeft col="$color11" />
                  </View>

                  <View l="$-8" animation="quicker">
                    <SizableText userSelect="none" size="$5">
                      Previous
                    </SizableText>
                    <SizableText userSelect="none" size="$3" color="$gray10">
                      {previous.title}
                    </SizableText>
                  </View>
                </XStack>
              </Link>
            )}

            {next && (
              <Link href={next.route as Href} asChild>
                <XStack
                  className="text-underline-none"
                  tag="a"
                  group="card"
                  hoverStyle={{
                    borderColor: '$color6',
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
                  <View r="$-8" animation="quicker">
                    <Paragraph userSelect="none" size="$5">
                      Next
                    </Paragraph>
                    <Paragraph userSelect="none" size="$3" color="$gray10">
                      {next.title}
                    </Paragraph>
                  </View>

                  <View o={0} r="$-4" animation="quickest">
                    <ChevronRight col="$color11" />
                  </View>
                </XStack>
              </Link>
            )}
          </XStack>
        )}

        <Link
          href={editUrl as Href}
          // @ts-ignore
          title="Edit this page on GitHub."
          rel="noopener noreferrer"
          target="_blank"
        >
          <Paragraph
            px="$4"
            o={0.5}
            hoverStyle={{
              o: 1,
            }}
          >
            Edit this page on GitHub.
          </Paragraph>
        </Link>
      </ContainerDocs>
    </SearchProvider>
  )
}

export type NavItemProps = {
  children: ReactNode
  active?: boolean
  href: string
  pending?: boolean
  external?: boolean
}

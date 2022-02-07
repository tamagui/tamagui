import { LogoIcon } from '@components/TamaguiLogo'
import { ThemeToggle } from '@components/ThemeToggle'
import { allDocsRoutes, docsRoutes } from '@lib/docsRoutes'
import { Menu } from '@tamagui/feather-icons'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import * as React from 'react'
import { useEffect } from 'react'
import { ScrollView } from 'react-native'
import { Button, Paragraph, StackProps, Text, Theme, VisuallyHidden, XStack, YStack } from 'tamagui'

import { AlphaButton } from './AlphaButton'
import { ColorToggle, useTint } from './ColorToggle'
import { Container } from './Container'
import { DocsRouteNavItem } from './DocsRouteNavItem'
import { GithubIcon } from './GithubIcon'
import { Link } from './Link'
import { NavHeading } from './NavHeading'

const allNotPending = allDocsRoutes.filter((x) => !x['pending'])

export function DocsPage({ children }: { children: React.ReactNode }) {
  const [tint] = useTint()
  const router = useRouter()
  const [isOpen, setIsOpen] = React.useState(false)

  let currentPath = router.pathname
  if (Array.isArray(router.query.slug)) {
    currentPath = currentPath.replace('[...slug]', router.query.slug[0])
  } else {
    currentPath = currentPath.replace('[slug]', router.query.slug as string)
  }

  const currentPageIndex = allNotPending.findIndex((page) => page.route === currentPath)
  const previous = allNotPending[currentPageIndex - 1]
  const next = allNotPending[currentPageIndex + 1]
  const GITHUB_URL = 'https://github.com'
  const REPO_NAME = 'tamagui/tamagui'
  const editUrl = `${GITHUB_URL}/${REPO_NAME}/edit/master/packages/site/data${currentPath}.mdx`

  useEffect(() => {
    const handleRouteChange = () => {
      setIsOpen(false)
    }
    router.events.on('routeChangeStart', handleRouteChange)
    return () => {
      router.events.off('routeChangeStart', handleRouteChange)
    }
  }, [])

  const menuContents = React.useMemo(() => {
    return (
      <>
        {docsRoutes.map((section, i) => (
          <YStack key={`${section.label}${i}`} mb="$4">
            <NavHeading>{section.label}</NavHeading>
            {section.pages.map((page) => {
              return (
                <DocsRouteNavItem
                  key={page.route}
                  href={page.route}
                  active={currentPath === page.route}
                  pending={page['pending']}
                >
                  {page.title}
                </DocsRouteNavItem>
              )
            })}
          </YStack>
        ))}

        <YStack mb="$4">
          <NavHeading>Community</NavHeading>
          {/* <DocsRouteNavItem href="/blog">Blog</DocsRouteNavItem> */}
          <DocsRouteNavItem href="https://github.com/tamagui/tamagui">GitHub</DocsRouteNavItem>
          <DocsRouteNavItem href="https://twitter.com/tamagui_js">Twitter</DocsRouteNavItem>
          <DocsRouteNavItem href="https://discord.gg/4qh6tdcVDa">Discord</DocsRouteNavItem>
        </YStack>

        <YStack
          height="$5"
          $gtSm={{
            height: '$8',
          }}
        />
      </>
    )
  }, [docsRoutes, currentPath])

  const pageContents = React.useMemo(() => {
    return (
      <>
        <XStack
          $sm={{ display: 'none' }}
          position="absolute"
          top={15}
          right={20}
          ai="center"
          space="$4"
        >
          <AlphaButton />

          <NextLink href="https://github.com/tamagui/tamagui" passHref>
            <YStack opacity={0.65} hoverStyle={{ opacity: 1 }} tag="a" target="_blank">
              <VisuallyHidden>
                <Text>Github</Text>
              </VisuallyHidden>
              <GithubIcon width={23} />
            </YStack>
          </NextLink>
        </XStack>
        <Container>{children}</Container>

        <Container>
          {(previous || next) && (
            <XStack aria-label="Pagination navigation" my="$9" jc="space-between" space>
              {previous && (
                <NextLink href={previous.route} passHref>
                  <YStack
                    hoverStyle={{
                      backgroundColor: '$bg2',
                    }}
                    flex={1}
                    width="50%"
                    p="$3"
                    borderRadius="$2"
                    borderWidth={1}
                    borderColor="$borderColor"
                    tag="a"
                    aria-label={`Previous page: ${previous.title}`}
                    ai="flex-start"
                  >
                    <YStack mb="$2">
                      <Paragraph color="$color2" size="$6">
                        Previous
                      </Paragraph>
                    </YStack>
                    <Paragraph size="$3" fontWeight="800">
                      {previous.title}
                    </Paragraph>
                  </YStack>
                </NextLink>
              )}
              {next && (
                <NextLink href={next.route} passHref>
                  <YStack
                    hoverStyle={{
                      backgroundColor: '$bg2',
                    }}
                    width="50%"
                    flex={1}
                    p="$3"
                    borderRadius="$2"
                    borderWidth={1}
                    borderColor="$borderColor"
                    tag="a"
                    aria-label={`Previous page: ${next.title}`}
                    ai="flex-end"
                  >
                    <YStack mb="$2">
                      <Paragraph color="$color2" size="$6">
                        Next
                      </Paragraph>
                    </YStack>
                    <Paragraph size="$3" fontWeight="800">
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
            title="Edit this page on GitHub."
            rel="noopener noreferrer"
            target="_blank"
          >
            Edit this page on GitHub.
          </Link>
        </Container>
      </>
    )
  }, [children, previous, next, editUrl])

  return (
    <Theme name={tint}>
      <YStack
        $gtSm={{
          flexDirection: 'row',
        }}
      >
        <YStack
          width="100%"
          maxHeight="auto"
          borderColor="$borderColor"
          borderRightWidth={1}
          overflow="hidden"
          $gtSm={{
            position: 'fixed',
            top: 0,
            left: 0,
            bottom: 0,
            width: 230,
            borderRightWidth: 1,
            borderRightColor: '$borderColor',
          }}
        >
          <ScrollView>
            <XStack ai="center" p="$4">
              <Link href="/">
                <VisuallyHidden>
                  <Text>Homepage</Text>
                </VisuallyHidden>
                <LogoIcon downscale={2} />
              </Link>

              <XStack space="$1" ml="auto">
                <ColorToggle />
                <ThemeToggle chromeless />
              </XStack>

              <YStack
                ml="$2"
                $gtSm={{
                  display: 'none',
                }}
              >
                <Button onPress={() => setIsOpen(!isOpen)} theme={isOpen ? 'active' : undefined}>
                  <Menu size={12} color="var(--color)" />
                </Button>
              </YStack>
            </XStack>

            <YStack
              display={isOpen ? 'flex' : 'none'}
              $gtSm={{
                display: 'block',
              }}
            >
              {menuContents}
            </YStack>
          </ScrollView>
        </YStack>

        <YStack
          maxWidth="100%"
          flex={1}
          py="$5"
          $gtSm={{
            pt: 67,
            pb: '$9',
            pl: 250,
            pr: 0,
          }}
          $gtLg={{
            pr: 250,
          }}
        >
          {pageContents}
        </YStack>
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

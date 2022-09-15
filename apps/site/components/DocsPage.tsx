import { ThemeToggle } from '@components/ThemeToggle'
import { allDocsRoutes, docsRoutes } from '@lib/docsRoutes'
import { Menu } from '@tamagui/feather-icons'
import { LogoIcon } from '@tamagui/logo'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import * as React from 'react'
import { useEffect } from 'react'
import { ScrollView } from 'react-native'
import {
  Button,
  Paragraph,
  Separator,
  Spacer,
  Text,
  Theme,
  VisuallyHidden,
  XStack,
  YStack,
} from 'tamagui'

import { AlphaButton } from './AlphaButton'
import { ColorToggleButton, useTint } from './ColorToggleButton'
import { Container } from './Container'
import { DocsRouteNavItem } from './DocsRouteNavItem'
import { GithubIcon } from './GithubIcon'
import { Header, HeaderIndependent } from './Header'
import { Link } from './Link'
import { NavHeading } from './NavHeading'
import { SearchButton } from './SearchButton'

const allNotPending = allDocsRoutes.filter((x) => !x['pending'])

export function DocsPage({ children }: { children: React.ReactNode }) {
  // const { theme } = useTheme()
  const { tint } = useTint()
  const router = useRouter()
  const [open, setOpen] = React.useState(false)

  let currentPath = router.pathname
  let documentVersion = ''

  if (Array.isArray(router.query.slug)) {
    currentPath = currentPath.replace('[...slug]', router.query.slug[0])
    documentVersion = router.query.slug[1]
  } else {
    currentPath = currentPath.replace('[slug]', router.query.slug as string)
  }

  const documentVersionPath = documentVersion ? `/${documentVersion}` : ''
  const currentPageIndex = allNotPending.findIndex((page) => page.route === currentPath)
  const previous = allNotPending[currentPageIndex - 1]
  let nextIndex = currentPageIndex + 1
  let next = allNotPending[nextIndex]
  while (next && next.route.startsWith('http')) {
    next = allNotPending[++nextIndex]
  }

  const GITHUB_URL = 'https://github.com'
  const REPO_NAME = 'tamagui/tamagui'
  const editUrl = `${GITHUB_URL}/${REPO_NAME}/edit/master/apps/site/data${currentPath}${documentVersionPath}.mdx`

  useEffect(() => {
    const handleRouteChange = () => {
      setOpen(false)
    }
    router.events.on('routeChangeStart', handleRouteChange)
    return () => {
      router.events.off('routeChangeStart', handleRouteChange)
    }
  }, [])

  const pageContents = React.useMemo(() => {
    return (
      <>
        <Container>{children}</Container>

        <Container>
          {(previous || next) && (
            <XStack aria-label="Pagination navigation" my="$9" jc="space-between" space>
              {previous && (
                <NextLink href={previous.route} passHref>
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
                <NextLink href={next.route} passHref>
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
      </>
    )
  }, [children, previous, next, editUrl])

  return (
    <Theme name={tint}>
      <HeaderIndependent alwaysFloating />

      <Spacer size="$4" />

      <Container>
        <YStack
          ml="$2"
          pos="absolute"
          t="$2"
          r="$2"
          $gtSm={{
            display: 'none',
          }}
        >
          <Button
            size="$3"
            chromeless
            noTextWrap
            onPress={() => setOpen(!open)}
            theme={open ? 'alt1' : undefined}
          >
            <Menu size={16} color="var(--color)" />
          </Button>
        </YStack>
      </Container>

      <YStack
        overflow="hidden"
        mx="auto"
        $gtSm={{
          flexDirection: 'row',
        }}
        maw={1650}
        pos="relative"
        ov="hidden"
      >
        <YStack
          overflow="hidden"
          // className="custom-scroll"
          $gtSm={{
            position: 'fixed' as any,
            top: 0,
            left: 'calc(min(100vw, 1650px))px',
            bottom: 0,
            width: 230,
          }}
        >
          <ScrollView>
            <YStack
              display={open ? 'flex' : 'none'}
              mt={108}
              $gtMd={{
                display: 'block',
                pr: '$6',
              }}
            >
              {/* mobile web made a diff on open close */}
              {React.useMemo(
                () => (
                  <>
                    {docsRoutes.map((section, i) => {
                      if ('type' in section) {
                        if (section.type === 'hr') {
                          return (
                            <YStack key={`sep-${i}`} mx="$4">
                              {!!section.title ? (
                                <XStack
                                  ai="center"
                                  space="$6"
                                  spaceDirection="horizontal"
                                  mb="$2"
                                  mt="$3"
                                >
                                  <Separator />
                                  <Paragraph size="$4">{section.title}</Paragraph>
                                </XStack>
                              ) : (
                                <Separator my="$4" />
                              )}
                            </YStack>
                          )
                        }
                        return null
                      }
                      return (
                        <YStack key={`${section.label}${i}`} mb="$4">
                          {!!section.label && <NavHeading>{section.label}</NavHeading>}
                          {section.pages.map((page) => {
                            return (
                              <DocsRouteNavItem
                                key={`${page.route}`}
                                href={page.route}
                                active={currentPath === page.route}
                                pending={page['pending']}
                              >
                                {page.title}
                              </DocsRouteNavItem>
                            )
                          })}
                        </YStack>
                      )
                    })}

                    <YStack
                      height="$5"
                      $gtMd={{
                        height: '$8',
                      }}
                    />
                  </>
                ),
                [docsRoutes, currentPath]
              )}
            </YStack>
          </ScrollView>
        </YStack>

        <YStack
          maxWidth="100%"
          flex={1}
          py="$5"
          $gtMd={{
            pb: '$9',
            pl: 230,
            pr: 100,
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

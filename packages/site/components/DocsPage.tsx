import { LogoIcon } from '@components/TamaguiLogo'
import { ThemeToggle } from '@components/ThemeToggle'
import { allDocsRoutes, docsRoutes } from '@lib/docsRoutes'
import { Menu } from '@tamagui/feather-icons'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import * as React from 'react'
import { useEffect } from 'react'
import { ScrollView } from 'react-native'
import { Button, Paragraph, StackProps, Theme, XStack, YStack } from 'tamagui'

import { ColorToggle, useTint } from './ColorToggle'
import { Container } from './Container'
import { ExternalIcon } from './ExternalIcon'
import { Link } from './Link'
import { NavHeading } from './NavHeading'

const DocsPageContainer = (props: StackProps) => (
  <Container $gtSm={{ maxWidth: 780 }} $gtMd={{ maxWidth: 780 }} {...props} />
)

export function DocsPage({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [isOpen, setIsOpen] = React.useState(false)

  let currentPath = router.pathname
  if (Array.isArray(router.query.slug)) {
    currentPath = currentPath.replace('[...slug]', router.query.slug[0])
  } else {
    currentPath = currentPath.replace('[slug]', router.query.slug as string)
  }

  const currentPageId = currentPath.slice(1)
  const allNotPending = allDocsRoutes.filter((x) => !x.pending)
  const currentPageIndex = allNotPending.findIndex((page) => page.slug === currentPageId)
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

  return (
    <DocsPageTheme key={isOpen}>
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
              <NextLink href="/" passHref>
                <YStack tag="a">
                  <span
                    className="clip-invisible"
                    style={{
                      position: 'absolute',
                      width: 1,
                      height: 1,
                      padding: 0,
                      margin: -1,
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      border: 0,
                    }}
                  >
                    Homepage
                  </span>
                  <LogoIcon downscale={2} />
                </YStack>
              </NextLink>

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
                <Button
                  onPress={() => {
                    setIsOpen((x) => !x)
                  }}
                  theme={isOpen ? 'active' : undefined}
                >
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
              {docsRoutes.map((section, i) => (
                <YStack key={`${section.label}${i}`} mb="$4">
                  <NavHeading>{section.label}</NavHeading>
                  {section.pages.map((page) => {
                    return (
                      <DocsRouteNavItem
                        key={page.slug}
                        href={`/${page.slug}`}
                        active={currentPath === `/${page.slug}`}
                        pending={page.pending}
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
                <DocsRouteNavItem href="https://github.com/tamagui/tamagui">
                  GitHub
                  <ExternalIcon />
                </DocsRouteNavItem>
                <DocsRouteNavItem href="https://twitter.com/tamagui_dev">
                  Twitter
                  <ExternalIcon />
                </DocsRouteNavItem>
                <DocsRouteNavItem href="https://discord.gg/uUtvv6GM">
                  Discord
                  <ExternalIcon />
                </DocsRouteNavItem>
              </YStack>

              <YStack
                height="$5"
                $gtSm={{
                  height: '$8',
                }}
              />
            </YStack>
          </ScrollView>
        </YStack>

        <YStack
          maxWidth="100%"
          flex={1}
          py="$5"
          $gtSm={{
            pt: '$9',
            pb: '$9',
            pl: 250,
            pr: 0,
          }}
          $gtLg={{
            pr: 250,
          }}
        >
          <DocsPageContainer>{children}</DocsPageContainer>

          <DocsPageContainer>
            {(previous || next) && (
              <XStack aria-label="Pagination navigation" my="$9" jc="space-between" space>
                {previous && (
                  <NextLink href={`/${previous.slug}`} passHref>
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
                  <NextLink href={`/${next.slug}`} passHref>
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
          </DocsPageContainer>

          <DocsPageContainer my="$3">
            <Link
              href={editUrl}
              title="Edit this page on GitHub."
              rel="noopener noreferrer"
              target="_blank"
            >
              Edit this page on GitHub.
            </Link>
          </DocsPageContainer>
        </YStack>
      </YStack>
    </DocsPageTheme>
  )
}

const DocsPageTheme = (props) => {
  const [tint] = useTint()
  return <Theme name={tint}>{React.useMemo(() => props.children, [])}</Theme>
}

type NavItemProps = {
  children: React.ReactNode
  active?: boolean
  href: string
  pending?: boolean
}

function DocsRouteNavItem({ children, active, href, pending, ...props }: NavItemProps) {
  const isExternal = href.startsWith('http')

  return (
    <NextLink href={href} passHref>
      <XStack
        {...props}
        {...(isExternal ? { href, target: '_blank', rel: 'noopener noreferrer' } : {})}
        tag="a"
        display="flex"
        ai="center"
        py="$1"
        px="$5"
        opacity={pending ? 0.5 : 1}
        hoverStyle={{
          backgroundColor: '$bg3',
        }}
        pressStyle={{
          backgroundColor: '$bg2',
        }}
        userSelect="none"
        minHeight="$6"
        {...(active && {
          backgroundColor: '$bg3',
          hoverStyle: {
            backgroundColor: '$bg3',
          },
        })}
        // transition={'background-color 50ms linear'
        // '&:hover': {
        //   backgroundColor: active ? '$violet5' : '$violet4',
        // }}
      >
        <Paragraph
          size="$2"
          color="$color4"
          {...(active && {
            color: '$color2',
          })}
        >
          {children}
        </Paragraph>
        {!!pending ? (
          <>
            <XStack flex={1} />
            <Paragraph size="$1" px="$2" py="$1" bc="$bg2" borderRadius="$3" color="$color3">
              WIP
            </Paragraph>
          </>
        ) : null}
      </XStack>
    </NextLink>
  )
}

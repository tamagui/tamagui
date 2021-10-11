import * as React from 'react'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { Text, Box, VStack, Button, Paragraph } from 'snackui'
const Link = Paragraph
import { PeachesLogo } from '@components/PeachesLogo'
import { ThemeToggle } from '@components/ThemeToggle'
import { allDocsRoutes, docsRoutes } from '@lib/docsRoutes'
import { HamburgerMenuIcon } from '@modulz/radix-icons'
import { ExternalIcon } from './ExternalIcon'

export function DocsPage({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [isOpen, setIsOpen] = React.useState(false)

  const currentPath = router.pathname.replace('[slug]', router.query.slug as string)
  const currentPageId = currentPath.substr(1)
  const currentPageIndex = allDocsRoutes.findIndex((page) => page.slug === currentPageId)

  const previous = allDocsRoutes[currentPageIndex - 1]
  const next = allDocsRoutes[currentPageIndex + 1]

  const GITHUB_URL = 'https://github.com'
  const REPO_NAME = 'snackui/snackui'
  const editUrl = `${GITHUB_URL}/${REPO_NAME}/edit/master/data${currentPath}.mdx`

  React.useEffect(() => {
    const handleRouteChange = () => {
      setIsOpen(false)
    }

    router.events.on('routeChangeStart', handleRouteChange)

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method:
    return () => {
      router.events.off('routeChangeStart', handleRouteChange)
    }
  }, [])

  return (
    <VStack
      css={{
        flexDirection: 'column',
        '@bp2': {
          flexDirection: 'row',
        },
      }}
    >
      <Box
        css={{
          width: '100%',
          maxHeight: 'auto',
          borderBottom: '1px solid',
          borderColor: '$slate6',
          WebkitOverflowScrolling: 'touch',
          overflowX: 'hidden',

          '@bp2': {
            position: 'fixed',
            top: 0,
            left: 0,
            bottom: 0,
            width: '250px',
            borderRight: '1px solid',
            borderBottom: '0',
            borderColor: '$slate6',
          },
        }}
      >
        <ScrollArea>
          <VStack css={{ alignItems: 'center', p: '$4' }}>
            <NextLink href="/" passHref>
              <Box
                as="a"
                css={{
                  color: '$hiContrast',
                  display: 'inline-flex',
                  '&:focus': { boxShadow: 'none' },
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    width: 1,
                    height: 1,
                    padding: 0,
                    margin: -1,
                    overflow: 'hidden',
                    clip: 'rect(0, 0, 0, 0)',
                    whiteSpace: 'nowrap',
                    border: 0,
                  }}
                >
                  Homepage
                </span>
                <PeachesLogo />
              </Box>
            </NextLink>

            <ThemeToggle css={{ ml: 'auto' }} />
            <Box css={{ ml: '$2', '@bp2': { display: 'none' } }}>
              <Button
                variant="ghost"
                onClick={() => setIsOpen(!isOpen)}
                state={isOpen ? 'active' : undefined}
              >
                <HamburgerMenuIcon />
              </Button>
            </Box>
          </VStack>

          <Box
            css={{
              display: isOpen ? 'block' : 'none',
              '@bp2': {
                display: 'block',
              },
            }}
          >
            {docsRoutes.map((section) => (
              <Box key={section.label} css={{ mb: '$4' }}>
                <NavHeading>{section.label}</NavHeading>
                {section.pages.map((page) => (
                  <NavItem
                    key={page.slug}
                    href={`/${page.slug}`}
                    active={currentPath === `/${page.slug}`}
                  >
                    <Text size="2" css={{ color: 'inherit', lineHeight: '1' }}>
                      {page.title}
                    </Text>
                  </NavItem>
                ))}
              </Box>
            ))}

            <NavHeading>Community</NavHeading>
            <NavItem href="/blog">
              <Text size="2" css={{ color: 'inherit', lineHeight: '1' }}>
                Blog
              </Text>
            </NavItem>
            <NavItem href="https://github.com/snackui/snackui">
              <Text size="2" css={{ color: 'inherit', lineHeight: '1' }}>
                GitHub
              </Text>
              <Box css={{ ml: '$1', color: '$slate8' }}>
                <ExternalIcon />
              </Box>
            </NavItem>
            <NavItem href="https://twitter.com/peachesjs">
              <Text size="2" css={{ color: 'inherit', lineHeight: '1' }}>
                Twitter
              </Text>
              <Box css={{ ml: '$1', color: '$slate8' }}>
                <ExternalIcon />
              </Box>
            </NavItem>
            <NavItem href="https://discord.com/invite/H4eG3Mk">
              <Text size="2" css={{ color: 'inherit', lineHeight: '1' }}>
                Discord
              </Text>
              <Box css={{ ml: '$1', color: '$slate8' }}>
                <ExternalIcon />
              </Box>
            </NavItem>
            <Box css={{ height: '$5', '@bp2': { height: '$8' } }} />
          </Box>
        </ScrollArea>
      </Box>

      <Box
        css={{
          maxWidth: '100%',
          flex: 1,
          py: '$5',
          '@bp2': { pt: '$8', pb: '$9', pl: '250px' },
          '@bp3': { pr: '250px' },
        }}
      >
        <VStack size="3" css={{ maxWidth: '780px' }}>
          {children}
        </VStack>

        <VStack size="3" css={{ maxWidth: '780px' }}>
          {(previous || next) && (
            <VStack
              aria-label="Pagination navigation"
              css={{
                justifyContent: 'space-between',
                my: '$9',
              }}
            >
              {previous && (
                <Box>
                  <NextLink href={`/${previous.slug}`} passHref>
                    <Box
                      as="a"
                      aria-label={`Previous page: ${previous.title}`}
                      css={{
                        color: '$blue11',
                        textDecoration: 'none',
                        alignItems: 'center',
                      }}
                    >
                      <Box css={{ mb: '$2' }}>
                        <Text size="3" css={{ color: '$slate11' }}>
                          Previous
                        </Text>
                      </Box>
                      <Text size="5" css={{ color: 'inherit' }}>
                        {previous.title}
                      </Text>
                    </Box>
                  </NextLink>
                </Box>
              )}
              {next && (
                <Box css={{ ml: 'auto' }}>
                  <NextLink href={`/${next.slug}`} passHref>
                    <Box
                      as="a"
                      aria-label={`Previous page: ${next.title}`}
                      css={{
                        color: '$blue11',
                        textDecoration: 'none',
                        textAlign: 'right',
                      }}
                    >
                      <Box css={{ mb: '$2' }}>
                        <Text size="3" css={{ color: '$slate11' }}>
                          Next
                        </Text>
                      </Box>
                      <Text size="5" css={{ color: 'inherit' }}>
                        {next.title}
                      </Text>
                    </Box>
                  </NextLink>
                </Box>
              )}
            </VStack>
          )}
        </VStack>
        <VStack size="3" css={{ maxWidth: '780px', my: '$9' }}>
          <Text size="3">
            <Link
              href={editUrl}
              title="Edit this page on GitHub."
              rel="noopener noreferrer"
              target="_blank"
              variant="subtle"
            >
              Edit this page on GitHub.
            </Link>
          </Text>
        </VStack>
      </Box>
    </VStack>
  )
}

function NavHeading({ children }: { children: React.ReactNode }) {
  return (
    <Text
      as="h4"
      size="3"
      css={{
        fontWeight: 500,
        px: '$5',
        py: '$2',
      }}
    >
      {children}
    </Text>
  )
}

type NavItemProps = { children: React.ReactNode; active?: boolean; href: string }

function NavItem({ children, active, href, ...props }: NavItemProps) {
  const isExternal = href.startsWith('http')

  return (
    <Box
      as={isExternal ? 'span' : (NextLink as any)}
      {...(isExternal ? {} : { href, passHref: true })}
    >
      <Box
        {...props}
        {...(isExternal ? { href, target: '_blank', rel: 'noopener noreferrer' } : {})}
        as="a"
        css={{
          display: 'flex',
          alignItems: 'center',
          textDecoration: 'none',
          color: '$hiContrast',
          py: '$2',
          px: '$5',
          backgroundColor: active ? '$violet5' : 'transparent',
          userSelect: 'none',
          minHeight: '$6',
          transition: 'background-color 50ms linear',
          '&:hover': {
            backgroundColor: active ? '$violet5' : '$violet4',
          },
        }}
      >
        {children}
      </Box>
    </Box>
  )
}

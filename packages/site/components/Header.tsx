import { PeachesLogo } from '@components/PeachesLogo'
import { ThemeToggle } from '@components/ThemeToggle'
import NextLink from 'next/link'
import { Box, HStack, Paragraph } from 'snackui'

export function Header() {
  return (
    <HStack
      paddingVertical={10}
      paddingHorizontal={10}
      justifyContent="space-between"
      position="relative"
      zIndex={1}
      as="header"
    >
      <NextLink href="/" passHref>
        <Box
          as="a"
          css={{
            color: '$hiContrast',
            display: 'inline-flex',
            '&:focus': {
              boxShadow: 'none',
            },
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
            Peaches homepage
          </span>
          <PeachesLogo />
        </Box>
      </NextLink>
      <HStack as="nav" alignItems="center" spacing>
        <NextLink href="/docs/installation" passHref>
          <Paragraph>Docs</Paragraph>
        </NextLink>
        <NextLink href="/blog" passHref>
          <Paragraph>Blog</Paragraph>
        </NextLink>
        <NextLink
          href="https://github.com/snackui/snackui"
          variant="subtle"
          css={{
            mr: '$5',
            display: 'none',
            '@bp1': { display: 'block' },
            '@bp2': { mr: '$7' },
          }}
        >
          <Paragraph>GitHub</Paragraph>
        </NextLink>
        <NextLink
          href="https://discord.com/invite/H4eG3Mk"
          variant="subtle"
          css={{ mr: '$5', '@bp2': { mr: '$7' } }}
        >
          <Paragraph>Discord</Paragraph>
        </NextLink>
        <ThemeToggle />
      </HStack>
    </HStack>
  )
}

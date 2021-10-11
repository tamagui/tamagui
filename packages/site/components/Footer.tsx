import React from 'react'
import NextLink from 'next/link'
import { Box, VStack, Grid, Text, Divider, Paragraph } from 'snackui'
import { PeachesLogo } from '@components/PeachesLogo'
import { ExternalIcon } from './ExternalIcon'

const Link = Paragraph

export const Footer = () => {
  return (
    <Box>
      <VStack justifyContent="center">
        <Divider />
      </VStack>
      <VStack flex={3}>
        <Grid
        // css={{
        //   gridTemplateColumns: 'repeat(1, 1fr)',
        //   gap: '$6',
        //   '& ul': { listStyle: 'none', margin: '0', padding: '0' },
        //   '@bp2': {
        //     gridTemplateColumns: 'repeat(4, 1fr)',
        //     gap: '$3',
        //   },
        // }}
        >
          <VStack
            alignItems="center"
            // css={{
            //   alignItems: 'center',
            //   '@bp2': {
            //     flexDirection: 'column',
            //     alignItems: 'start',
            //   },
            // }}
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
                  homepage
                </span>
                <PeachesLogo />
              </Box>
            </NextLink>
            <Paragraph>
              by <NextLink href="https://twitter.com/natebirdman">nate</NextLink>.
            </Paragraph>
          </VStack>
          <Box>
            <Paragraph>Overview</Paragraph>
            <ul>
              <li>
                <Paragraph size="3">
                  <NextLink href="/docs/introduction" passHref>
                    <Text variant="subtle">Introduction</Text>
                  </NextLink>
                </Paragraph>
              </li>
              <li>
                <Paragraph size="3">
                  <NextLink href="/docs/tutorials" passHref>
                    <Text variant="subtle">Tutorials</Text>
                  </NextLink>
                </Paragraph>
              </li>
              <li>
                <Paragraph size="3">
                  <NextLink href="/docs/api" passHref>
                    <Text variant="subtle">API</Text>
                  </NextLink>
                </Paragraph>
              </li>
              <li>
                <Paragraph size="3">
                  <NextLink href="/docs/frequently-asked-questions" passHref>
                    <Text variant="subtle">FAQ</Text>
                  </NextLink>
                </Paragraph>
              </li>
            </ul>
          </Box>
          <Box>
            <Paragraph>Docs</Paragraph>
            <ul>
              <li>
                <Paragraph size="3">
                  <NextLink href="/docs/installation" passHref>
                    <Text variant="subtle">Installation</Text>
                  </NextLink>
                </Paragraph>
              </li>
              <li>
                <Paragraph size="3">
                  <NextLink href="/docs/styling" passHref>
                    <Text variant="subtle">Styling</Text>
                  </NextLink>
                </Paragraph>
              </li>
              <li>
                <Paragraph size="3">
                  <NextLink href="/docs/variants" passHref>
                    <Text variant="subtle">Variants</Text>
                  </NextLink>
                </Paragraph>
              </li>
              <li>
                <Paragraph size="3">
                  <NextLink href="/docs/tokens" passHref>
                    <Text variant="subtle">Configuration</Text>
                  </NextLink>
                </Paragraph>
              </li>
            </ul>
          </Box>
          <Box>
            <Text size="3" css={{ fontWeight: 500, lineHeight: '20px' }}>
              Community
            </Text>
            <ul>
              <li>
                <Paragraph size="3">
                  <NextLink href="/blog" passHref>
                    <Text variant="subtle">Blog</Text>
                  </NextLink>
                </Paragraph>
              </li>
              <li>
                <Paragraph size="3">
                  <Link
                    variant="subtle"
                    href="https://github.com/snackui/snackui"
                    css={{ display: 'inline-flex', alignItems: 'center' }}
                  >
                    GitHub
                    <VStack as="span" css={{ ml: '$1', color: '$slate8' }}>
                      <ExternalIcon />
                    </VStack>
                  </Link>
                </Paragraph>
              </li>
              <li>
                <Paragraph size="3">
                  <Link
                    variant="subtle"
                    href="https://twitter.com/peachesjs"
                    css={{ display: 'inline-flex', alignItems: 'center' }}
                  >
                    Twitter
                    <VStack as="span" css={{ ml: '$1', color: '$slate8' }}>
                      <ExternalIcon />
                    </VStack>
                  </Link>
                </Paragraph>
              </li>
              <li>
                <Paragraph size="3">
                  <Link
                    variant="subtle"
                    href="https://discord.com/invite/H4eG3Mk"
                    css={{ display: 'inline-flex', alignItems: 'center' }}
                  >
                    Discord
                    <VStack as="span" css={{ ml: '$1', color: '$slate8' }}>
                      <ExternalIcon />
                    </VStack>
                  </Link>
                </Paragraph>
              </li>
            </ul>
          </Box>
        </Grid>
      </VStack>
    </Box>
  )
}

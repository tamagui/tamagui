import { HeaderIndependent } from '@components/Header'
import { TitleAndMetaTags } from '@components/TitleAndMetaTags'
import { authors } from '@data/authors'
import { getAllFrontmatter } from '@lib/mdx'
import { format, parseISO } from 'date-fns'
import NextLink from 'next/link'
import React from 'react'
import {
  H1,
  H2,
  H3,
  Paragraph,
  SizableText,
  Spacer,
  Square,
  Text,
  ThemeInverse,
  XStack,
  YStack,
} from 'tamagui'

import { Card } from '../../components/Card'
import { Container, ContainerLarge } from '../../components/Container'

export default function Blog({ frontmatters }) {
  return (
    <>
      <TitleAndMetaTags title="Blog — Tamagui" description="What's up with Tamagui." />
      <HeaderIndependent />
      <Spacer size="$7" />
      <Container>
        <YStack space="$4" ai="center">
          <H2 size="$8" theme="alt2" fontFamily="$silkscreen">
            What's new
          </H2>
        </YStack>
      </Container>
      <ContainerLarge mt="$6" mb="$7" space="$2">
        <XStack flexWrap="wrap" jc="space-between">
          {frontmatters.map((frontmatter) => (
            <NextLink legacyBehavior key={frontmatter.title} href={frontmatter.slug} passHref>
              <Card
                tag="a"
                width="33.33%"
                maxWidth="calc(33.33% - var(--space-6))"
                p="$4"
                mb="$2"
                mx="$1"
                my="$4"
                $sm={{ width: 'auto', maxWidth: 'auto', minWidth: '100%' }}
                $md={{
                  width: '50%',
                  maxWidth: 'calc(50% - var(--space-6))',
                }}
              >
                <YStack space="$3">
                  <H3 fontFamily="$silkscreen" size="$8" color="$color" cursor="pointer" ls={0}>
                    {frontmatter.title}
                  </H3>

                  <YStack space="$4">
                    <XStack>
                      <Paragraph cursor="inherit" tag="time" size="$3" theme="alt2">
                        {format(parseISO(frontmatter.publishedAt), 'MMMM yyyy')} by
                      </Paragraph>
                      <Paragraph cursor="inherit" theme="alt1" size="$3">
                        &nbsp;{authors[frontmatter.by].name}
                      </Paragraph>
                      {/* {frontmatter.type === 'changelog' && <Badge css={{ ml: '$2' }}>Changelog</Badge>} */}
                    </XStack>

                    <Paragraph size="$6" cursor="inherit" theme="alt2">
                      {frontmatter.description}
                    </Paragraph>
                  </YStack>
                </YStack>
              </Card>
            </NextLink>
          ))}
        </XStack>
      </ContainerLarge>
    </>
  )
}

export function getStaticProps() {
  const frontmatters = getAllFrontmatter('blog')
  const sortedFrontmatters = frontmatters.sort(
    (a, b) => Number(new Date(b.publishedAt || '')) - Number(new Date(a.publishedAt || ''))
  )
  return { props: { frontmatters: sortedFrontmatters } }
}

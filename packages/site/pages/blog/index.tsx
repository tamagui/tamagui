import { Header } from '@components/Header'
import { TitleAndMetaTags } from '@components/TitleAndMetaTags'
import { authors } from '@data/authors'
import { getAllFrontmatter } from '@lib/mdx'
import { format, parseISO } from 'date-fns'
import React from 'react'
import { H1, H2, H3, Paragraph, XStack, YStack } from 'tamagui'

import { Container } from '../../components/Container'
import { Link } from '../../components/Link'

export default function Blog({ frontmatters }) {
  return (
    <>
      <TitleAndMetaTags title="Blog — Tamagui" description="What's up with Tamagui." />
      <Header />
      <Container ai="center">
        <H1 size="$9" letterSpacing={-1} mb={-15}>
          Blog
        </H1>
        <Paragraph tag="h2" color="$color2" fontWeight="300" size="$6">
          What's new with Tamagui
        </Paragraph>
      </Container>
      <Container mt="$6" mb="$7">
        {frontmatters.map((frontmatter) => (
          <YStack key={frontmatter.title}>
            <YStack mb="$7" space="$2">
              <Link href={frontmatter.slug}>
                <H3 size="$8">{frontmatter.title}</H3>
              </Link>

              <XStack>
                <Paragraph tag="time" size="$2" color="$color3">
                  {format(parseISO(frontmatter.publishedAt), 'MMMM yyyy')}
                </Paragraph>
                <Paragraph color="$color3" size="$2">
                  &nbsp;by {authors[frontmatter.by].name}
                </Paragraph>
                {frontmatter.type === 'changelog' && <Badge css={{ ml: '$2' }}>Changelog</Badge>}
              </XStack>

              <Paragraph color="$color3">{frontmatter.description}</Paragraph>
            </YStack>
          </YStack>
        ))}
      </Container>
    </>
  )
}

export function getStaticProps() {
  const frontmatters = getAllFrontmatter('blog')
  const sortedFrontmatters = frontmatters.sort(
    (a, b) => Number(new Date(b.publishedAt)) - Number(new Date(a.publishedAt))
  )
  return { props: { frontmatters: sortedFrontmatters } }
}

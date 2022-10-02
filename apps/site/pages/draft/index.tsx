import { HeaderIndependent } from '@components/Header'
import { TitleAndMetaTags } from '@components/TitleAndMetaTags'
import { authors } from '@data/authors'
import { getAllFrontmatter } from '@lib/mdx'
import { format, parseISO } from 'date-fns'
import Link from 'next/link'
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
      <ContainerLarge mt="$6" mb="$7" space="$2">
        <YStack space="$8">
          {frontmatters.map((frontmatter) => (
            <Link key={frontmatter.title} href={frontmatter.slug} passHref>
              <YStack space="$2">
                <H3 fontFamily="$silkscreen" size="$9" color="$color" cursor="pointer">
                  {frontmatter.title}
                </H3>

                <YStack>
                  <Paragraph cursor="inherit" tag="time" size="$5" theme="alt2">
                    {format(parseISO(frontmatter.publishedAt), 'MMMM yyyy')}
                  </Paragraph>
                  <Paragraph cursor="inherit" fow="800" theme="alt2" size="$4">
                    &nbsp;by {authors[frontmatter.by].name}
                  </Paragraph>
                  {/* {frontmatter.type === 'changelog' && <Badge css={{ ml: '$2' }}>Changelog</Badge>} */}
                </YStack>

                <Paragraph size="$6" cursor="inherit" theme="alt2">
                  {frontmatter.description}
                </Paragraph>
              </YStack>
            </Link>
          ))}
        </YStack>
      </ContainerLarge>
    </>
  )
}

export function getStaticProps() {
  const frontmatters = getAllFrontmatter('draft')
  const sortedFrontmatters = frontmatters.sort(
    (a, b) => Number(new Date(b.publishedAt || '')) - Number(new Date(a.publishedAt || ''))
  )
  return { props: { frontmatters: sortedFrontmatters } }
}

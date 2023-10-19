import { authors } from '@data/authors'
import { getAllFrontmatter } from '@lib/mdx'
import { NextSeo } from 'next-seo'
import { H3, Paragraph, YStack } from 'tamagui'

import { ContainerLarge } from '../../components/Container'
import { NextLink } from '../../components/NextLink'

export default function Blog({ frontmatters }) {
  return (
    <>
      <NextSeo title="Blog — Tamagui" description="What's up with Tamagui." />
      <ContainerLarge mt="$6" mb="$7" space="$2">
        <YStack space="$8">
          {frontmatters.map((frontmatter) => (
            <NextLink
              legacyBehavior
              key={frontmatter.title}
              href={frontmatter.slug}
              passHref
            >
              <YStack space="$2">
                <H3 fontFamily="$silkscreen" size="$9" color="$color" cursor="pointer">
                  {frontmatter.title}
                </H3>

                <YStack>
                  <Paragraph cursor="inherit" tag="time" size="$5" theme="alt2">
                    {Intl.DateTimeFormat('en-US', {
                      weekday: 'short',
                      year: 'numeric',
                      day: 'numeric',
                    }).format(new Date(frontmatter.publishedAt || ''))}
                  </Paragraph>
                  <Paragraph cursor="inherit" fow="700" theme="alt2" size="$4">
                    &nbsp;by {authors[frontmatter.by].name}
                  </Paragraph>
                  {/* {frontmatter.type === 'changelog' && <Badge css={{ ml: '$2' }}>Changelog</Badge>} */}
                </YStack>

                <Paragraph size="$6" cursor="inherit" theme="alt2">
                  {frontmatter.description}
                </Paragraph>
              </YStack>
            </NextLink>
          ))}
        </YStack>
      </ContainerLarge>
    </>
  )
}

export function getStaticProps() {
  const frontmatters = getAllFrontmatter('draft')
  const sortedFrontmatters = frontmatters.sort(
    (a, b) =>
      Number(new Date(b.publishedAt || '')) - Number(new Date(a.publishedAt || ''))
  )
  return { props: { frontmatters: sortedFrontmatters } }
}

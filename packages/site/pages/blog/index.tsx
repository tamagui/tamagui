import { HeaderIndependent } from '@components/Header'
import { TitleAndMetaTags } from '@components/TitleAndMetaTags'
import { authors } from '@data/authors'
import { getAllFrontmatter } from '@lib/mdx'
import { format, parseISO } from 'date-fns'
import Link from 'next/link'
import { H1, H2, H3, Paragraph, Spacer, XStack, YStack } from 'tamagui'

import { Card } from '../../components/Card'
import { Container, ContainerLarge } from '../../components/Container'

export default function Blog({ frontmatters }) {
  return (
    <>
      <TitleAndMetaTags title="Blog — Tamagui" description="What's up with Tamagui." />
      <HeaderIndependent />
      <Spacer size="$7" />
      <Container>
        <YStack space="$2" ai="center">
          <H1>Blog</H1>
          <H2 size="$8" theme="alt3" fontWeight="300">
            What's new with Tamagui
          </H2>
        </YStack>
      </Container>
      <ContainerLarge mt="$6" mb="$7" space="$2">
        <XStack flexWrap="wrap" space="$4">
          {frontmatters.map((frontmatter) => (
            <Link key={frontmatter.title} href={frontmatter.slug} passHref>
              <Card
                tag="a"
                width="33.33%"
                maxWidth="calc(33.33% - var(--space-2))"
                $md={{
                  width: '50%',
                  maxWidth: 'calc(50% - var(--space-2))',
                }}
                $sm={{ width: 'auto', maxWidth: 'auto', minWidth: '100%' }}
                p="$4"
                mb="$6"
              >
                <YStack space="$2">
                  <YStack>
                    <H3 size="$8" color="$color" cursor="pointer">
                      {frontmatter.title}
                    </H3>
                    <XStack>
                      <Paragraph cursor="inherit" tag="time" size="$3" theme="alt2">
                        {format(parseISO(frontmatter.publishedAt), 'MMMM yyyy')}
                      </Paragraph>
                      <Paragraph cursor="inherit" fow="800" theme="alt2" size="$3">
                        &nbsp;by {authors[frontmatter.by].name}
                      </Paragraph>
                      {/* {frontmatter.type === 'changelog' && <Badge css={{ ml: '$2' }}>Changelog</Badge>} */}
                    </XStack>
                  </YStack>

                  <Paragraph cursor="inherit" theme="alt1">
                    {frontmatter.description}
                  </Paragraph>
                </YStack>
              </Card>
            </Link>
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

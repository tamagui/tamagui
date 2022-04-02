import { HeaderIndependent } from '@components/Header'
import { TitleAndMetaTags } from '@components/TitleAndMetaTags'
import { authors } from '@data/authors'
import { getAllFrontmatter } from '@lib/mdx'
import { format, parseISO } from 'date-fns'
import { H1, H2, H3, Paragraph, ThemeReset, XStack, YStack } from 'tamagui'

import { Container } from '../../components/Container'
import { Link } from '../../components/Link'

export default function Blog({ frontmatters }) {
  return (
    <>
      <TitleAndMetaTags title="Blog — Tamagui" description="What's up with Tamagui." />
      <HeaderIndependent />
      <Container>
        <YStack space="$4" ai="center">
          <H1 size="$9" letterSpacing={-1} mb={-15}>
            Blog
          </H1>
          <H2 size="$8" theme="alt3" fontWeight="300">
            What's new with Tamagui
          </H2>
        </YStack>
      </Container>
      <Container mt="$6" mb="$7" space="$2">
        {frontmatters.map((frontmatter) => (
          <Link key={frontmatter.title} href={frontmatter.slug}>
            <ThemeReset>
              <YStack
                bc="$background"
                p="$4"
                br="$4"
                hoverStyle={{
                  bc: '$backgroundHover',
                }}
              >
                <YStack space="$2">
                  <YStack>
                    <H3
                      size="$8"
                      color="$color"
                      cursor="pointer"
                      hoverStyle={{
                        color: '$colorHover',
                      }}
                    >
                      {frontmatter.title}
                    </H3>
                    <XStack>
                      <Paragraph tag="time" size="$3" theme="alt2">
                        {format(parseISO(frontmatter.publishedAt), 'MMMM yyyy')}
                      </Paragraph>
                      <Paragraph fow="800" theme="alt2" size="$3">
                        &nbsp;by {authors[frontmatter.by].name}
                      </Paragraph>
                      {/* {frontmatter.type === 'changelog' && <Badge css={{ ml: '$2' }}>Changelog</Badge>} */}
                    </XStack>
                  </YStack>

                  <Paragraph theme="alt1">{frontmatter.description}</Paragraph>
                </YStack>
              </YStack>
            </ThemeReset>
          </Link>
        ))}
      </Container>
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

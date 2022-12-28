import { TitleAndMetaTags } from '@components/TitleAndMetaTags'
import { authors } from '@data/authors'
import { getAllFrontmatter } from '@lib/mdx'
import { NextLink } from 'components/NextLink'
import { format, parseISO } from 'date-fns'
import { H2, Paragraph, Spacer, XStack } from 'tamagui'

import { ContainerLarge } from '../../components/Container'
import { TamaguiCard } from '../../components/TamaguiCard'

export default function Blog({ frontmatters }) {
  return (
    <>
      <TitleAndMetaTags title="Blog — Tamagui" description="What's up with Tamagui." />
      <Spacer size="$7" />
      <H2 als="center" size="$8" theme="alt2" fontFamily="$silkscreen">
        Blog
      </H2>
      <ContainerLarge mt="$6" mb="$7" space="$2">
        <XStack flexWrap="wrap" jc="space-between">
          {frontmatters.map((frontmatter) => (
            <NextLink key={frontmatter.title} href={frontmatter.slug} passHref>
              <TamaguiCard
                title={frontmatter.title}
                subTitle={
                  <XStack o={0.5}>
                    <Paragraph cursor="inherit" tag="time" size="$3" theme="alt2">
                      {format(parseISO(frontmatter.publishedAt), 'MMMM yyyy')} by
                    </Paragraph>
                    <Paragraph cursor="inherit" theme="alt1" size="$3">
                      &nbsp;{authors[frontmatter.by].name}
                    </Paragraph>
                    {/* {frontmatter.type === 'changelog' && <Badge css={{ ml: '$2' }}>Changelog</Badge>} */}
                  </XStack>
                }
              >
                {frontmatter.description}
              </TamaguiCard>
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
    (a, b) =>
      Number(new Date(b.publishedAt || '')) - Number(new Date(a.publishedAt || ''))
  )
  return { props: { frontmatters: sortedFrontmatters } }
}

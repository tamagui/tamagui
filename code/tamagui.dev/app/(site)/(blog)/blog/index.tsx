import { useLoader } from 'one'
import { H2, Paragraph, Spacer, XStack } from 'tamagui'
import { ContainerLarge } from '~/components/Containers'
import { Link } from '~/components/Link'
import { TamaguiCard } from '~/components/TamaguiCard'
import { authors } from '~/data/authors'
import { HeadInfo } from '~/components/HeadInfo'

export async function loader() {
  const { getAllFrontmatter } = await import('~/features/mdx/getMDXBySlug')
  const frontmatters = getAllFrontmatter('data/blog')
  const sortedFrontmatters = frontmatters
    .filter((x) => !x.draft)
    .sort(
      (a, b) =>
        Number(new Date(b.publishedAt || '')) - Number(new Date(a.publishedAt || ''))
    )
  return { frontmatters: sortedFrontmatters }
}

export default function Blog() {
  const { frontmatters } = useLoader(loader)

  return (
    <>
      <HeadInfo title="Blog — Tamagui" description="What's up with Tamagui." />
      <Spacer size="$7" />
      <ContainerLarge mb="$7">
        <H2 size="$8" color="$color9" fontFamily="$silkscreen">
          Blog
        </H2>
        <Spacer size="$6" />
        <XStack flexWrap="wrap" gap="$4" $md={{ flexDirection: 'column' }}>
          {frontmatters.map((frontmatter) => (
            <Link asChild key={frontmatter.title} href={`/blog/${frontmatter.slug}`}>
              <TamaguiCard
                title={frontmatter.title}
                render="a"
                width="calc(50% - var(--space-2))"
                minH="max-content"
                $md={{
                  width: '100%',
                  maxWidth: '100%',
                  flex: 'unset',
                  flexShrink: 0,
                }}
                $sm={{
                  width: '100%',
                  maxWidth: '100%',
                  flex: 'unset',
                  flexShrink: 0,
                }}
                subTitle={
                  <Paragraph opacity={0.5} cursor="inherit" color="$color10" size="$3">
                    {Intl.DateTimeFormat('en-US', {
                      month: 'short',
                      year: 'numeric',
                      day: 'numeric',
                    }).format(new Date(frontmatter.publishedAt || ''))}{' '}
                    by &nbsp;
                    {authors[frontmatter.by || '']?.name}
                  </Paragraph>
                }
              >
                {frontmatter.description}
              </TamaguiCard>
            </Link>
          ))}
        </XStack>
      </ContainerLarge>
    </>
  )
}

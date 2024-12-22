import { useLoader } from 'one'
import { H2, Paragraph, Spacer, XStack } from 'tamagui'
import { ContainerLarge } from '~/components/Containers'
import { Link } from '~/components/Link'
import { TamaguiCard } from '~/components/TamaguiCard'
import { authors } from '~/data/authors'
import { HeadInfo } from '~/components/HeadInfo'

export async function loader() {
  const { getAllFrontmatter } = await import('@tamagui/mdx-2')
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
      <H2 als="center" size="$8" theme="alt2" fontFamily="$silkscreen">
        Blog
      </H2>
      <ContainerLarge mt="$6" mb="$7">
        <XStack flexWrap="wrap" jc="space-between">
          {frontmatters.map((frontmatter) => (
            <Link asChild key={frontmatter.title} href={`/blog/${frontmatter.slug}`}>
              <TamaguiCard
                title={frontmatter.title}
                tag="a"
                subTitle={
                  <Paragraph o={0.5} cursor="inherit" theme="alt1" size="$3">
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

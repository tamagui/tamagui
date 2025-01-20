import { ThemeTint } from '@tamagui/logo'
import { getMDXComponent } from 'mdx-bundler/client'
import { useMemo } from 'react'
import { useLoader } from 'one'
import { HeadInfo } from '~/components/HeadInfo'
import { SubTitle, nbspLastWord } from '~/components/SubTitle'
import { DocsQuickNav } from '~/features/docs/DocsQuickNav'
import { components } from '~/features/mdx/MDXComponents'
import { getOgUrl } from '~/features/site/getOgUrl'
import { HomeH1 } from '~/features/site/home/HomeHeaders'

export async function generateStaticParams() {
  const { getAllFrontmatter } = await import('@tamagui/mdx-2')
  const frontmatters = getAllFrontmatter('data/docs/core')
  const paths = frontmatters.map(({ slug }) => ({
    slug: slug.replace(/.*docs\/core\//, ''),
  }))
  return paths
}

export async function loader({ params }) {
  const { getMDXBySlug } = await import('@tamagui/mdx-2')
  const { frontmatter, code } = await getMDXBySlug('data/docs/core', params.slug)
  return {
    frontmatter,
    code,
  }
}

export default function DocCorePage() {
  const { code, frontmatter } = useLoader(loader)
  const Component = useMemo(() => getMDXComponent(code), [code])

  console.log('frontmatter', frontmatter)

  return (
    <>
      <HeadInfo
        title={`${frontmatter.title}`}
        description={frontmatter.description}
        openGraph={{
          images: [
            {
              url: getOgUrl({
                title: frontmatter.title,
                description: frontmatter.description ?? '',
                category: 'intro',
              }),
            },
          ],
        }}
      />
      <HomeH1>{nbspLastWord(frontmatter.title)}</HomeH1>
      <SubTitle>{frontmatter.description || ''}</SubTitle>
      <ThemeTint>
        <Component components={components as any} />
      </ThemeTint>
      <DocsQuickNav />
    </>
  )
}

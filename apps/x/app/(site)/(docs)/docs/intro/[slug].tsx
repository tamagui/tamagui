import { ThemeTint } from '@tamagui/logo'
import { getAllFrontmatter, getMDXBySlug } from '@tamagui/mdx'
import { useLoader } from 'vxs'
import { getMDXComponent } from 'mdx-bundler/client'
import { useMemo } from 'react'
import { SubTitle, nbspLastWord } from '~/components/SubTitle'
import { DocsQuickNav } from '~/features/docs/DocsQuickNav'
import { components } from '~/features/mdx/MDXComponents'
import { HomeH1 } from '~/features/site/home/HomeHeaders'

export async function generateStaticParams() {
  const frontmatters = getAllFrontmatter('data/docs/intro')
  console.info('frontmatters', frontmatters)
  const paths = frontmatters.map(({ slug }) => ({
    slug: slug.replace(/.*docs\/intro\//, ''),
  }))
  return paths
}

export async function loader({ params }) {
  const { frontmatter, code } = await getMDXBySlug('data/docs/intro', params.slug)
  return {
    frontmatter,
    code,
    // examples: getCompilationExamples(),
  }
}

export default function DocIntroPage() {
  const { code, frontmatter } = useLoader(loader)
  console.log('??', code, frontmatter)
  const Component = useMemo(() => getMDXComponent(code), [code])

  return (
    <>
      {/* TODO */}
      {/* <NextSeo
        title={`${frontmatter.title} — Tamagui`}
        description={frontmatter.description}
        openGraph={{
          images: [
            {
              url: getOgUrl('default', {
                title: frontmatter.title,
                description: frontmatter.description ?? '',
                category: 'intro',
              }),
            },
          ],
        }}
      /> */}
      <HomeH1>{nbspLastWord(frontmatter.title)}</HomeH1>
      <SubTitle>{nbspLastWord(frontmatter.description || '')}</SubTitle>
      <ThemeTint>
        <Component components={components as any} />
      </ThemeTint>
      {/* frontmatter.slug */}
      <DocsQuickNav key={'ok'} />
    </>
  )
}

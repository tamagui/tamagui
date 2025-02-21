import { ThemeTint } from '@tamagui/logo'
import { getMDXComponent } from 'mdx-bundler/client'
import { useLoader } from 'one'
import { useMemo } from 'react'
import { HeadInfo } from '~/components/HeadInfo'
import { SubTitle, nbspLastWord } from '~/components/SubTitle'
import { TamaguiExamples } from '~/components/TamaguiExamples'
import { DocsQuickNav } from '~/features/docs/DocsQuickNav'
import { components } from '~/features/mdx/MDXComponents'
import { getOgUrl } from '~/features/site/getOgUrl'
import { HomeH1 } from '~/features/site/home/HomeHeaders'

export async function generateStaticParams() {
  const { getAllFrontmatter } = await import('@tamagui/mdx-2')
  const frontmatters = getAllFrontmatter('data/docs/intro')
  const paths = frontmatters.map(({ slug }) => ({
    slug: slug.replace(/.*docs\/intro\//, ''),
  }))
  return paths
}

export async function loader({ params }) {
  const { getMDXBySlug, getCompilationExamples } = await import('@tamagui/mdx-2')
  const { frontmatter, code } = await getMDXBySlug(`data/docs/intro`, params.slug)
  return {
    frontmatter,
    code,
    examples: getCompilationExamples(),
  }
}

export default function DocIntroPage() {
  const { code, frontmatter, examples } = useLoader(loader)

  if (!frontmatter || !code) {
    console.warn(`No frontmatter/code?`)
    return null
  }

  const Component = useMemo(() => getMDXComponent(code), [code])

  return (
    <>
      <HeadInfo
        title={`${frontmatter.title} — Tamagui`}
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
      <SubTitle>{nbspLastWord(frontmatter.description || '')}</SubTitle>
      <ThemeTint>
        <TamaguiExamples.Provider value={examples}>
          <Component components={components as any} />
        </TamaguiExamples.Provider>
      </ThemeTint>
      <DocsQuickNav />
    </>
  )
}

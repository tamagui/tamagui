import { ThemeTint } from '@tamagui/logo'
import { getMDXComponent } from 'mdx-bundler/client'
import { useLoader } from 'one'
import { useMemo } from 'react'
import { HeadInfo } from '~/components/HeadInfo'
import { SubTitle, nbspLastWord } from '~/components/SubTitle'
import { TamaguiExamples } from '~/components/TamaguiExamples'
import { DocsPageFrame } from '~/features/docs/DocsPageFrame'
import { useDocsMenu } from '~/features/docs/useDocsMenu'
import { components } from '~/features/mdx/MDXComponents'
import { getOgUrl } from '~/features/site/getOgUrl'
import { HomeH1 } from '~/features/site/home/HomeHeaders'

export async function generateStaticParams() {
  const { getAllFrontmatter } = await import('~/features/mdx/getMDXBySlug')
  const frontmatters = getAllFrontmatter('data/docs/intro')
  const paths = frontmatters.map(({ slug }) => ({
    slug: slug.replace(/.*docs\/intro\//, ''),
  }))
  return paths
}

export async function loader({ params }) {
  const { getMDXBySlug, getCompilationExamples } =
    await import('~/features/mdx/getMDXBySlug')
  const { frontmatter, code } = await getMDXBySlug(`data/docs/intro`, params.slug)
  return {
    frontmatter,
    code,
    examples: getCompilationExamples(),
  }
}

export default function DocIntroPage() {
  const { code, frontmatter, examples } = useLoader(loader)
  const { next, previous, currentPath, documentVersionPath } = useDocsMenu()

  if (!frontmatter || !code) {
    console.warn(`No frontmatter/code?`)
    return null
  }

  const Component = useMemo(() => getMDXComponent(code), [code])

  const GITHUB_URL = 'https://github.com'
  const REPO_NAME = 'tamagui/tamagui'
  const editUrl = `${GITHUB_URL}/${REPO_NAME}/edit/master/code/tamagui.dev/data${currentPath}${documentVersionPath}.mdx`

  return (
    <DocsPageFrame
      headings={frontmatter.headings}
      editUrl={editUrl}
      next={next}
      previous={previous}
    >
      <HeadInfo
        title={`${frontmatter.title} — Tamagui`}
        description={frontmatter.description ?? ''}
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
    </DocsPageFrame>
  )
}

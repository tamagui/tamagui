import { ThemeTint } from '@tamagui/logo'
import { Theme } from 'tamagui'
import { getMDXComponent } from 'mdx-bundler/client'
import React, { memo } from 'react'
import type { LoaderProps } from 'one'
import { useLoader } from 'one'
import { HeadInfo } from '~/components/HeadInfo'
import { DocsPageFrame } from '~/features/docs/DocsPageFrame'
import { MDXProvider } from '~/features/docs/MDXProvider'
import { MDXTabs } from '~/features/docs/MDXTabs'
import { useDocsMenu } from '~/features/docs/useDocsMenu'
import { useIsDocsTinted } from '~/features/docs/docsTint'
import { components } from '~/features/mdx/MDXComponents'
import { getOgUrl } from '~/features/site/getOgUrl'
import { nbspLastWord, SubTitle } from '../../../../components/SubTitle'
import { HomeH1 } from '../../../../features/site/home/HomeHeaders'

export async function generateStaticParams() {
  const { getAllFrontmatter } = await import('~/features/mdx/getMDXBySlug')
  const frontmatters = getAllFrontmatter('data/docs/components')
  const paths = frontmatters.map((frontmatter) => {
    return {
      subpath: frontmatter.slug.replace('data/docs/components/', ''),
    }
  })

  const latestVersionPaths = paths.map((path) => {
    const parts = path.subpath.split('/')
    const withoutVersion = parts.slice(0, parts.length - 1)
    return withoutVersion.join('/')
  })

  const deduped = [...new Set(latestVersionPaths)].map((subpath) => ({ subpath }))

  const allPaths = [...paths, ...deduped]

  return allPaths
}

export async function loader(props: LoaderProps) {
  const { getMDXBySlug, getAllVersionsFromPath } =
    await import('~/features/mdx/getMDXBySlug')

  const subpath = Array.isArray(props.params.subpath)
    ? props.params.subpath[0]
    : props.params.subpath

  const { frontmatter, code } = await getMDXBySlug('data/docs/components', subpath)
  const [componentName, componentVersion] = subpath.split('/')
  const versions = getAllVersionsFromPath(`data/docs/components/${componentName}`)
  return {
    frontmatter: {
      ...frontmatter,
      version: componentVersion || versions[0],
      versions: versions,
    },
    code,
  }
}

export function DocComponentsPage() {
  const { frontmatter, code } = useLoader(loader)
  const { next, previous, currentPath, documentVersionPath } = useDocsMenu()
  const Component = React.useMemo(() => getMDXComponent(code), [code])

  const getMDXPath = (path: string) => {
    if (path.startsWith('/ui/')) {
      const parts = path.split('/')
      const componentName = parts[2]
      return `/docs/components/${componentName}`
    }
    return `${path}${documentVersionPath}`
  }

  const GITHUB_URL = 'https://github.com'
  const REPO_NAME = 'tamagui/tamagui'
  const editUrl = `${GITHUB_URL}/${REPO_NAME}/edit/master/code/tamagui.dev/data${getMDXPath(currentPath)}.mdx`

  return (
    <DocsPageFrame
      headings={frontmatter.headings}
      editUrl={editUrl}
      next={next}
      previous={previous}
    >
      <HeadInfo
        title={`${frontmatter.title} | Tamagui — style library and UI kit for React Native and React Web`}
        description={frontmatter.description || 'UI Kit'}
        openGraph={{
          images: [
            {
              url:
                frontmatter.image ??
                getOgUrl({
                  type: 'component',
                  title: frontmatter.title,
                  demoName: frontmatter.demoName ?? undefined,
                  description: frontmatter.description ?? '',
                }),
              width: 1200,
              height: 630,
            },
          ],
        }}
      />

      <HomeH1>{nbspLastWord(frontmatter.title)}</HomeH1>

      <SubTitle>{nbspLastWord(frontmatter.description || '')}</SubTitle>

      <MDXProvider frontmatter={frontmatter}>
        <DocsThemeTint>
          <MDXTabs id="type" defaultValue="styled">
            <Component components={components as any} />
          </MDXTabs>
        </DocsThemeTint>
      </MDXProvider>
    </DocsPageFrame>
  )
}

const DocsThemeTint = memo(({ children }: { children: any }) => {
  const isTinted = useIsDocsTinted()
  if (!isTinted) {
    return <Theme name="gray">{children}</Theme>
  }
  return <ThemeTint>{children}</ThemeTint>
})

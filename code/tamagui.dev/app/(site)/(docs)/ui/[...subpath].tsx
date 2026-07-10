import { ThemeTint } from '@tamagui/logo'
import { Theme } from 'tamagui'
import { getMDXComponent } from '@vxrn/mdx-rust/client'
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
  const { isTailwindMode } = await import('~/features/docs/isTailwindMode')
  const tailwind = isTailwindMode(props)

  const subpath = Array.isArray(props.params.subpath)
    ? props.params.subpath.join('/')
    : props.params.subpath

  const { frontmatter, code } = await getMDXBySlug('data/docs/components', subpath, {
    tailwind,
  })
  const [componentName, componentVersion] = subpath.split('/')
  const versions = getAllVersionsFromPath(`data/docs/components/${componentName}`)
  return {
    frontmatter: {
      ...frontmatter,
      version: componentVersion || versions[0],
      versions: versions,
    },
    search: props.search,
    code,
  }
}

export function DocComponentsPage() {
  const { frontmatter, code, search } = useLoader(loader)
  const { next, previous } = useDocsMenu()
  const Component = React.useMemo(() => getMDXComponent(code), [code])

  const GITHUB_URL = 'https://github.com'
  const REPO_NAME = 'tamagui/tamagui'
  const editUrl = `${GITHUB_URL}/${REPO_NAME}/edit/master/code/tamagui.dev/${frontmatter.slug}.mdx`

  return (
    <DocsPageFrame
      headings={frontmatter.headings}
      editUrl={editUrl}
      next={next}
      previous={previous}
      frontmatter={frontmatter}
      initialSearch={search}
    >
      <HeadInfo
        title={`${frontmatter.title} | Tamagui — React Native UI kit with copy-paste composable components`}
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

import { ThemeTint } from '@tamagui/logo'
import { getAllFrontmatter, getAllVersionsFromPath, getMDXBySlug } from '@tamagui/mdx'
import type { LoaderProps } from 'vxs'
import { useLoader, useLocalSearchParams, usePathname, useRouter } from 'vxs'
import { getMDXComponent } from 'mdx-bundler/client'
import React, { useEffect, useState } from 'react'
import { DocsQuickNav } from '~/features/docs/DocsQuickNav'
import { MDXProvider } from '~/features/docs/MDXProvider'
import { MDXTabs } from '~/features/docs/MDXTabs'
import { listeners } from '~/features/docs/docsTint'
import { components } from '~/features/mdx/MDXComponents'

export async function generateStaticParams() {
  const frontmatters = getAllFrontmatter('data/docs/components')
  const paths = frontmatters.map((frontmatter) => {
    return {
      subpath: frontmatter.slug.replace('data/docs/components/', ''),
    }
  })

  const latestVersionPaths = paths.map((path) => {
    const parts = path.subpath.split('/')
    const withoutVersion = parts.slice(0, parts.length - 1)
    return {
      subpath: withoutVersion.join('/'),
    }
  })

  const allPaths = [...paths, ...latestVersionPaths]

  console.info(`[docs:ui] generating paths ${JSON.stringify(allPaths, null, 2)}`)

  return allPaths
}

export async function loader(props: LoaderProps) {
  const { frontmatter, code } = await getMDXBySlug('data/docs/components', props.params.subpath)
  const [componentName, componentVersion] = props.params.subpath.split('/')
  const versions = getAllVersionsFromPath(`data/docs/components/${componentName}`)
  console.info(
    `[docs:ui] load component ${JSON.stringify(
      { componentName, componentVersion, versions },
      null,
      2
    )}`
  )
  return {
    frontmatter: {
      ...frontmatter,
      version: componentVersion || versions[0],
      versions: versions,
    },
    code,
  }
}

export default function DocComponentsPage() {
  const { frontmatter, code } = useLoader(loader)
  const Component = React.useMemo(() => getMDXComponent(code), [code])
  const [isTinted, setIsTinted] = useState(true)
  const router = useRouter()
  const pathname = usePathname()
  const params = useLocalSearchParams()

  useEffect(() => {
    const fn = () => {
      setIsTinted((x) => !x)
    }
    listeners.add(fn)
    return () => {
      listeners.delete(fn)
    }
  }, [])

  // useEffect(() => {
  //   const url = new URL(location.href)
  //   url.pathname = `${pathname}/${frontmatter.version}`
  //   if (Array.isArray(params.subpath)) {
  //     url.pathname = url.pathname.replace('[...subpath]', params.subpath[0])
  //   }
  //   router.replace(url)
  // }, [])

  return (
    <>
      {/* <NextSeo
        title={`${frontmatter.title} — Tamagui — style library, design system, and UI kit for React (Native and web)`}
        description={frontmatter.description}
        openGraph={{
          images: [
            {
              url:
                frontmatter.image ??
                getOgUrl('component', {
                  title: frontmatter.title,
                  demoName: frontmatter.demoName ?? undefined,
                  description: frontmatter.description ?? '',
                }),
              width: 1200,
              height: 630,
            },
          ],
        }}
      /> */}
      {/* {frontmatter.version !== frontmatter.versions?.[0] && (
        <OldVersionNote
          name={frontmatter.title}
          href={`/primitives/docs/components/${frontmatter.subpath.replace(frontmatter.version, '')}`}
        />
      )} */}
      <MDXProvider frontmatter={frontmatter}>
        <ThemeTint disable={!isTinted}>
          <MDXTabs id="type" defaultValue="styled">
            <Component components={components as any} />
          </MDXTabs>
        </ThemeTint>
      </MDXProvider>

      <DocsQuickNav key={frontmatter.slug} />
    </>
  )
}

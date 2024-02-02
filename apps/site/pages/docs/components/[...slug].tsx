import { components } from '@components/MDXComponents'
import { MDXProvider } from '@components/MDXProvider'
import { QuickNav } from '@components/QuickNav'
import { getDefaultLayout } from '@lib/getDefaultLayout'
import { getAllFrontmatter, getAllVersionsFromPath, getMdxBySlug } from '@lib/mdx'
import { getOgUrl } from '@lib/og'
import { ThemeTint } from '@tamagui/logo'
import { getMDXComponent } from 'mdx-bundler/client'
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

import type { Frontmatter } from '../../../frontmatter'
import { listeners } from '../../../hooks/setTinted'
import { CustomTabs } from '../../../components/CustomTabs'

const getPathFragment = (path: string) => {
  const [_, fragment] = path.split('#')
  return fragment
}

type Doc = {
  frontmatter: Frontmatter
  code: any
}

export default function DocComponentsPage({ frontmatter, code }: Doc) {
  const Component = React.useMemo(() => getMDXComponent(code), [code])
  const [isTinted, setIsTinted] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fn = () => {
      setIsTinted((x) => !x)
    }
    listeners.add(fn)
    return () => {
      listeners.delete(fn)
    }
  }, [])

  useEffect(() => {
    const url = new URL(location.href)
    url.pathname = `${router.pathname}/${frontmatter.version}`

    if (Array.isArray(router.query.slug)) {
      url.pathname = url.pathname.replace('[...slug]', router.query.slug[0])
    }
    router.replace(url, undefined, { shallow: true })
  }, [])

  return (
    <>
      <NextSeo
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
      />
      {/* {frontmatter.version !== frontmatter.versions?.[0] && (
        <OldVersionNote
          name={frontmatter.title}
          href={`/primitives/docs/components/${frontmatter.slug.replace(frontmatter.version, '')}`}
        />
      )} */}
      <MDXProvider frontmatter={frontmatter}>
        <ThemeTint disable={!isTinted}>
          <CustomTabs id="type" defaultValue="styled">
            <Component components={components as any} />
          </CustomTabs>
        </ThemeTint>
      </MDXProvider>
      <QuickNav key={frontmatter.slug} />
    </>
  )
}

DocComponentsPage.getLayout = getDefaultLayout

export async function getStaticPaths() {
  const frontmatters = getAllFrontmatter('docs/components')
  const paths = frontmatters.map((frontmatter) => {
    return {
      params: { slug: frontmatter.slug.replace('docs/components/', '').split('/') },
    }
  })

  const latestVersionPaths = paths.map((path) => {
    const withoutVersion = path.params.slug.slice(0, path.params.slug.length - 1)
    return {
      params: { slug: withoutVersion },
    }
  })

  return {
    paths: [...paths, ...latestVersionPaths],
    fallback: false,
  }
}

export async function getStaticProps(context) {
  const { frontmatter, code } = await getMdxBySlug(
    'docs/components',
    context.params.slug.join('/')
  )
  const [componentName, componentVersion] = context.params.slug
  // const { gzip } = await getPackageData(frontmatter.name, componentVersion)
  const versions = getAllVersionsFromPath(`docs/components/${componentName}`)
  const extendedFrontmatter = {
    ...frontmatter,
    version: componentVersion || versions[0],
    versions: versions,
    // gzip: typeof gzip === 'number' ? formatBytes(gzip) : null,
  }
  return { props: { frontmatter: extendedFrontmatter, code } }
}

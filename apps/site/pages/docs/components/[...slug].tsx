import { components } from '@components/MDXComponents'
import { MDXProvider } from '@components/MDXProvider'
import { QuickNav } from '@components/QuickNav'
import { TitleAndMetaTags } from '@components/TitleAndMetaTags'
import { getAllFrontmatter, getAllVersionsFromPath, getMdxBySlug } from '@lib/mdx'
import { getMDXComponent } from 'mdx-bundler/client'
import React from 'react'

import { DocsPage } from '../../../components/DocsPage'
import type { Frontmatter } from '../../../frontmatter'

type Doc = {
  frontmatter: Frontmatter
  code: any
}

export default function DocComponentsPage({ frontmatter, code }: Doc) {
  const Component = React.useMemo(() => getMDXComponent(code), [code])
  return (
    <DocsPage>
      <TitleAndMetaTags
        title={`${frontmatter.title} — Tamagui`}
        description={frontmatter.description}
        image={frontmatter.image}
      />
      {/* {frontmatter.version !== frontmatter.versions?.[0] && (
        <OldVersionNote
          name={frontmatter.title}
          href={`/primitives/docs/components/${frontmatter.slug.replace(frontmatter.version, '')}`}
        />
      )} */}
      <MDXProvider frontmatter={frontmatter}>
        <Component components={components} />
      </MDXProvider>
      <QuickNav key={frontmatter.slug} />
    </DocsPage>
  )
}

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
  const { frontmatter, code } = await getMdxBySlug('docs/components', context.params.slug.join('/'))
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

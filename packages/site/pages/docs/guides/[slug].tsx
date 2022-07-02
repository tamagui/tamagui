import { components } from '@components/MDXComponents'
import { QuickNav } from '@components/QuickNav'
import { TitleAndMetaTags } from '@components/TitleAndMetaTags'
import { getAllFrontmatter, getMdxBySlug } from '@lib/mdx'
import { getMDXComponent } from 'mdx-bundler/client'
import React from 'react'
import { H1, Spacer } from 'tamagui'

import { DocsPage } from '../../../components/DocsPage'
import { SubTitle } from '../../../components/SubTitle'
import type { Frontmatter } from '../../../frontmatter'

type Doc = {
  frontmatter: Frontmatter
  code: any
}

export default function DocGuidesPage({ frontmatter, code }: Doc) {
  if (!frontmatter) {
    return null
  }
  const Component = React.useMemo(() => getMDXComponent(code), [code])
  return (
    <DocsPage>
      <TitleAndMetaTags title={`${frontmatter.title} — Tamagui Guides`} />
      <H1 mb="$2">{frontmatter.title}</H1>
      <Spacer size="$1" />
      <SubTitle>{frontmatter.description}</SubTitle>
      <Component components={components as any} />
      <QuickNav />
    </DocsPage>
  )
}

export async function getStaticPaths() {
  const frontmatters = getAllFrontmatter('docs/guides')
  const paths = frontmatters.map(({ slug }) => ({
    params: { slug: slug.replace('docs/guides/', '') },
  }))
  return {
    paths,
    fallback: false,
  }
}

export async function getStaticProps(context) {
  const { frontmatter, code } = await getMdxBySlug('docs/guides', context.params.slug)
  return {
    props: {
      frontmatter,
      code,
    },
  }
}

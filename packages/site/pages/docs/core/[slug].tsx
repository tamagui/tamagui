import { components } from '@components/MDXComponents'
import { QuickNav } from '@components/QuickNav'
import { TitleAndMetaTags } from '@components/TitleAndMetaTags'
import { getAllFrontmatter, getMdxBySlug } from '@lib/mdx'
import { getMDXComponent } from 'mdx-bundler/client'
import React from 'react'
import { H1, Spacer } from 'tamagui'

import { Description } from '../../../components/Description'
import type { Frontmatter } from '../../../types/frontmatter'

type Doc = {
  frontmatter: Frontmatter
  code: any
}

export default function DocsCorePage({ frontmatter, code }: Doc) {
  if (!frontmatter) {
    return null
  }
  const Component = React.useMemo(() => getMDXComponent(code), [code])
  return (
    <>
      <TitleAndMetaTags title={`${frontmatter.title} — Tamagui Core`} />
      <H1 letterSpacing={-1} fontWeight="700">
        {frontmatter.title}
      </H1>
      <Spacer />
      <Description>{frontmatter.description}</Description>
      <Component components={components as any} />
      <QuickNav />
    </>
  )
}

export async function getStaticPaths() {
  const frontmatters = getAllFrontmatter('docs/core')
  const paths = frontmatters.map(({ slug }) => ({
    params: { slug: slug.replace('docs/core/', '') },
  }))
  return {
    paths,
    fallback: false,
  }
}

export async function getStaticProps(context) {
  const { frontmatter, code } = await getMdxBySlug('docs/core', context.params.slug)
  return {
    props: {
      frontmatter,
      code,
    },
  }
}

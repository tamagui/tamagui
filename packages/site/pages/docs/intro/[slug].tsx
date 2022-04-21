import { components } from '@components/MDXComponents'
import { QuickNav } from '@components/QuickNav'
import { TitleAndMetaTags } from '@components/TitleAndMetaTags'
import { getAllFrontmatter, getMdxBySlug } from '@lib/mdx'
import { getMDXComponent } from 'mdx-bundler/client'
import React from 'react'
import { H1, Spacer } from 'tamagui'

import { SubTitle } from '../../../components/SubTitle'
import type { Frontmatter } from '../../../frontmatter'

type Doc = {
  frontmatter: Frontmatter
  code: any
}

export default function DocIntroPage({ frontmatter, code }: Doc) {
  if (!frontmatter) {
    return null
  }
  const Component = React.useMemo(() => getMDXComponent(code), [code])
  return (
    <>
      <TitleAndMetaTags title={`${frontmatter.title} — Tamagui`} />
      <H1 letterSpacing={-1} fontWeight="700">
        {frontmatter.title}
      </H1>
      <Spacer size="$1" />
      <SubTitle>{frontmatter.description}</SubTitle>
      <Component components={components as any} />
      <QuickNav key={frontmatter.slug} />
    </>
  )
}

export async function getStaticPaths() {
  const frontmatters = getAllFrontmatter('docs/intro')
  const paths = frontmatters.map(({ slug }) => ({
    params: { slug: slug.replace('docs/intro/', '') },
  }))
  return {
    paths,
    fallback: false,
  }
}

export async function getStaticProps(context) {
  const { frontmatter, code } = await getMdxBySlug('docs/intro', context.params.slug)
  return {
    props: {
      frontmatter,
      code,
    },
  }
}

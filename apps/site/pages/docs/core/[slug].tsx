import { components } from '@components/MDXComponents'
import { QuickNav } from '@components/QuickNav'
import { TitleAndMetaTags } from '@components/TitleAndMetaTags'
import { getAllFrontmatter, getMdxBySlug } from '@lib/mdx'
import { getMDXComponent } from 'mdx-bundler/client'
import React from 'react'
import { Spacer } from 'tamagui'

import { DocsPage } from '../../../components/DocsPage'
import { HomeH1 } from '../../../components/HomeH2'
import { SubTitle } from '../../../components/SubTitle'
import type { Frontmatter } from '../../../frontmatter'

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
      <HomeH1>{frontmatter.title}</HomeH1>
      <Spacer size="$1" />
      <SubTitle>{frontmatter.description}</SubTitle>
      <Component components={components as any} />
      <QuickNav key={frontmatter.slug} />
    </>
  )
}

DocsCorePage.getLayout = (page) => <DocsPage>{page}</DocsPage>

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

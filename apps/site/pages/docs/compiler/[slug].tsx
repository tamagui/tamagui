import { components } from '@components/MDXComponents'
import { QuickNav } from '@components/QuickNav'
import { TamaguiExamples } from '@components/TamaguiExamplesCode'
import { getDefaultLayout } from '@lib/getDefaultLayout'
import { getAllFrontmatter, getMdxBySlug } from '@lib/mdx'
import { getOgUrl } from '@lib/og'
import { ThemeTint } from '@tamagui/logo'
import { getMDXComponent } from 'mdx-bundler/client'
import { NextSeo } from 'next-seo'
import React from 'react'
import { Spacer } from 'tamagui'

import { HomeH1 } from '../../../components/HomeH2'
import { SubTitle } from '../../../components/SubTitle'
import type { Frontmatter } from '../../../frontmatter'

type Doc = {
  frontmatter: Frontmatter
  code: any
  examples: any
}

export default function DocCompilerPage({ frontmatter, code, examples }: Doc) {
  if (!frontmatter) {
    return null
  }
  const Component = React.useMemo(() => getMDXComponent(code), [code])
  return (
    <TamaguiExamples.Provider value={examples}>
      <NextSeo
        title={`${frontmatter.title} — Tamagui Compiler`}
        description={frontmatter.description}
        openGraph={{
          images: [
            {
              url: getOgUrl('default', {
                title: frontmatter.title,
                description: frontmatter.description ?? '',
                category: 'Compiler',
                demoName: frontmatter.demoName,
              }),
            },
          ],
        }}
      />
      <HomeH1>{frontmatter.title}</HomeH1>
      <Spacer size="$1" />
      <SubTitle>{frontmatter.description}</SubTitle>
      <ThemeTint>
        <Component components={components as any} />
      </ThemeTint>
      <QuickNav />
    </TamaguiExamples.Provider>
  )
}

DocCompilerPage.getLayout = getDefaultLayout

export async function getStaticPaths() {
  const frontmatters = getAllFrontmatter('docs/compiler')
  const paths = frontmatters.map(({ slug }) => ({
    params: { slug: slug.replace('docs/compiler/', '') },
  }))
  return {
    paths,
    fallback: false,
  }
}

export async function getStaticProps(context) {
  const { frontmatter, code } = await getMdxBySlug('docs/compiler', context.params.slug)
  return {
    props: {
      frontmatter,
      code,
    },
  }
}

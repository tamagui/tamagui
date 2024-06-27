import { components } from '@components/MDXComponents'
import { QuickNav } from '@components/QuickNav'
import { getDefaultLayout } from '@lib/getDefaultLayout'
import { getAllFrontmatter, getMdxBySlug } from '@lib/mdx'
import { getOgUrl } from '@lib/og'
import { ThemeTint } from '@tamagui/logo'
import { getMDXComponent } from 'mdx-bundler/client'
import { NextSeo } from 'next-seo'
import React from 'react'
import { Spacer } from 'tamagui'

import { HomeH1 } from '../../../components/HomeH2'
import { SubTitle, nbspLastWord } from '../../../components/SubTitle'
import { TamaguiExamples } from '../../../components/TamaguiExamplesCode'
import type { Frontmatter } from '../../../frontmatter'
import { getCompilationExamples } from '../../../lib/getCompilationExamples'

type Doc = {
  frontmatter: Frontmatter
  code: any
  examples: any
}

export default function DocIntroPage({ frontmatter, code, examples }: Doc) {
  if (!frontmatter || !code) {
    console.warn(`No frontmatter/code?`, { frontmatter, code })
    return null
  }
  const Component = React.useMemo(() => getMDXComponent(code), [code])
  return (
    <TamaguiExamples.Provider value={examples}>
      <NextSeo
        title={`${frontmatter.title} — Tamagui`}
        description={frontmatter.description}
        openGraph={{
          images: [
            {
              url: getOgUrl('default', {
                title: frontmatter.title,
                description: frontmatter.description ?? '',
                category: 'intro',
              }),
            },
          ],
        }}
      />
      <HomeH1>{nbspLastWord(frontmatter.title)}</HomeH1>
      <Spacer size="$1" />
      <SubTitle>{frontmatter.description}</SubTitle>
      <ThemeTint>
        <Component components={components as any} />
      </ThemeTint>
      <QuickNav key={frontmatter.slug} />
    </TamaguiExamples.Provider>
  )
}

DocIntroPage.getLayout = getDefaultLayout

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
      examples: getCompilationExamples(),
    },
  }
}

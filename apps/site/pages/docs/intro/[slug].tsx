import { components } from '@components/MDXComponents'
import { QuickNav } from '@components/QuickNav'
import { TitleAndMetaTags } from '@components/TitleAndMetaTags'
import { getAllFrontmatter, getMdxBySlug } from '@lib/mdx'
import { getMDXComponent } from 'mdx-bundler/client'
import React from 'react'
import { H1, Spacer } from 'tamagui'

import { DocsPage } from '../../../components/DocsPage'
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
  if (!frontmatter) {
    return null
  }
  const Component = React.useMemo(() => getMDXComponent(code), [code])
  return (
    <TamaguiExamples.Provider value={examples}>
      <TitleAndMetaTags title={`${frontmatter.title} — Tamagui`} />
      <H1
        className="word-break-keep-all"
        size="$9"
        fos={40}
        lh={55}
        mb="$2"
        $gtSm={{ maxWidth: '90%' }}
      >
        {nbspLastWord(frontmatter.title)}
      </H1>
      <Spacer size="$1" />
      <SubTitle>{frontmatter.description}</SubTitle>
      <Component components={components as any} />
      <QuickNav key={frontmatter.slug} />
    </TamaguiExamples.Provider>
  )
}

DocIntroPage.getLayout = (page) => <DocsPage>{page}</DocsPage>

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

import BetaTag from '@components/BetaTag'
import { components } from '@components/MDXComponents'
import { QuickNav } from '@components/QuickNav'
import { getDefaultLayout } from '@lib/getDefaultLayout'
import { getAllFrontmatter, getMdxBySlug } from '@lib/mdx'
import { getOgUrl } from '@lib/og'
import { ThemeTint } from '@tamagui/logo'
import { getMDXComponent } from 'mdx-bundler/client'
import { NextSeo } from 'next-seo'
import React from 'react'
import { H1, Spacer } from 'tamagui'

import { SubTitle } from '../../../components/SubTitle'
import type { Frontmatter } from '../../../frontmatter'

type Doc = {
  frontmatter: Frontmatter
  code: any
}

export default function DocsAdvancedPage({ frontmatter, code }: Doc) {
  if (!frontmatter) {
    return null
  }
  const Component = React.useMemo(() => getMDXComponent(code), [code])
  return (
    <>
      <NextSeo
        title={`${frontmatter.title} — Tamagui Advanced Concepts`}
        description={frontmatter.description}
        openGraph={{
          images: [
            {
              url: getOgUrl('default', {
                title: frontmatter.title,
                description: frontmatter.description ?? '',
                category: 'Advanced',
              }),
              width: 1200,
              height: 630,
            },
          ],
        }}
      />
      <H1 width={'max-content'} pos={'relative'}>
        {frontmatter.title} {frontmatter.beta && <BetaTag />}
      </H1>
      <Spacer size="$1" />
      <SubTitle>{frontmatter.description}</SubTitle>
      <ThemeTint>
        <Component components={components as any} />
      </ThemeTint>
      <QuickNav key={frontmatter.slug} />
    </>
  )
}

DocsAdvancedPage.getLayout = getDefaultLayout

export async function getStaticPaths() {
  const frontmatters = getAllFrontmatter('docs/advanced')
  const paths = frontmatters.map(({ slug }) => ({
    params: { slug: slug.replace('docs/advanced/', '') },
  }))
  return {
    paths,
    fallback: false,
  }
}

export async function getStaticProps(context) {
  const { frontmatter, code } = await getMdxBySlug('docs/advanced', context.params.slug)
  return {
    props: {
      frontmatter,
      code,
    },
  }
}

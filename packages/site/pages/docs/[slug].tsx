import { components } from '@components/MDXComponents'
import { TitleAndMetaTags } from '@components/TitleAndMetaTags'
import { getAllFrontmatter, getMdxBySlug } from '@lib/mdx'
import { getMDXComponent } from 'mdx-bundler/client'
import React from 'react'
import { Paragraph, Text } from 'snackui'
import type { Frontmatter } from 'types/frontmatter'

type Doc = {
  frontmatter: Frontmatter
  code: any
}

export default function Doc({ frontmatter, code }: Doc) {
  if (!frontmatter) {
    return null
  }

  const Component = React.useMemo(() => getMDXComponent(code), [code])

  return (
    <>
      <TitleAndMetaTags title={`${frontmatter.title} — Stitches`} />

      <Text as="h1" size="8" css={{ fontWeight: 500, mb: '$2', lineHeight: '40px' }}>
        {frontmatter.title}
      </Text>

      <Paragraph size="2" css={{ mt: '$2', mb: '$7' }}>
        {frontmatter.description}
      </Paragraph>

      <Component components={components as any} />
    </>
  )
}

export async function getStaticPaths() {
  const frontmatters = getAllFrontmatter('docs')

  return {
    paths: frontmatters.map(({ slug }) => ({ params: { slug } })),
    fallback: false,
  }
}

export async function getStaticProps(context) {
  const { frontmatter, code } = await getMdxBySlug('docs', context.params.slug)

  return {
    props: {
      frontmatter,
      code,
    },
  }
}

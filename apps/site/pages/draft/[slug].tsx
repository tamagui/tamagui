import { TitleAndMetaTags } from '@components/TitleAndMetaTags'
import { getAllFrontmatter, getMdxBySlug } from '@lib/mdx'
import { getMDXComponent } from 'mdx-bundler/client'
import React from 'react'

import { BlogPost, BlogSlugPage } from '../../components/BlogSlugPage'
import { TamaguiExamples } from '../../components/TamaguiExamplesCode'
import { getCompilationExamples } from '../../lib/getCompilationExamples'

export default function BlogSlug(props: BlogPost) {
  const Component = React.useMemo(() => getMDXComponent(props.code), [props.code])

  return (
    <TamaguiExamples.Provider value={props['examples']}>
      <TitleAndMetaTags
        {...props.frontmatter}
        title={`${props.frontmatter.title} — Tamagui`}
      />
      <BlogSlugPage Component={Component} {...props} />
    </TamaguiExamples.Provider>
  )
}

export async function getStaticPaths() {
  const frontmatters = getAllFrontmatter('draft')
  return {
    paths: frontmatters.map(({ slug }) => ({
      params: { slug: slug.replace('draft/', '') },
    })),
    fallback: false,
  }
}

export async function getStaticProps(context) {
  const { frontmatter, code } = await getMdxBySlug('draft', context.params.slug)
  const relatedPosts = frontmatter.relatedIds
    ? await Promise.all(
        frontmatter.relatedIds.map(async (id) => {
          const { frontmatter } = await getMdxBySlug('draft', id)
          return frontmatter
        })
      )
    : null
  return {
    props: {
      frontmatter,
      code,
      relatedPosts,
      examples: getCompilationExamples(),
    },
  }
}

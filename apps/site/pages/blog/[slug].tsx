import { getBlogLayout } from '@components/layouts/BlogLayout'
import { TitleAndMetaTags } from '@components/TitleAndMetaTags'
import { getAllFrontmatter, getMdxBySlug } from '@lib/mdx'
import { getOgUrl } from '@lib/og'
import { getMDXComponent } from 'mdx-bundler/client'
import React from 'react'

import { BlogPost, BlogSlugPage } from '../../components/BlogSlugPage'
import { TamaguiExamples } from '../../components/TamaguiExamplesCode'
import { getCompilationExamples } from '../../lib/getCompilationExamples'

export default function BlogSlug(props: BlogPost) {
  const Component = React.useMemo(() => getMDXComponent(props.code), [props.code])
console.log(props.frontmatter.title)
  return (
    <TamaguiExamples.Provider value={props['examples']}>
      <TitleAndMetaTags
        {...props.frontmatter}
        title={`${props.frontmatter.title} — Tamagui`}
        image={getOgUrl(
          'default',
          props.frontmatter.title,
          props.frontmatter.description ?? ''
        )}
      />
      <BlogSlugPage Component={Component} {...props} />
    </TamaguiExamples.Provider>
  )
}

BlogSlug.getLayout = getBlogLayout

export async function getStaticPaths() {
  const frontmatters = getAllFrontmatter('blog')
  return {
    paths: frontmatters.map(({ slug }) => ({
      params: { slug: slug.replace('blog/', '') },
    })),
    fallback: false,
  }
}

export async function getStaticProps(context) {
  const { frontmatter, code } = await getMdxBySlug('blog', context.params.slug)
  const relatedPosts = frontmatter.relatedIds
    ? await Promise.all(
        frontmatter.relatedIds.map(async (id) => {
          const { frontmatter } = await getMdxBySlug('blog', id)
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

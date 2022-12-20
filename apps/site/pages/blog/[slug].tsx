import { TitleAndMetaTags } from '@components/TitleAndMetaTags'
import { getAllFrontmatter, getMdxBySlug } from '@lib/mdx'
import { getMDXComponent } from 'mdx-bundler/client'
import React from 'react'

import { BlogPost, BlogSlugPage } from '../../components/BlogSlugPage'

export default function BlogSlug(props: BlogPost) {
  const Component = React.useMemo(() => getMDXComponent(props.code), [props.code])

  return (
    <>
      <TitleAndMetaTags {...props.frontmatter} title={`${props.frontmatter.title} — Tamagui`} />
      <BlogSlugPage Component={Component} {...props} />
    </>
  )
}

export async function getStaticPaths() {
  const frontmatters = getAllFrontmatter('blog')
  return {
    paths: frontmatters.map(({ slug }) => ({ params: { slug: slug.replace('blog/', '') } })),
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
    },
  }
}

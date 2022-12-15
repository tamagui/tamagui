import { HeaderIndependent } from '@components/HeaderIndependent'
import { TitleAndMetaTags } from '@components/TitleAndMetaTags'
import { getAllFrontmatter, getMdxBySlug } from '@lib/mdx'
import { getMDXComponent } from 'mdx-bundler/client'
import React from 'react'

import { BlogPost, BlogSlugPage } from '../../components/BlogSlugPage'

export default function BlogSlug(props: BlogPost) {
  const Component = React.useMemo(() => getMDXComponent(props.code), [props.code])

  return (
    <>
      <TitleAndMetaTags
        title={`${props.frontmatter.title} — Tamagui`}
        poster={props.frontmatter.poster}
      />
      <BlogSlugPage Component={Component} {...props} />
    </>
  )
}

export async function getStaticPaths() {
  const frontmatters = getAllFrontmatter('draft')
  return {
    paths: frontmatters.map(({ slug }) => ({ params: { slug: slug.replace('draft/', '') } })),
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
    },
  }
}

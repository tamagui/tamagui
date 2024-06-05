import { getAllFrontmatter, getMdxBySlug } from '@lib/mdx'
import { getOgUrl } from '@lib/og'
import { getMDXComponent } from 'mdx-bundler/client'
import { NextSeo } from 'next-seo'
import React from 'react'

import type { BlogPost } from '../../components/BlogSlugPage'
import { BlogSlugPage } from '../../components/BlogSlugPage'
import { TamaguiExamples } from '../../components/TamaguiExamplesCode'
import { getCompilationExamples } from '../../lib/getCompilationExamples'

export default function BlogSlug(props: BlogPost) {
  const Component = React.useMemo(() => getMDXComponent(props.code), [props.code])

  return (
    <TamaguiExamples.Provider value={props['examples']}>
      <NextSeo
        {...props.frontmatter}
        title={`${props.frontmatter.title} — Tamagui`}
        description={props.frontmatter.description}
        openGraph={{
          images: [
            {
              url: getOgUrl('default', {
                title: props.frontmatter.title,
                description: props.frontmatter.description ?? '',
              }),
            },
          ],
        }}
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

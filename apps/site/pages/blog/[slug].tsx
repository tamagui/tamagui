import { getDefaultLayout } from '@lib/getDefaultLayout'
import { getAllFrontmatter, getMdxBySlug } from '@lib/mdx'
import { getOgUrl } from '@lib/og'
import { getMDXComponent } from 'mdx-bundler/client'
import { NextSeo } from 'next-seo'
import React from 'react'

import type { BlogPost} from '../../components/BlogSlugPage';
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
              url:
                props.frontmatter.image ??
                getOgUrl('default', {
                  title: props.frontmatter.title,
                  description: props.frontmatter.description ?? '',
                  category: 'Blog',
                }),
              width: 1200,
              height: 630,
            },
          ],
        }}
      />
      <BlogSlugPage Component={Component} {...props} />
    </TamaguiExamples.Provider>
  )
}

BlogSlug.getLayout = getDefaultLayout

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

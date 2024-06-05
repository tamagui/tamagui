import { getDefaultLayout } from '@lib/getDefaultLayout'
import { getAllFrontmatter, getMdxBySlug } from '@lib/mdx'
import { getOgUrl } from '@lib/og'
import { getMDXComponent } from 'mdx-bundler/client'
import { NextSeo } from 'next-seo'
import React from 'react'

import type { ChangelogPost } from '../../components/ChangelogSlugPage'
import { ChangelogSlugPage } from '../../components/ChangelogSlugPage'
import { TamaguiExamples } from '../../components/TamaguiExamplesCode'
import { getCompilationExamples } from '../../lib/getCompilationExamples'

export default function ChangelogSlug(props: ChangelogPost) {
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
                  category: 'Changelog',
                }),
              width: 1200,
              height: 630,
            },
          ],
        }}
      />
      <ChangelogSlugPage Component={Component} {...props} />
    </TamaguiExamples.Provider>
  )
}

ChangelogSlug.getLayout = getDefaultLayout

export async function getStaticPaths() {
  const frontmatters = getAllFrontmatter('changelog')
  return {
    paths: frontmatters.map(({ slug }) => ({
      params: { slug: slug.replace('changelog/', '') },
    })),
    fallback: false,
  }
}

export async function getStaticProps(context) {
  const { frontmatter, code } = await getMdxBySlug('changelog', context.params.slug)
  const relatedPosts = frontmatter.relatedIds
    ? await Promise.all(
        frontmatter.relatedIds.map(async (id) => {
          const { frontmatter } = await getMdxBySlug('changelog', id)
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

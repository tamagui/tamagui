import { getAllFrontmatter, getCompilationExamples, getMDXBySlug } from '@tamagui/mdx'
import type { LoaderProps } from '@vxrn/router'
import { useLoader } from '@vxrn/router'
import { getMDXComponent } from 'mdx-bundler/client'
import React from 'react'
import { components } from '~/features/mdx/MDXComponents'

import { BlogSlugPage } from '~/features/site/blog/BlogSlugPage'

export async function generateStaticParams() {
  const frontmatters = getAllFrontmatter('blog')
  return frontmatters.map(({ slug }) => ({
    slug: slug.replace('blog/', ''),
  }))
}

export async function loader(props: LoaderProps) {
  const { slug } = props.params
  const { frontmatter, code } = await getMDXBySlug('data/blog', slug)
  const relatedPosts = frontmatter.relatedIds
    ? await Promise.all(
        frontmatter.relatedIds.map(async (id) => {
          const { frontmatter } = await getMDXBySlug('data/blog', id)
          return frontmatter
        })
      )
    : null

  return {
    frontmatter,
    code,
    relatedPosts,
    examples: await getCompilationExamples(),
  }
}

export default function BlogSlug() {
  const data = useLoader(loader)
  const Component = React.useMemo(() => getMDXComponent(data.code), [data.code])

  // TODO
  // <TamaguiExamples.Provider value={props['examples']}>
  // <NextSeo
  //   {...props.frontmatter}
  //   title={`${props.frontmatter.title} — Tamagui`}
  //   description={props.frontmatter.description}
  //   openGraph={{
  //     images: [
  //       {
  //         url:
  //           props.frontmatter.image ??
  //           getOgUrl('default', {
  //             title: props.frontmatter.title,
  //             description: props.frontmatter.description ?? '',
  //             category: 'Blog',
  //           }),
  //         width: 1200,
  //         height: 630,
  //       },
  //     ],
  //   }}
  // />
  // </TamaguiExamples.Provider>

  return (
    <>
      <BlogSlugPage Component={Component} {...data} />
    </>
  )
}

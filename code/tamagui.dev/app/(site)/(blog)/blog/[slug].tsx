import { getMDXComponent } from '@vxrn/mdx-rust/client'
import React from 'react'
import type { LoaderProps } from 'one'
import { useLoader } from 'one'
import { HeadInfo } from '~/components/HeadInfo'
import { TamaguiExamples } from '~/components/TamaguiExamples'
import { BlogSlugPage } from '~/features/site/blog/BlogSlugPage'

export async function generateStaticParams() {
  const { getAllFrontmatter } = await import('~/features/mdx/getMDXBySlug')
  const frontmatters = getAllFrontmatter('data/blog')
  return frontmatters.map(({ slug }) => ({
    slug: slug.replace('blog/', ''),
  }))
}

export async function loader(props: LoaderProps) {
  const { getCompilationExamples, getMDXBySlug } =
    await import('~/features/mdx/getMDXBySlug')
  const { getDocsMode } = await import('~/features/docs/isTailwindMode')
  const mode = getDocsMode(props)
  const { slug } = props.params
  const { frontmatter, code } = await getMDXBySlug('data/blog', slug as string, {
    mode,
  })
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
    examples: getCompilationExamples(),
  }
}

export default function BlogSlug() {
  const data = useLoader(loader)

  if (!data) {
    console.warn(`No data?`)
    return null
  }

  const Component = React.useMemo(() => getMDXComponent(data.code), [data.code])

  return (
    <>
      <HeadInfo
        {...data.frontmatter}
        title={`${data.frontmatter.title}: ${(data.frontmatter.description ?? '')
          .replace(/tamagui\s+/i, '')
          .trim()
          .replace(/^./, (c) => c.toLowerCase())}`}
        description={data.frontmatter.description ?? ''}
        openGraph={
          data.frontmatter.image
            ? {
                images: [
                  {
                    url: data.frontmatter.image,
                    width: 1200,
                    height: 630,
                  },
                ],
              }
            : undefined
        }
      />

      <TamaguiExamples.Provider value={data.examples}>
        <BlogSlugPage Component={Component} {...data} />
      </TamaguiExamples.Provider>
    </>
  )
}

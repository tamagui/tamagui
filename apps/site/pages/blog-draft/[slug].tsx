import { getAllFrontmatter, getMdxBySlug } from '@lib/mdx'

import BlogPost from '../blog/[slug]'

export default BlogPost

export async function getStaticPaths() {
  const frontmatters = getAllFrontmatter('blog-draft')
  console.log('frontmatters', frontmatters)
  return {
    paths: frontmatters.map(({ slug }) => ({ params: { slug: slug.replace('blog/', '') } })),
    fallback: false,
  }
}

export async function getStaticProps(context) {
  const { frontmatter, code } = await getMdxBySlug('blog-post', context.params.slug)
  console.log('frontmatter', frontmatter)
  const relatedPosts = frontmatter.relatedIds
    ? await Promise.all(
        frontmatter.relatedIds.map(async (id) => {
          const { frontmatter } = await getMdxBySlug('blog-post', id)
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

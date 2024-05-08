import fs from 'node:fs'
import path from 'node:path'

import compareVersions from 'compare-versions'
import { bundleMDX } from 'mdx-bundler'
import readingTime from 'reading-time'

import type { Frontmatter } from './types'
import { rehypeHighlightCode } from './rehypeHighlightCode'
import rehypeMetaAttribute from './rehypeMetaAttribute'
import rehypeHeroTemplate from './rehypeHeroTemplate'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeSlug from 'rehype-slug'

export const getMDXBySlug = async (
  basePath: string,
  slug: string
): Promise<{ frontmatter: Frontmatter; code: string }> => {
  let mdxPath = slug
  if (!mdxPath.includes('/') && basePath.includes('components')) {
    const versions = getAllVersionsFromPath(`data/docs/components/${slug}`)
    mdxPath += `/${versions[0]}`
  }
  const filePath = path.join(basePath, `${mdxPath}.mdx`)
  const source = fs.readFileSync(filePath, 'utf8')
  const { frontmatter, code } = await getMDX(source)
  return {
    frontmatter: {
      ...frontmatter,
      slug,
      readingTime: readingTime(code),
    } as Frontmatter,
    code,
  }
}

export async function getMDX(source: string) {
  return await bundleMDX({
    source,
    mdxOptions(options) {
      options.rehypePlugins = [
        ...(options.rehypePlugins ?? []),
        rehypeMetaAttribute,
        rehypeHeroTemplate,
        rehypeHighlightCode,
        rehypeAutolinkHeadings,
        rehypeSlug,
      ]
      return options
    },
  })
}

export function getAllVersionsFromPath(fromPath: string): string[] {
  if (!fs.existsSync(fromPath)) return []
  return fs
    .readdirSync(fromPath)
    .map((fileName) => fileName.replace('.mdx', ''))
    .sort(compareVersions)
    .reverse()
}

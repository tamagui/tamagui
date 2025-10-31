import compareVersions from 'compare-versions'
import { bundleMDX } from 'mdx-bundler'
import fs from 'node:fs'
import path from 'node:path'
import readingTime from 'reading-time'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeSlug from 'rehype-slug'
import { getHeadings } from './getHeadings'
import rehypeHeroTemplate from './rehypeHeroTemplate'
import { rehypeHighlightCode } from './rehypeHighlightCode'
import rehypeMetaAttribute from './rehypeMetaAttribute'
import type { Frontmatter } from './types'

export async function getMDXBySlug(
  basePath: string,
  slug: string
): Promise<{ frontmatter: Frontmatter; code: string }> {
  if (!basePath || typeof basePath !== 'string') {
    throw new Error(`Invalid basePath: ${basePath}`)
  }

  let mdxPath = slug
  if (!slug || typeof slug !== 'string') {
    if (Array.isArray(slug)) {
      mdxPath = slug[0]
    } else {
      throw new Error(`Invalid slug: ${slug}`)
    }
  }

  // if no version given, find it
  if (!slug.includes('.') && basePath.includes('components')) {
    const versions = getAllVersionsFromPath(path.join(basePath, slug))
    if (!versions.length) {
      throw new Error(`No versions found for: ${slug} in ${basePath}`)
    }
    mdxPath += `/${versions[0]}`
  }

  const filePath = path.join(basePath, `${mdxPath}.mdx`)

  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`)
  }

  const source = fs.readFileSync(filePath, 'utf8')
  const { frontmatter, code } = await getMDX(source)
  return {
    frontmatter: {
      ...frontmatter,
      headings: getHeadings(source),
      readingTime: readingTime(code),
    } as Frontmatter,
    code,
  }
}

export async function getMDX(source: string) {
  return await bundleMDX({
    source,
    mdxOptions(options) {
      const plugins = [
        ...(options.rehypePlugins ?? []),
        rehypeMetaAttribute,
        rehypeHeroTemplate,
        rehypeHighlightCode,
        rehypeAutolinkHeadings,
        rehypeSlug,
      ]
      options.rehypePlugins = plugins as any
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

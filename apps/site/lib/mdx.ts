import fs from 'fs'
import path from 'path'

import compareVersions from 'compare-versions'
import glob from 'glob'
import matter from 'gray-matter'
import { bundleMDX } from 'mdx-bundler'
import readingTime from 'reading-time'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeSlug from 'rehype-slug'

import type { Frontmatter } from '../frontmatter'
import rehypeHeroTemplate from './rehype-hero-template'
import rehypeHighlightCode from './rehype-highlight-code'
import rehypeMetaAttribute from './rehype-meta-attribute'

const ROOT_PATH = process.cwd()
export const DATA_PATH = path.join(ROOT_PATH, 'data')

// the front matter and content of all mdx files based on `docsPaths`
export const getAllFrontmatter = (fromPath: string) => {
  const PATH = path.join(DATA_PATH, fromPath)
  const paths = glob.sync(`${PATH}/**/*.mdx`)
  return paths
    .map((filePath) => {
      const source = fs.readFileSync(path.join(filePath), 'utf8')
      const { data, content } = matter(source)
      return {
        ...data,
        slug: filePath
          .replace(`${DATA_PATH.replaceAll('\\', '/')}/`, '')
          .replace('.mdx', ''),
        readingTime: readingTime(content),
      } as Frontmatter
    })
    .sort(
      (a, b) =>
        Number(new Date(b.publishedAt || '')) - Number(new Date(a.publishedAt || ''))
    )
}

export const getMdxBySlug = async (basePath, slug) => {
  let mdxPath = slug
  if (!mdxPath.includes('/') && basePath.includes('components')) {
    const versions = getAllVersionsFromPath(`docs/components/${slug}`)
    mdxPath += `/${versions[0]}`
  }
  const filePath = path.join(DATA_PATH, basePath, `${mdxPath}.mdx`)
  const source = fs.readFileSync(filePath, 'utf8')
  const { frontmatter, code } = await bundleMDX({
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

  return {
    frontmatter: {
      ...frontmatter,
      slug,
      readingTime: readingTime(code),
    } as Frontmatter,
    code,
  }
}

export function getAllVersionsFromPath(fromPath: string) {
  const PATH = path.join(DATA_PATH, fromPath)
  if (!fs.existsSync(PATH)) return []
  return fs
    .readdirSync(PATH)
    .map((fileName) => fileName.replace('.mdx', ''))
    .sort(compareVersions)
    .reverse()
}

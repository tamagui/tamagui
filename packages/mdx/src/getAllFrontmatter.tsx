import fs from 'fs'
import path from 'path'

import glob from 'glob'
import matter from 'gray-matter'
import readingTime from 'reading-time'

import type { Frontmatter } from './types'

// the front matter and content of all mdx files based on `docsPaths`
export const getAllFrontmatter = (fromPath: string) => {
  const paths = glob.sync(`${fromPath}/**/*.mdx`)
  return paths
    .map((filePath) => {
      const source = fs.readFileSync(path.join(filePath), 'utf8')
      const { data, content } = matter(source)
      return {
        ...data,
        slug: filePath
          .replace(`${fromPath.replaceAll('\\', '/')}/`, '')
          .replace('.mdx', ''),
        readingTime: readingTime(content),
      } as Frontmatter
    })
    .sort(
      (a, b) =>
        Number(new Date(b.publishedAt || '')) - Number(new Date(a.publishedAt || ''))
    )
}

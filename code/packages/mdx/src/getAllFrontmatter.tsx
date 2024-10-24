import glob from 'glob'
import matter from 'gray-matter'
import fs from 'node:fs'
import path from 'node:path'
import readingTime from 'reading-time'
import { getHeadings } from './getHeadings'
import type { Frontmatter } from './types'

// the front matter and content of all mdx files based on `docsPaths`
export const getAllFrontmatter = (fromPath: string): Frontmatter[] => {
  const paths = glob.sync(`${fromPath}/**/*.mdx`)
  return paths
    .map((filePath) => {
      const source = fs.readFileSync(path.join(filePath), 'utf8')
      const { data, content } = matter(source)
      const slug = filePath
        .replace(`${fromPath.replaceAll('\\', '/')}/`, '')
        .replace('.mdx', '')
      return {
        ...data,
        slug,
        headings: getHeadings(source),
        readingTime: readingTime(content),
      } as Frontmatter
    })
    .sort(
      (a, b) =>
        Number(new Date(b.publishedAt || '')) - Number(new Date(a.publishedAt || ''))
    )
}

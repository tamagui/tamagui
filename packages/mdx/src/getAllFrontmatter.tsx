import fs from 'fs'
import path from 'path'

import glob from 'glob'
import matter from 'gray-matter'
import readingTime from 'reading-time'

import type { Frontmatter } from './types'

const ROOT_PATH = process.cwd()
const DATA_PATH = path.join(ROOT_PATH, 'data')

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

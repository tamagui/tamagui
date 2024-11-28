import type { Href } from 'one'

export const getUrlFromPath = (segment: 'test' | 'bento', path: string): Href => {
  const clean = getNameFromPath(segment, path)
  return `/${segment}/${clean}` as any
}

export const getNameFromPath = (segment: 'test' | 'bento', path: string) => {
  return path
    .replace(/.*(use-cases|bento\/src\/components\/[a-z]+)\//, '')
    .replaceAll('/', '_')
    .replace(/\.tsx?$/, '')
}

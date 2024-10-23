import type { Href } from 'one'

export const getTestUrlFromPath = (path: string): Href => {
  const clean = getTestNameFromPath(path)
  return `/test/${clean}`
}

export const getTestNameFromPath = (path: string) => {
  return path.replace(/.*use-cases\//, '').replace(/\.tsx?$/, '')
}

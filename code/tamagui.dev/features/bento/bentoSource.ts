// serves bento source text from code/bento/src for the code tab and bento-get.
// server only: the eager glob inlines every bento file as a string.

const raw = import.meta.glob<string>('../../../bento/src/**/*.{ts,tsx}', {
  query: '?raw',
  import: 'default',
  eager: true,
})

const files = new Map(
  Object.entries(raw).map(([key, text]) => [key.replace('../../../bento/src/', ''), text])
)

// rewrites site-only helpers into what a consuming app already has
function toAppSource(text: string) {
  return text
    .replace(/import {.*useGroupMedia.*} from.*/g, `import { useMedia } from 'tamagui'`)
    .replace(/useGroupMedia\(.*\)/g, `useMedia()`)
    .replace(
      /import {.*useContainerDim.*} from.*/g,
      `import { useWindowDimensions } from 'tamagui'`
    )
    .replace(/useContainerDim\(.*\)/g, `useWindowDimensions()`)
    .replace(/from '(\.\.\/)+icons'/g, `from '~/components/icons'`)
    .replaceAll(/\$group-window-(\w+)/g, (_, group) => `$${group}`)
    .replaceAll(/([a-zA-Z0-9_]+\.fileName\s*=\s*)'([^']*)'/g, '')
}

function join(dir: string, rel: string) {
  const parts = dir ? dir.split('/') : []
  for (const part of rel.split('/')) {
    if (part === '..') parts.pop()
    else if (part !== '.') parts.push(part)
  }
  return parts.join('/')
}

function dirname(path: string) {
  return path.split('/').slice(0, -1).join('/')
}

// one file with every relative import it reaches appended after it
function merge(path: string, seen: Set<string>): string {
  if (seen.has(path)) return ''
  seen.add(path)
  const text = files.get(path)!
  let out = `/** START of the file ${path.split('/').pop()} */\n${toAppSource(text)}`
  for (const [, spec] of text.matchAll(/from\s+['"](\.[^'"]+)['"]/g)) {
    const base = join(dirname(path), spec)
    for (const ext of ['.native.tsx', '.tsx', '.ts']) {
      if (files.has(base + ext)) {
        out += merge(base + ext, seen)
      }
    }
  }
  return out
}

export function getMergedBentoSource(section: string, part: string, fileName: string) {
  const path = `${section}/${part}/${fileName}.tsx`
  if (!files.has(path)) return null
  return merge(path, new Set())
}

export function getBentoFile(path: string) {
  const text = files.get(path)
  return text === undefined ? null : toAppSource(text)
}

// the files bento-get installs for a group, grouped by directory
export function listBentoGroupFiles(section: string, part?: string, fileName?: string) {
  const root = part ? `${section}/${part}` : section
  const result: Record<string, string[]> = {}
  for (const path of files.keys()) {
    if (!path.startsWith(`${root}/`)) continue
    const dir = dirname(path)
    const isNested = dir !== root
    if (!isNested && fileName && !path.split('/').pop()!.includes(fileName)) continue
    ;(result[dir] ||= []).push(path)
  }
  return result
}

import fs from 'node:fs'
import path from 'node:path'

// the raw mdx behind the docs, served as text for llms and `.md` urls. the
// node middleware serves these on request; scripts/build-static.ts writes them
// as files for the static build.

export const docsDir = path.join(process.cwd(), 'data/docs')
const componentsDir = path.join(docsDir, 'components')

export function getAllMdxFiles(dir = docsDir): string[] {
  const files: string[] = []
  for (const item of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, item)
    if (fs.statSync(fullPath).isDirectory()) {
      files.push(...getAllMdxFiles(fullPath))
    } else if (item.endsWith('.mdx')) {
      files.push(fullPath)
    }
  }
  return files
}

export function buildLlmsTxt() {
  let combined = '# Tamagui Complete Documentation\n\n'
  combined +=
    '> Tamagui is a complete UI solution for React Native and Web, with a fully-featured UI kit, styling engine, and optimizing compiler.\n\n'
  for (const file of getAllMdxFiles()) {
    const content = fs.readFileSync(file, 'utf-8')
    const relativePath = path.relative(docsDir, file).replace('.mdx', '')
    combined += `\n\n## ${relativePath}\n\n${content}`
  }
  return combined
}

// component slug -> its doc versions, newest first
export function getComponentVersions() {
  const versions = new Map<string, string[]>()
  for (const component of fs.readdirSync(componentsDir)) {
    const componentDir = path.join(componentsDir, component)
    if (!fs.statSync(componentDir).isDirectory()) continue
    versions.set(
      component,
      fs
        .readdirSync(componentDir)
        .filter((file) => file.endsWith('.mdx'))
        .map((file) => file.replace('.mdx', ''))
        .sort()
        .reverse()
    )
  }
  return versions
}

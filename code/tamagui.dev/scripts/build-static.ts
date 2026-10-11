// turns `one build` output into a fully static site in dist/client for
// cloudflare static assets (wrangler.jsonc): writes docs text, Bento source,
// redirects, client-rendered route fallbacks and the 404 page.

import fs from 'node:fs'
import path from 'node:path'
import {
  buildLlmsTxt,
  docsDir,
  getAllMdxFiles,
  getComponentVersions,
} from '../features/docs/docsSourceFiles'
import { redirects } from '../redirects'
import { normalizeSitemapXml } from './sitemap'

const out = path.join(process.cwd(), 'dist/client')
const bentoSourceDir = path.resolve(process.cwd(), '../bento/src')

function write(file: string, content: string) {
  const target = path.join(out, file)
  fs.mkdirSync(path.dirname(target), { recursive: true })
  fs.writeFileSync(target, content)
}

function readBentoSources(dir: string, root = dir) {
  const files = new Map<string, string>()
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      for (const [name, content] of readBentoSources(fullPath, root)) {
        files.set(name, content)
      }
    } else if (/\.tsx?$/.test(entry.name) && !entry.name.endsWith('.d.ts')) {
      files.set(
        path.relative(root, fullPath).split(path.sep).join('/'),
        fs.readFileSync(fullPath, 'utf-8')
      )
    }
  }
  return files
}

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
    .replaceAll(/(['"])\/bento\/images\//g, '$1https://tamagui.dev/bento/images/')
    .replaceAll(/@([\w-]+)\/window:/g, '$1:')
}

function joinSourcePath(dir: string, relative: string) {
  const parts = dir ? dir.split('/') : []
  for (const part of relative.split('/')) {
    if (part === '..') parts.pop()
    else if (part !== '.') parts.push(part)
  }
  return parts.join('/')
}

function mergeBentoSource(
  files: Map<string, string>,
  sourcePath: string,
  seen = new Set<string>()
): string {
  if (seen.has(sourcePath)) return ''
  const source = files.get(sourcePath)
  if (source === undefined) throw new Error(`Missing Bento source file: ${sourcePath}`)
  seen.add(sourcePath)

  const transformed = toAppSource(source)
  let merged = `/** START of the file ${sourcePath.split('/').pop()} */\n${transformed}`
  const dir = sourcePath.split('/').slice(0, -1).join('/')
  for (const [, specifier] of transformed.matchAll(/from\s+['"](\.[^'"]+)['"]/g)) {
    const base = joinSourcePath(dir, specifier)
    for (const extension of ['.native.tsx', '.tsx', '.ts']) {
      const dependency = `${base}${extension}`
      if (files.has(dependency)) {
        merged += mergeBentoSource(files, dependency, seen)
      }
    }
  }
  return merged
}

function writeBentoFiles() {
  const files = readBentoSources(bentoSourceDir)
  const showcaseFiles = [...files.keys()].filter(
    (name) =>
      name.split('/').length === 3 &&
      name.endsWith('.tsx') &&
      !name.endsWith('.native.tsx')
  )

  for (const name of files.keys()) {
    write(`bento-source/${name}`, toAppSource(files.get(name)!))
  }

  for (const name of showcaseFiles) {
    const [section, part, fileName] = name.split('/')
    write(`bento-code/${section}/${part}/${fileName}`, mergeBentoSource(files, name))

    const root = `${section}/${part}`
    const groups: Record<string, Array<{ path: string; downloadUrl: string }>> = {}
    for (const sourcePath of files.keys()) {
      if (!sourcePath.startsWith(`${root}/`)) continue
      const dir = sourcePath.split('/').slice(0, -1).join('/')
      if (dir === root && !sourcePath.split('/').pop()!.includes(fileName.slice(0, -4))) {
        continue
      }
      ;(groups[dir] ||= []).push({
        path: sourcePath,
        downloadUrl: `/bento-source/${sourcePath}`,
      })
    }
    write(
      `bento-manifests/${section}/${part}/${fileName.replace(/\.tsx$/, '.json')}`,
      JSON.stringify(groups)
    )
  }
  return { sourceFiles: files.size, showcaseFiles: showcaseFiles.length }
}

const llms = buildLlmsTxt()
for (const name of ['llms.txt', 'llms-full.txt', 'docs.txt']) {
  write(name, llms)
}

// /docs/<path>.md is the raw source of each docs page
for (const file of getAllMdxFiles()) {
  const relativePath = path.relative(docsDir, file).replace(/\.mdx$/, '')
  write(`docs/${relativePath}.md`, fs.readFileSync(file, 'utf-8'))
}

// /ui/<component>.md is the newest version of that component's docs
for (const [component, versions] of getComponentVersions()) {
  if (!versions[0]) continue
  write(
    `ui/${component}.md`,
    fs.readFileSync(
      path.join(docsDir, 'components', component, `${versions[0]}.mdx`),
      'utf-8'
    )
  )
}

fs.copyFileSync(path.join(out, '+not-found.html'), path.join(out, '404.html'))

// client-rendered catch-all routes (`[...x]+spa`) build one shell, named `=2a.html`
// for the `*` segment; every path under the route renders from it. the shell is
// copied to `_spa.html` because asset paths with `=` redirect to their encoded form
const spaRewrites: string[] = []
function findSpaShells(dir: string) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) findSpaShells(full)
    else if (entry.name === '=2a.html') {
      fs.copyFileSync(full, path.join(dir, '_spa.html'))
      const route = `/${path.relative(out, dir).split(path.sep).join('/')}`
      spaRewrites.push(`${route}/* ${route}/_spa 200`)
    }
  }
}
findSpaShells(out)

write(
  '_redirects',
  [
    ...redirects.map(
      ({ source, destination, permanent }) =>
        `${source} ${destination} ${permanent ? 301 : 302}`
    ),
    ...spaRewrites,
  ].join('\n') + '\n'
)

const bento = writeBentoFiles()

// one build writes sitemap.xml from the rendered routes (see sitemap in
// vite.config.ts); normalize to canonical urls. a missing sitemap fails the
// build loudly instead of shipping without one.
const sitemapPath = path.join(out, 'sitemap.xml')
if (!fs.existsSync(sitemapPath)) {
  throw new Error('static: one build did not write dist/client/sitemap.xml')
}
const sitemap = normalizeSitemapXml(fs.readFileSync(sitemapPath, 'utf-8'))
fs.writeFileSync(sitemapPath, sitemap)
const sitemapUrls = (sitemap.match(/<loc>/g) || []).length

console.info(
  `static: ${redirects.length} redirects, ${spaRewrites.length} client-rendered routes, ${bento.showcaseFiles} Bento showcases, ${bento.sourceFiles} source files, ${sitemapUrls} sitemap urls`
)

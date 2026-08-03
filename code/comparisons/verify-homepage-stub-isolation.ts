#!/usr/bin/env bun

import { readFileSync, writeFileSync } from 'node:fs'

interface ManifestEntry {
  file: string
  imports?: string[]
  dynamicImports?: string[]
}

const args = process.argv.slice(2)
const statsPath = args.find((arg) => !arg.startsWith('--'))
const manifestPath = args.find((arg) => arg.startsWith('--manifest='))?.slice(11)
const ssrManifestPath = args.find((arg) => arg.startsWith('--ssr-manifest='))?.slice(15)
const outputPath = args.find((arg) => arg.startsWith('--output='))?.slice(9)

if (!statsPath || !manifestPath || !ssrManifestPath || !outputPath) {
  throw new Error(
    'usage: bun verify-homepage-stub-isolation.ts STATS --manifest=PATH ' +
      '--ssr-manifest=PATH --output=PATH'
  )
}

const stats = JSON.parse(readFileSync(statsPath, 'utf8')) as {
  selector: { id: string; include: string[] }
  modules: Array<{ id: string }>
}
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8')) as Record<
  string,
  ManifestEntry
>
const ssrManifest = JSON.parse(readFileSync(ssrManifestPath, 'utf8')) as Record<
  string,
  string[]
>
const entry = 'app/(site)/index.tsx'
const visited = new Set<string>()
const reachableChunks = new Set<string>()

function visit(key: string) {
  if (visited.has(key)) return
  visited.add(key)
  const value = manifest[key]
  if (!value) {
    throw new Error(`missing production manifest entry: ${key}`)
  }
  reachableChunks.add(`/${value.file}`)
  for (const dependency of value.imports ?? []) {
    visit(dependency)
  }
}

visit(entry)

const selectedModuleChunks = Object.fromEntries(
  stats.modules.map(({ id }) => {
    const chunks = ssrManifest[id]
    if (!chunks) {
      throw new Error(`missing SSR manifest entry for selected module: ${id}`)
    }
    return [id, [...chunks].sort()]
  })
)
const stubModules = Object.fromEntries(
  Object.entries(ssrManifest)
    .filter(([id]) => id.includes('bento-component-stub:'))
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([id, chunks]) => [id, [...chunks].sort()])
)
const stubChunks = new Set(Object.values(stubModules).flat())
const reachableStubChunks = [...reachableChunks]
  .filter((chunk) => stubChunks.has(chunk))
  .sort()
const selectedStubChunks = [
  ...new Set(
    Object.values(selectedModuleChunks)
      .flat()
      .filter((chunk) => stubChunks.has(chunk))
  ),
].sort()

const report = {
  schemaVersion: 1,
  selector: stats.selector,
  entry,
  graph: 'production manifest static imports',
  note: 'Router-wide dynamic entries from virtual:one-entry are excluded because they are not part of the homepage static import graph.',
  selectedModules: stats.modules.length,
  reachableChunks: [...reachableChunks].sort(),
  selectedModuleChunks,
  stubModules,
  reachableStubChunks,
  selectedStubChunks,
  isolated: reachableStubChunks.length === 0 && selectedStubChunks.length === 0,
}

writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`)
if (!report.isolated) {
  throw new Error(`homepage bundle traverses Bento stub chunks: ${outputPath}`)
}
console.log(
  `${stats.selector.id}: ${stats.modules.length} modules and ${reachableChunks.size} ` +
    `reachable chunks are isolated from ${Object.keys(stubModules).length} Bento stubs`
)

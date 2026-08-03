import { gzipSync } from 'node:zlib'
import { isAbsolute, relative } from 'node:path'
import { writeFileSync } from 'node:fs'

const normalizePath = (value: string) => value.replace(/\\/g, '/')
const base64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
const base64Values = Object.fromEntries([...base64].map((char, index) => [char, index]))

function byteLength(source: string | Uint8Array) {
  return typeof source === 'string' ? Buffer.byteLength(source) : source.byteLength
}

function moduleGroup(id: string) {
  const normalized = normalizePath(id)
  const dependency = normalized.split('node_modules/').at(-1)
  if (dependency !== normalized) {
    const parts = dependency!.split('/')
    return parts[0]!.startsWith('@') ? `${parts[0]}/${parts[1]}` : parts[0]
  }
  const workspace = normalized.match(/(?:^|\/)(?:core|packages)\/([^/]+)\/(?:src|dist)\//)
  if (workspace) return `@tamagui/${workspace[1]}`
  if (normalized.includes('/ui/tamagui/')) return 'tamagui'
  if (normalized.includes('/shared/')) return 'shared benchmark'
  if (normalized.includes('/src/')) return 'fixture'
  return 'build/runtime helpers'
}

function isTamaguiAttributable(group: string) {
  return (
    group !== 'react' &&
    group !== 'react-dom' &&
    group !== 'scheduler' &&
    group !== 'fixture' &&
    group !== 'shared benchmark'
  )
}

function decodeVlq(value: string, start: number) {
  let result = 0
  let shift = 0
  let index = start
  while (index < value.length) {
    const digit = base64Values[value[index++]]
    if (digit === undefined) throw new Error(`invalid source-map VLQ at ${start}`)
    result += (digit & 31) << shift
    if (!(digit & 32)) {
      return { value: result & 1 ? -(result >> 1) : result >> 1, index }
    }
    shift += 5
  }
  throw new Error(`unterminated source-map VLQ at ${start}`)
}

function decodeSegment(segment: string) {
  const values: number[] = []
  for (let index = 0; index < segment.length; ) {
    const decoded = decodeVlq(segment, index)
    values.push(decoded.value)
    index = decoded.index
  }
  return values
}

function generatedAttribution(chunk: any) {
  const map = chunk.map
  if (!map?.mappings || !map.sources) {
    throw new Error(`bundle attribution requires a source map for ${chunk.fileName}`)
  }

  const codeLines = chunk.code.split('\n')
  const mappingLines = map.mappings.split(';')
  const sources: string[] = map.sources
  const sourceByGroup: Record<string, string[]> = {}
  const tamaguiSource: string[] = []
  let mappedBytes = 0
  let sourceIndex = 0
  let originalLine = 0
  let originalColumn = 0
  let nameIndex = 0

  for (let lineIndex = 0; lineIndex < mappingLines.length; lineIndex++) {
    const line = codeLines[lineIndex] || ''
    const encoded = mappingLines[lineIndex]
    if (!encoded) continue
    let generatedColumn = 0
    const mappings: Array<{ column: number; group: string | null }> = []
    for (const segment of encoded.split(',')) {
      const values = decodeSegment(segment)
      generatedColumn += values[0]
      let group: string | null = null
      if (values.length >= 4) {
        sourceIndex += values[1]
        originalLine += values[2]
        originalColumn += values[3]
        if (values.length === 5) nameIndex += values[4]
        const source = sources[sourceIndex]
        if (source !== undefined) group = moduleGroup(source)
      }
      mappings.push({ column: generatedColumn, group })
    }
    for (let index = 0; index < mappings.length; index++) {
      const mapping = mappings[index]
      if (!mapping.group) continue
      const end = mappings[index + 1]?.column ?? line.length
      if (end <= mapping.column) continue
      const source = line.slice(mapping.column, end)
      mappedBytes += byteLength(source)
      ;(sourceByGroup[mapping.group] ||= []).push(source)
      if (isTamaguiAttributable(mapping.group)) tamaguiSource.push(source)
    }
  }

  const groups = Object.entries(sourceByGroup)
    .map(([group, parts]) => {
      const source = parts.join('')
      return {
        group,
        generatedBytes: byteLength(source),
        gzipBytes: gzipSync(source).byteLength,
      }
    })
    .sort(
      (left, right) =>
        right.generatedBytes - left.generatedBytes ||
        left.group.localeCompare(right.group)
    )
  const tamagui = tamaguiSource.join('')
  return {
    mappedBytes,
    unattributedBytes: byteLength(chunk.code) - mappedBytes,
    groups,
    sourceByGroup,
    tamaguiSource: tamagui,
  }
}

export function bundleAttributionPlugin(outputPath: string | undefined, root: string) {
  if (!outputPath) return null
  return {
    name: 'comparison-bundle-attribution',
    config() {
      return { build: { sourcemap: 'hidden' } }
    },
    generateBundle(_options: unknown, bundle: Record<string, any>) {
      const generatedSources: Record<string, string[]> = {}
      const tamaguiSources: string[] = []
      const chunks = Object.values(bundle)
        .filter((output): output is any => output.type === 'chunk')
        .map((chunk) => {
          const generated = generatedAttribution(chunk)
          tamaguiSources.push(generated.tamaguiSource)
          for (const group in generated.sourceByGroup) {
            ;(generatedSources[group] ||= []).push(
              generated.sourceByGroup[group].join('')
            )
          }
          return {
            fileName: chunk.fileName,
            codeBytes: Buffer.byteLength(chunk.code),
            gzipBytes: gzipSync(chunk.code).byteLength,
            mappedBytes: generated.mappedBytes,
            unattributedBytes: generated.unattributedBytes,
            generatedModuleGroups: generated.groups,
            modules: Object.entries(chunk.modules)
              .map(([id, module]: [string, any]) => ({
                id: normalizePath(isAbsolute(id) ? relative(root, id) : id),
                renderedBytes: module.renderedLength,
                originalBytes: module.originalLength,
              }))
              .sort(
                (left, right) =>
                  right.renderedBytes - left.renderedBytes ||
                  left.id.localeCompare(right.id)
              ),
          }
        })
        .sort((left, right) => left.fileName.localeCompare(right.fileName))
      const assets = Object.values(bundle)
        .filter((output): output is any => output.type === 'asset')
        .map((asset) => {
          const bytes = byteLength(asset.source)
          return {
            fileName: asset.fileName,
            bytes,
            gzipBytes: gzipSync(asset.source).byteLength,
          }
        })
        .sort((left, right) => left.fileName.localeCompare(right.fileName))
      writeFileSync(
        outputPath,
        `${JSON.stringify(
          {
            schemaVersion: 2,
            generatedAttributionMethod:
              'gzip of concatenated minified JavaScript spans attributed by the emitted source map; group gzip values are independent and not additive',
            tamaguiAttributableDefinition:
              'all emitted JavaScript except react, react-dom, scheduler, fixture, and shared benchmark spans; unmapped bytes are excluded',
            generatedModuleGroups: Object.entries(generatedSources)
              .map(([group, parts]) => {
                const source = parts.join('')
                return {
                  group,
                  generatedBytes: byteLength(source),
                  gzipBytes: gzipSync(source).byteLength,
                }
              })
              .sort(
                (left, right) =>
                  right.generatedBytes - left.generatedBytes ||
                  left.group.localeCompare(right.group)
              ),
            tamaguiAttributable: (() => {
              const source = tamaguiSources.join('')
              return {
                generatedBytes: byteLength(source),
                gzipBytes: gzipSync(source).byteLength,
              }
            })(),
            chunks,
            assets,
          },
          null,
          2
        )}\n`
      )
    },
  }
}

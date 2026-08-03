import { gzipSync } from 'node:zlib'
import { isAbsolute, relative } from 'node:path'
import { writeFileSync } from 'node:fs'

const normalizePath = (value: string) => value.replaceAll('\\', '/')

function byteLength(source: string | Uint8Array) {
  return typeof source === 'string' ? Buffer.byteLength(source) : source.byteLength
}

export function bundleAttributionPlugin(outputPath: string | undefined, root: string) {
  if (!outputPath) return null
  return {
    name: 'comparison-bundle-attribution',
    generateBundle(_options: unknown, bundle: Record<string, any>) {
      const chunks = Object.values(bundle)
        .filter((output): output is any => output.type === 'chunk')
        .map((chunk) => ({
          fileName: chunk.fileName,
          codeBytes: Buffer.byteLength(chunk.code),
          gzipBytes: gzipSync(chunk.code).byteLength,
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
        }))
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
        `${JSON.stringify({ schemaVersion: 1, chunks, assets }, null, 2)}\n`
      )
    },
  }
}

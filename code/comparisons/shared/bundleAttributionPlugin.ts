import { gzipSync } from 'node:zlib'
import { isAbsolute, relative } from 'node:path'
import { writeFileSync } from 'node:fs'

const normalizePath = (value: string) => value.replaceAll('\\', '/')

function dependencyName(id: string) {
  const normalized = normalizePath(id).split('?')[0]!
  const dependency = normalized.split('node_modules/').at(-1)
  if (!dependency || dependency === normalized) return null
  const parts = dependency.split('/')
  return parts[0]!.startsWith('@') ? `${parts[0]}/${parts[1]}` : parts[0]!
}

function isolatedChunk(id: string) {
  const dependency = dependencyName(id)
  if (
    dependency === 'tamagui' ||
    dependency?.startsWith('@tamagui/') ||
    dependency === '@react-native/normalize-color'
  ) {
    return 'tamagui'
  }
  if (
    dependency === 'react' ||
    dependency === 'react-dom' ||
    dependency === 'scheduler'
  ) {
    return 'react-control'
  }
  if (dependency) return 'other-dependencies'
  const normalized = normalizePath(id).split('?')[0]!
  if (/\/(?:core|packages|ui)\/[^/]+\/dist\//.test(normalized)) return 'tamagui'
}

function byteLength(source: string | Uint8Array) {
  return typeof source === 'string' ? Buffer.byteLength(source) : source.byteLength
}

export function bundleAttributionPlugin(outputPath: string | undefined, root: string) {
  if (!outputPath) return null
  return {
    name: 'comparison-bundle-attribution',
    outputOptions(options: Record<string, any>) {
      if (options.manualChunks) {
        throw new Error('bundle attribution requires sole ownership of manualChunks')
      }
      return {
        ...options,
        manualChunks(id: string) {
          return isolatedChunk(id)
        },
        onlyExplicitManualChunks: true,
      }
    },
    generateBundle(_options: unknown, bundle: Record<string, any>) {
      const chunks = Object.values(bundle)
        .filter((output): output is any => output.type === 'chunk')
        .map((chunk) => ({
          fileName: chunk.fileName,
          name: chunk.name,
          attributionGroup:
            chunk.name === 'tamagui'
              ? 'tamagui'
              : chunk.name === 'react-control'
                ? 'react-control'
                : 'other',
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
      for (const chunk of chunks) {
        const mismatchedModules = chunk.modules.filter(
          (module) => isolatedChunk(module.id) !== chunk.attributionGroup
        )
        if (chunk.attributionGroup !== 'other' && mismatchedModules.length) {
          throw new Error(
            `mixed module ownership in ${chunk.fileName}: ${mismatchedModules.map((module) => module.id).join(', ')}`
          )
        }
      }
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
            decomposition: {
              method:
                'explicit Rollup chunks with onlyExplicitManualChunks, followed by production minification and independent gzip',
              tamaguiIncludes:
                'rendered modules from tamagui, @tamagui/*, Tamagui workspace core/packages/ui dist paths, and @react-native/normalize-color when pulled by the Tamagui runtime, plus their isolated chunk wrapper',
              tamaguiExcludes:
                'fixture code, shared benchmark code, React, react-dom, scheduler, Vite helpers, and dependencies other than the Tamagui runtime color normalizer',
              groups: Object.fromEntries(
                ['tamagui', 'react-control', 'other'].map((group) => {
                  const selected = chunks.filter(
                    (chunk) => chunk.attributionGroup === group
                  )
                  return [
                    group,
                    {
                      chunks: selected.map((chunk) => chunk.fileName),
                      codeBytes: selected.reduce(
                        (total, chunk) => total + chunk.codeBytes,
                        0
                      ),
                      gzipBytes: selected.reduce(
                        (total, chunk) => total + chunk.gzipBytes,
                        0
                      ),
                    },
                  ]
                })
              ),
            },
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

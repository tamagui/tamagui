import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, realpathSync, renameSync, writeFileSync } from 'node:fs'
import { isAbsolute, join, resolve } from 'node:path'

import {
  compileWithUserBabel,
  userBabelCacheKey,
  type MetroBabelTransformArgs,
  type MetroBabelTransformResult,
} from './babel'
import {
  METRO_COMPILER_CACHE_VERSION,
  MetroCompilerCache,
  MetroCompilerCacheError,
} from './compilerCache'
import { metroDiagnostic } from './diagnostics'
import { isCompilerSourceFile } from './metroResolver'
import { applyMetroCompilerPlan, type MetroCompilerLoweringResult } from './lowering'

export interface MetroCompilerTransformerOptions {
  cacheBaseRoot: string
  originalBabelTransformerPath: string
  projectRoot: string
}

export interface MetroCompilerTransformMetadata {
  cacheHit: boolean
  diagnostics: unknown[]
  lowering?: MetroCompilerLoweringResult
}

export function createMetroCompilerTransformer(config: MetroCompilerTransformerOptions): {
  transform(args: MetroBabelTransformArgs): Promise<MetroBabelTransformResult>
  getCacheKey(): string
} {
  // Metro hands workers project-relative filenames while the compiler cache is
  // keyed by absolute realpaths (the frontend realpaths every module). Resolve
  // to the same form or every plan lookup silently misses and the whole build
  // ships unlowered.
  const moduleIdCache = new Map<string, string>()
  const missWarned = new Set<string>()
  function cacheModuleId(filename: string): string {
    let id = moduleIdCache.get(filename)
    if (!id) {
      const absolute = isAbsolute(filename)
        ? filename
        : resolve(config.projectRoot, filename)
      try {
        id = realpathSync(absolute)
      } catch {
        id = absolute
      }
      moduleIdCache.set(filename, id)
    }
    return id
  }
  // Metro also transforms modules the frontend can never plan: bundler-injected
  // polyfills, virtual modules, and node_modules (external by design). A miss
  // is only a lowering defect for a file the frontend's project graph would
  // have crawled.
  function planEligible(moduleId: string): boolean {
    return (
      isCompilerSourceFile(moduleId) &&
      !moduleId.includes(`${join('node_modules')}`) &&
      existsSync(moduleId)
    )
  }
  return {
    async transform(args) {
      const platform =
        typeof args.options.platform === 'string' ? args.options.platform : 'default'
      const cache = new MetroCompilerCache(join(config.cacheBaseRoot, platform))
      let tamagui: MetroCompilerTransformMetadata = {
        cacheHit: false,
        diagnostics: [],
      }
      const moduleId = cacheModuleId(args.filename)
      try {
        // a manifest exists exactly when the frontend planned this build, so a
        // lookup miss on a plannable file is a lowering defect (unlowered
        // output), never routine — surface it instead of silently shipping
        // runtime-path modules
        const entry = await cache.read(moduleId, args.src, (reason, detail) => {
          if (missWarned.has(moduleId) || !planEligible(moduleId)) return
          missWarned.add(moduleId)
          const diagnostic = metroDiagnostic(
            'metro/plan-miss',
            `Lowering plan lookup missed for ${moduleId} (${reason}${detail ? `: ${detail}` : ''}); module ships unlowered`,
            { moduleId }
          )
          tamagui.diagnostics.push(diagnostic)
          console.warn(
            `[@tamagui/metro-plugin] ${diagnostic.code}: ${diagnostic.message}`
          )
        })
        if (entry) {
          try {
            const lowered = await applyMetroCompilerPlan(
              { ...args, filename: moduleId },
              entry.plan,
              config.originalBabelTransformerPath
            )
            return {
              ...lowered.compiled.result,
              metadata: {
                ...lowered.compiled.result.metadata,
                tamagui: {
                  cacheHit: true,
                  diagnostics: entry.diagnostics,
                  lowering: lowered.lowering,
                },
              },
            }
          } catch (error) {
            const diagnostic = metroDiagnostic(
              'metro/cache-corrupt',
              `Cached lowering plan for ${args.filename} could not be applied: ${error instanceof Error ? error.message : String(error)}`,
              { moduleId }
            )
            tamagui = {
              cacheHit: true,
              diagnostics: [...entry.diagnostics, diagnostic],
            }
            console.warn(
              `[@tamagui/metro-plugin] ${diagnostic.code}: ${diagnostic.message}`
            )
          }
        }
      } catch (error) {
        if (!(error instanceof MetroCompilerCacheError)) throw error
        tamagui.diagnostics.push(error.diagnostic)
        console.warn(
          `[@tamagui/metro-plugin] ${error.diagnostic.code}: ${error.diagnostic.message}`
        )
      }
      const compiled = await compileWithUserBabel(
        config.originalBabelTransformerPath,
        args
      )
      return {
        ...compiled.result,
        metadata: {
          ...compiled.result.metadata,
          tamagui,
        },
      }
    },
    getCacheKey() {
      return createHash('sha256')
        .update(`tamagui-metro-compiler-v${METRO_COMPILER_CACHE_VERSION}`)
        .update('\0')
        .update(userBabelCacheKey(config.originalBabelTransformerPath))
        .digest('hex')
    },
  }
}

export function writeMetroCompilerTransformerBridge(
  transformerFactoryPath: string,
  config: MetroCompilerTransformerOptions
): string {
  const serializedConfig = JSON.stringify(config)
  const bridgeHash = createHash('sha256')
    .update(transformerFactoryPath)
    .update('\0')
    .update(serializedConfig)
    .digest('hex')
  const directory = join(config.cacheBaseRoot, 'bridge')
  const bridgePath = join(directory, `${bridgeHash}.cjs`)
  const temporaryPath = `${bridgePath}.${process.pid}.tmp`
  const source = `'use strict'\nmodule.exports = require(${JSON.stringify(
    transformerFactoryPath
  )}).createMetroCompilerTransformer(${serializedConfig})\n`
  mkdirSync(directory, { recursive: true })
  writeFileSync(temporaryPath, source, 'utf8')
  renameSync(temporaryPath, bridgePath)
  return bridgePath
}

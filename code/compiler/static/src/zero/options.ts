import glob from 'fast-glob'
import path from 'node:path'

import type { TamaguiOptions } from '../types'

/**
 * `TAMAGUI_RUNTIME` has exactly two integration-owned literal values. The public
 * `experimental.zeroRuntime` option is the author input; this literal is
 * generated output, so an ambient shell value never reaches a build.
 */
export type TamaguiRuntimeLiteral = 'full' | 'zero'

export type ZeroRuntimeMode = 'off' | 'report' | 'enforce'

export interface ZeroIsland {
  /** Stable, deterministic id derived from the island module's root-relative path. */
  id: string
  /** Absolute path of the island root module. */
  module: string
  /** Absolute path of the generated loader the zero graph imports. */
  loader: string
  /** Absolute path of the generated full-runtime entry. */
  entry: string
}

export interface ZeroRuntimeResolved {
  mode: ZeroRuntimeMode
  islandGlobs: string[]
  islands: ZeroIsland[]
  /** Absolute directory holding generated loaders, entries, and receipts. */
  outDir: string
  /** Absolute path of the single generated CSS artifact. */
  cssPath: string
}

export const ZERO_OUT_DIRNAME = '.tamagui-zero'

/**
 * Island id is the module's basename, which is also the generated loader's
 * filename. Two declared islands may not share a basename.
 */
export function islandIdFor(moduleId: string): string {
  return path.basename(moduleId).replace(/\.[jt]sx?$/, '')
}

export async function resolveZeroRuntime(
  options: Pick<TamaguiOptions, 'experimental' | 'outputCSS' | 'platform'>,
  root: string
): Promise<ZeroRuntimeResolved> {
  const requested = options.experimental?.zeroRuntime
  const outDir = path.join(root, ZERO_OUT_DIRNAME)
  const off: ZeroRuntimeResolved = {
    mode: 'off',
    islandGlobs: [],
    islands: [],
    outDir,
    cssPath: '',
  }
  if (!requested) return off

  if (requested === 'report') {
    return { ...off, mode: 'report' }
  }

  if (options.platform === 'native') {
    throw new Error(
      `[tamagui zero-runtime] experimental.zeroRuntime is web only. A native build always receives TAMAGUI_RUNTIME="full".`
    )
  }

  if (!options.outputCSS) {
    throw new Error(
      `[tamagui zero-runtime] experimental.zeroRuntime requires outputCSS. The bundler owns one generated CSS artifact and derives TAMAGUI_DID_OUTPUT_CSS from it.`
    )
  }

  const islandGlobs = requested === true ? [] : requested.islands
  const matches = islandGlobs.length
    ? await glob(islandGlobs, { cwd: root, absolute: true, dot: false })
    : []
  const islands = [...new Set(matches.map((match) => path.normalize(match)))]
    .sort()
    .map((module): ZeroIsland => {
      const id = islandIdFor(module)
      return {
        id,
        module,
        loader: path.join(outDir, `${id}.loader.js`),
        entry: path.join(outDir, `${id}.entry.js`),
      }
    })

  const seen = new Set<string>()
  for (const island of islands) {
    if (seen.has(island.id)) {
      throw new Error(
        `[tamagui zero-runtime] two declared islands share the basename "${island.id}". Island ids are their module basename because that is also the generated loader's filename.`
      )
    }
    seen.add(island.id)
  }

  if (islandGlobs.length && islands.length === 0) {
    throw new Error(
      `[tamagui zero-runtime] experimental.zeroRuntime.islands matched no module for ${JSON.stringify(
        islandGlobs
      )}`
    )
  }

  return {
    mode: 'enforce',
    islandGlobs,
    islands,
    outDir,
    cssPath: path.isAbsolute(options.outputCSS)
      ? options.outputCSS
      : path.resolve(root, options.outputCSS),
  }
}

export type ZeroIntegration = 'vite' | 'next-webpack' | 'metro-web'

/**
 * Base and island support are enabled per integration after that integration
 * passes its own receipts. One lagging integration never blocks another.
 */
export const ZERO_INTEGRATION_SUPPORT: Record<
  ZeroIntegration,
  { base: boolean; islands: boolean }
> = {
  vite: { base: true, islands: true },
  'next-webpack': { base: true, islands: true },
  'metro-web': { base: true, islands: true },
}

export function assertZeroIntegrationSupport(
  integration: ZeroIntegration,
  resolved: ZeroRuntimeResolved
): void {
  if (resolved.mode !== 'enforce') return
  const support = ZERO_INTEGRATION_SUPPORT[integration]
  if (!support.base) {
    throw new Error(
      `[tamagui zero-runtime] ${integration} has not qualified for zero-runtime output in this version. Use zeroRuntime: "report" or choose a qualified integration.`
    )
  }
  if (resolved.islands.length && !support.islands) {
    throw new Error(
      `[tamagui zero-runtime] ${integration} does not support experimental.zeroRuntime islands in this version. Use zeroRuntime: true without islands or choose an integration with island support.`
    )
  }
}

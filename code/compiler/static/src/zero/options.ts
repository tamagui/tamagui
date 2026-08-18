import { zeroConfigDriverMessage } from '@tamagui/compiler-core'
import type { TamaguiInternalConfig } from '@tamagui/web'
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
  /** The project being built. The graph gate excludes its own package. */
  root: string
  islandGlobs: string[]
  islands: ZeroIsland[]
  /** Absolute directory holding generated loaders, entries, and receipts. */
  outDir: string
  /** Absolute path of the single generated CSS artifact. */
  cssPath: string
}

// under the project's existing generated-output directory, which the repository
// already excludes from git and from the formatter
export const ZERO_OUT_DIRNAME = '.tamagui/zero'

/**
 * Island id is the module's basename, which is also the generated loader's
 * filename. Two declared islands may not share a basename.
 */
export function islandIdFor(moduleId: string): string {
  return path.basename(moduleId).replace(/\.[jt]sx?$/, '')
}

type ZeroRuntimeInput = Pick<TamaguiOptions, 'experimental' | 'outputCSS' | 'platform'>

export async function resolveZeroRuntime(
  options: ZeroRuntimeInput,
  root: string
): Promise<ZeroRuntimeResolved> {
  const early = resolveZeroRuntimeEarly(options, root)
  if (early.done) return early.resolved
  return finishZeroRuntime(
    options,
    root,
    early.islandGlobs,
    early.islandGlobs.length
      ? await glob(early.islandGlobs, { cwd: root, absolute: true, dot: false })
      : []
  )
}

/** The webpack adapter configures itself synchronously, before any hook runs. */
export function resolveZeroRuntimeSync(
  options: ZeroRuntimeInput,
  root: string
): ZeroRuntimeResolved {
  const early = resolveZeroRuntimeEarly(options, root)
  if (early.done) return early.resolved
  return finishZeroRuntime(
    options,
    root,
    early.islandGlobs,
    early.islandGlobs.length
      ? glob.sync(early.islandGlobs, { cwd: root, absolute: true, dot: false })
      : []
  )
}

function resolveZeroRuntimeEarly(
  options: ZeroRuntimeInput,
  root: string
):
  | { done: true; resolved: ZeroRuntimeResolved }
  | { done: false; islandGlobs: string[] } {
  const requested = options.experimental?.zeroRuntime
  const outDir = path.join(root, ZERO_OUT_DIRNAME)
  const off: ZeroRuntimeResolved = {
    mode: 'off',
    root,
    islandGlobs: [],
    islands: [],
    outDir,
    cssPath: '',
  }
  if (!requested) return { done: true, resolved: off }

  if (options.platform === 'native' && requested === 'report') {
    return { done: true, resolved: { ...off, mode: 'report' } }
  }

  if (options.platform === 'native') {
    throw new Error(
      `[tamagui zero-runtime] experimental.zeroRuntime is web only. A native build always receives TAMAGUI_RUNTIME="full".`
    )
  }

  // `report` keeps the full runtime, so it owns no generated artifact and needs
  // no outputCSS. It still runs every per-module analysis.
  if (requested !== 'report' && !options.outputCSS) {
    throw new Error(
      `[tamagui zero-runtime] experimental.zeroRuntime requires outputCSS. The bundler owns one generated CSS artifact and derives TAMAGUI_DID_OUTPUT_CSS from it.`
    )
  }

  if (requested !== 'report' && process.env.TAMAGUI_DOES_SSR_CSS === 'mutates-themes') {
    throw new Error(
      `[tamagui zero-runtime] Rule 4: TAMAGUI_DOES_SSR_CSS="mutates-themes" declares runtime theme mutation. Zero-runtime themes are build-time data. Remove runtime mutation or move that surface to a full-runtime island.`
    )
  }

  return {
    done: false,
    islandGlobs: requested === true || requested === 'report' ? [] : requested.islands,
  }
}

function finishZeroRuntime(
  options: ZeroRuntimeInput,
  root: string,
  islandGlobs: string[],
  matches: string[]
): ZeroRuntimeResolved {
  const outDir = path.join(root, ZERO_OUT_DIRNAME)
  // resolveZeroRuntimeEarly already rejected a missing outputCSS in enforce mode
  const outputCSS = (options.outputCSS ?? '') as string
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
    mode: options.experimental?.zeroRuntime === 'report' ? 'report' : 'enforce',
    root,
    islandGlobs,
    islands,
    outDir,
    cssPath: !outputCSS
      ? ''
      : path.isAbsolute(outputCSS)
        ? outputCSS
        : path.resolve(root, outputCSS),
  }
}

/**
 * Rule 5 at config level. A non-CSS driver in the zero entry's own config means
 * every animated component in that graph needs a component animation runtime,
 * which is exactly what the mode removes.
 */
export function assertZeroConfigDrivers(config: TamaguiInternalConfig): void {
  // `animationDrivers` is set only for a multi-driver config; a single-driver
  // config resolves to `animations`, and reading only the map would make this
  // check silently unable to fail for the ordinary shape
  const drivers: [string, { outputStyle?: unknown } | undefined][] = (
    config.animationDrivers
      ? Object.entries(config.animationDrivers)
      : [['default', config.animations]]
  ) as [string, { outputStyle?: unknown } | undefined][]
  for (const [name, driver] of drivers) {
    if (!driver || driver.outputStyle === 'css') continue
    throw new Error(zeroConfigDriverMessage(name, driver.outputStyle))
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

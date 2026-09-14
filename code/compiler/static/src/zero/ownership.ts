import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import path from 'node:path'

import type { TamaguiOptions } from '../types'
import { resolveZeroRuntimeSync } from './options'

/**
 * Artifact ownership, shared by every integration and by both CSS tiers.
 *
 * A build may claim `TAMAGUI_DID_OUTPUT_CSS='1'` only after the artifact that
 * replaces the stripped JavaScript rules is proven to exist, to match the CSS
 * this build's config generates, and to be loaded by the entry graph. Those are
 * three separate failures with three separate causes, so they are three
 * separate diagnostics.
 */

export type GlobalCSSFailureKind = 'missing' | 'stale' | 'unimported'

export interface GlobalCSSFailure {
  kind: GlobalCSSFailureKind
  cssPath: string
  message: string
}

export const hashCSS = (css: string) =>
  createHash('sha256').update(css).digest('hex').slice(0, 16)

const normalize = (value: string) => value.split(/[?#]/, 1)[0]!.replace(/\\/g, '/')

/**
 * `TAMAGUI_DOES_SSR_CSS='mutates-themes'` declares that themes are mutated at
 * runtime, which is the one declaration that keeps the runtime theme generator
 * alive. It therefore blocks the compiled-global-CSS claim outright.
 */
export const declaresRuntimeThemeMutation = () =>
  process.env.TAMAGUI_DOES_SSR_CSS === 'mutates-themes'

export interface GlobalCSSOwnership {
  /** Absolute path of the artifact this build owns. */
  cssPath: string
}

/**
 * The compiled-global-CSS tier for one web build, or null when the build is not
 * in that tier.
 *
 * Zero mode owns its own combined artifact and derives the flag through
 * `ZeroCSSArtifact`, so it is deliberately excluded here: one tier, one owner.
 */
export function resolveGlobalCSSOwnership(
  options: Pick<TamaguiOptions, 'experimental' | 'outputCSS' | 'platform' | 'disable'>,
  root: string
): GlobalCSSOwnership | null {
  if (options.disable) return null
  if (options.platform === 'native') return null
  if (!options.outputCSS) return null
  if (declaresRuntimeThemeMutation()) return null
  if (resolveZeroRuntimeSync(options, root).mode === 'enforce') return null
  return {
    cssPath: path.isAbsolute(options.outputCSS)
      ? options.outputCSS
      : path.resolve(root, options.outputCSS),
  }
}

/**
 * The three ways the stripping fact and its replacement asset can diverge.
 *
 * `loadedModuleIds` is the set of module ids the entry graph actually shipped.
 * An integration that publishes the artifact as a static file rather than as a
 * graph module passes the published copy's path instead, which is the same
 * question asked of a different transport.
 */
export function checkGlobalCSSArtifact(input: {
  cssPath: string
  expectedCSS: string
  loadedModuleIds: Iterable<string>
  /** How the entry is expected to reach the artifact, printed on failure. */
  importHint: string
}): GlobalCSSFailure | null {
  const { cssPath, expectedCSS } = input
  let onDisk: string
  try {
    onDisk = readFileSync(cssPath, 'utf8')
  } catch {
    return {
      kind: 'missing',
      cssPath,
      message: `[tamagui] the generated CSS artifact ${cssPath} does not exist, so this build cannot claim TAMAGUI_DID_OUTPUT_CSS. The design-system, :root, font and theme rules would be stripped from JavaScript and put nowhere.`,
    }
  }
  if (onDisk !== expectedCSS) {
    return {
      kind: 'stale',
      cssPath,
      message: `[tamagui] the generated CSS artifact ${cssPath} is stale: it hashes ${hashCSS(
        onDisk
      )} but this build's config generates ${hashCSS(
        expectedCSS
      )}. Deriving TAMAGUI_DID_OUTPUT_CSS from it would ship rules that do not match the build.`,
    }
  }
  const wanted = normalize(cssPath)
  for (const id of input.loadedModuleIds) {
    if (normalize(id) === wanted) return null
  }
  return {
    kind: 'unimported',
    cssPath,
    message: `[tamagui] the generated CSS artifact ${cssPath} exists but the entry graph never loads it. ${input.importHint}`,
  }
}

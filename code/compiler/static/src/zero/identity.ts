import { LOWERED_MODULE_PLAN_VERSION } from '@tamagui/compiler-core'
import { createHash } from 'node:crypto'

import type { TamaguiRuntimeLiteral } from './options'

/**
 * Bumped whenever the zero transform's emitted output changes shape. It rides
 * the lowering plan version so a compiler change also invalidates zero caches.
 */
export const ZERO_COMPILER_VERSION = `zero-1/plan-${LOWERED_MODULE_PLAN_VERSION}`

/**
 * Every integration records this tuple in its cache and build identity. The CSS
 * path alone is insufficient because the artifact's content can change in place.
 */
export interface ZeroArtifactIdentity {
  runtimeLiteral: TamaguiRuntimeLiteral
  target: 'web' | 'native'
  configGeneration: string
  cssHash: string
  compilerVersion: string
  islandEntries: string[]
  bridgeManifestHash: string
  islandOutputHashes: Record<string, string>
}

export function hashZeroIdentity(identity: ZeroArtifactIdentity): string {
  const canonical = {
    runtimeLiteral: identity.runtimeLiteral,
    target: identity.target,
    configGeneration: identity.configGeneration,
    cssHash: identity.cssHash,
    compilerVersion: identity.compilerVersion,
    islandEntries: [...identity.islandEntries].sort(),
    bridgeManifestHash: identity.bridgeManifestHash,
    islandOutputHashes: Object.fromEntries(
      Object.entries(identity.islandOutputHashes).sort(([left], [right]) =>
        left < right ? -1 : left > right ? 1 : 0
      )
    ),
  }
  return createHash('sha256').update(JSON.stringify(canonical)).digest('hex').slice(0, 24)
}

export function hashBridgeManifest(manifest: unknown): string {
  return createHash('sha256').update(JSON.stringify(manifest)).digest('hex').slice(0, 16)
}

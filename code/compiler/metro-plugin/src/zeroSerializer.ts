import { mkdirSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'
import { gzipSync } from 'node:zlib'

import Static from '@tamagui/static'
import type { ZeroGraphReceipt } from '@tamagui/static'

import {
  finalizeMetroZero,
  writeIslandRuntimeShims,
  ZERO_CSS_FILENAME,
  ZERO_ISLAND_DIRNAME,
  type MetroZeroController,
} from './zeroRuntime'

/**
 * Metro's serializer-time gate and the resolver redirects the island bundle
 * needs.
 *
 * The serializer is the first point where Metro's whole module graph exists,
 * so it is where the forbidden-module check runs. It is not where erasure
 * happens: Metro fixes dependencies at resolution, so by serializer time a
 * surviving import is already a graph member. That is the point of checking
 * here rather than fixing here.
 */

const requireFromPlugin = createRequire(
  typeof __filename === 'string' ? __filename : import.meta.url
)

// version-pinned, not a feature-detection chain: this is the serializer the
// repository's Metro ships, and it is used only when the app supplied none
const baseJSBundle = requireFromPlugin(
  'metro/private/DeltaBundler/Serializers/baseJSBundle'
).default as (entryPoint: any, preModules: any, graph: any, options: any) => any
const bundleToString = requireFromPlugin('metro/private/lib/bundleToString').default as (
  bundle: any
) => { code: string; map: string }

type MetroConfigInput = Record<string, any>

export function applyMetroZeroRuntime(
  metroConfig: MetroConfigInput,
  zero: MetroZeroController
): void {
  if (zero.islandBuild) {
    // Metro has no externals option, so React is redirected through generated
    // shim modules that read the handoff the island loader publishes
    const shims = writeIslandRuntimeShims(zero.resolved.outDir)
    const userResolveRequest = metroConfig.resolver?.resolveRequest
    metroConfig.resolver = {
      ...metroConfig.resolver,
      resolveRequest(context: any, moduleName: string, platform: string | null) {
        const shim = shims[moduleName]
        if (shim) return { type: 'sourceFile', filePath: shim }
        return userResolveRequest
          ? userResolveRequest(context, moduleName, platform)
          : context.resolveRequest(context, moduleName, platform)
      },
    }
  }

  const userSerializer = metroConfig.serializer?.customSerializer
  metroConfig.serializer = {
    ...metroConfig.serializer,
    async customSerializer(entryPoint: any, preModules: any, graph: any, opts: any) {
      const receipt = checkGraph(zero, entryPoint, graph)
      const output = userSerializer
        ? await userSerializer(entryPoint, preModules, graph, opts)
        : bundleToString(baseJSBundle(entryPoint, preModules, graph, opts)).code

      const finalized = finalizeMetroZero({
        controller: zero,
        bundleCode: typeof output === 'string' ? output : '',
      })

      if (!zero.islandBuild) {
        mkdirSync(zero.publicDir, { recursive: true })
        const css = zero.artifact.css()
        const published = path.join(zero.publicDir, ZERO_CSS_FILENAME)
        writeFileSync(published, css)
        // the served copy is what the page loads, so it is the one the claim
        // depends on: read it back rather than trusting the write
        const publishFailure = Static.checkGlobalCSSArtifact({
          cssPath: published,
          expectedCSS: css,
          loadedModuleIds: [published],
          importHint: '',
        })
        if (publishFailure) throw new Error(publishFailure.message)
        receipt.cssArtifact = { path: zero.cssHref, hash: finalized.hash }
        receipt.gzip = {
          [ZERO_CSS_FILENAME]: gzipSync(Buffer.from(css), { level: 9 }).length,
          bundle: gzipSync(Buffer.from(typeof output === 'string' ? output : ''), {
            level: 9,
          }).length,
        }
        const bridgeManifest = Static.canonicalizeBridgeManifest(
          Object.fromEntries(
            [...zero.bridges.entries()].sort(([left], [right]) => (left < right ? -1 : 1))
          )
        )
        const identityInputs = {
          runtimeLiteral: 'zero' as const,
          target: 'web' as const,
          configGeneration: Static.hashBridgeManifest(zero.configCSS),
          cssHash: finalized.hash,
          compilerVersion: Static.ZERO_COMPILER_VERSION,
          islandEntries: zero.resolved.islands.map((island) => island.module),
          bridgeManifestHash: Static.hashBridgeManifest(bridgeManifest),
          islandOutputHashes: finalized.islandOutputHashes,
        }
        receipt.identity = Static.hashZeroIdentity(identityInputs)
        receipt.plansRestoredFromCache = zero.plansRestoredFromCache
        Static.writeZeroGraphReceipt(zero.resolved.outDir, 'metro-zero', receipt)
        writeFileSync(
          path.join(zero.resolved.outDir, 'metro-zero.bridges.json'),
          `${JSON.stringify(
            { identity: receipt.identity, identityInputs, bridges: bridgeManifest },
            null,
            2
          )}\n`
        )
        if (receipt.forbidden.length) {
          throw new Error(Static.formatZeroGraphFailure(receipt))
        }
        console.info(
          `  ➡ [tamagui zero-runtime] ${receipt.moduleCount} modules, 0 forbidden, css ${receipt.gzip[ZERO_CSS_FILENAME]} gzip, islands: ${
            zero.resolved.islands.map((island) => island.id).join(', ') || 'none'
          }`
        )
      }

      return output
    },
  }
}

function checkGraph(
  zero: MetroZeroController,
  entryPoint: string,
  graph: { dependencies: Map<string, any> }
): ZeroGraphReceipt {
  const modules: { id: string; importers: string[] }[] = []
  const importerEdges = new Map<string, string[]>()
  for (const [id, module] of graph.dependencies) {
    const importers = [...(module.inverseDependencies ?? [])] as string[]
    importerEdges.set(id, importers)
    modules.push({ id, importers })
  }
  const escape = Static.erasedExportEscape({
    integration: 'metro-web',
    transformed: zero.transformed,
    erasedExports: zero.erasedExports,
    importersOf: importerEdges,
  })
  if (escape) throw new Error(escape)
  const checked = Static.checkZeroGraph({
    entries: [entryPoint],
    modules,
    importerEdges,
    root: zero.resolved.root,
  })
  return {
    integration: 'metro-web',
    graph: zero.islandBuild ? 'island' : 'zero',
    entries: [entryPoint],
    moduleCount: modules.length,
    tamaguiModules: checked.tamaguiModules,
    forbidden: checked.forbidden,
    cssArtifact: null,
    identity: '',
  }
}

import Static from '@tamagui/static'
import type {
  IslandThemeBridge,
  TamaguiOptions,
  ZeroCSSArtifact,
  ZeroGraphReceipt,
  ZeroIsland,
  ZeroRuntimeResolved,
  ZeroViolationSite,
} from '@tamagui/static'
import { createHash } from 'node:crypto'
import { gzipSync } from 'node:zlib'
import { readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'

/**
 * Vite's half of the zero-runtime mode.
 *
 * The plugin owns the one generated CSS artifact, runs each declared island as a
 * separate full-runtime child build, and proves the emitted zero graph contains
 * no forbidden Tamagui module before it lets the build succeed.
 */

export const ZERO_CSS_FILENAME = 'tamagui-zero.css'
export const ZERO_ISLAND_DIRNAME = 'tamagui-islands'

export interface ZeroIslandBuildContext {
  islandId: string
  artifact: ZeroCSSArtifact
}

export interface ZeroRuntimeController {
  /** The loaded build options, captured before the loader can be torn down. */
  options: TamaguiOptions
  resolved: ZeroRuntimeResolved
  artifact: ZeroCSSArtifact
  cssHref: string
  bridges: Map<string, IslandThemeBridge[]>
  /** Every zero-contract violation seen this build, aggregated before failing. */
  violations: ZeroViolationSite[]
  loaderIds: Map<string, string>
  islandModuleIds: Map<string, string>
  isEnforcing: boolean
}

const normalizePath = (value: string) => value.replace(/\\/g, '/')

/**
 * Import specifiers may or may not carry an extension, so both sides of the
 * island lookup are compared without one.
 */
export const zeroModuleKey = (value: string) =>
  normalizePath(value).replace(/\.(?:js|jsx|ts|tsx|mjs|cjs)$/, '')

export async function createZeroRuntimeController(
  options: TamaguiOptions,
  root: string,
  base: string
): Promise<ZeroRuntimeController | null> {
  const resolved = await Static.resolveZeroRuntime(options, root)
  if (resolved.mode !== 'enforce') return null
  Static.assertZeroIntegrationSupport('vite', resolved)

  const cssHref = `${base.endsWith('/') ? base : `${base}/`}${ZERO_CSS_FILENAME}`
  const artifact = new Static.ZeroCSSArtifact(resolved.cssPath)
  artifact.expectIslands(resolved.islands.map((island) => island.id))

  const configPath = path.isAbsolute(options.config || '')
    ? options.config!
    : path.resolve(root, options.config || 'tamagui.config.ts')

  for (const island of resolved.islands) {
    Static.writeIslandModules({
      island,
      configPath,
      scriptUrl: `${base.endsWith('/') ? base : `${base}/`}${ZERO_ISLAND_DIRNAME}/${island.id}.js`,
      cssHref,
    })
  }

  return {
    options,
    resolved,
    artifact,
    cssHref,
    bridges: new Map(),
    violations: [],
    loaderIds: new Map(
      resolved.islands.map((island) => [zeroModuleKey(island.loader), island.id])
    ),
    islandModuleIds: new Map(
      resolved.islands.map((island) => [zeroModuleKey(island.module), island.id])
    ),
    isEnforcing: true,
  }
}

/**
 * Builds one island as a separate bundler invocation with
 * `TAMAGUI_RUNTIME='full'`. React is externalized to the handoff the generated
 * loader publishes, so both graphs share one React instance.
 */
export async function buildIsland(input: {
  island: ZeroIsland
  controller: ZeroRuntimeController
  root: string
  outDir: string
  mode: string
}): Promise<{ file: string; hash: string }> {
  const { build } = await import('vite')
  const { createTamaguiPlugins } = await import('./plugin')

  const islandOutDir = path.join(input.outDir, ZERO_ISLAND_DIRNAME)
  await build({
    configFile: false,
    root: input.root,
    mode: 'production',
    logLevel: 'warn',
    define: {
      'process.env.TAMAGUI_RUNTIME': JSON.stringify('full'),
      'process.env.TAMAGUI_DID_OUTPUT_CSS': JSON.stringify('1'),
      // the island is a separately built artifact, never a dev asset, so it is
      // always a production build and always uses react/jsx-runtime
      'process.env.NODE_ENV': JSON.stringify('production'),
    },
    esbuild: { jsx: 'automatic', jsxDev: false },
    plugins: [
      createTamaguiPlugins({
        ...input.controller.options,
        outputCSS: null,
        experimental: {
          ...input.controller.options.experimental,
          zeroRuntime: undefined,
        },
        zeroIslandBuild: {
          islandId: input.island.id,
          artifact: input.controller.artifact,
        },
      }).plugins,
    ],
    build: {
      // a normal application build, not library mode: the island must go through
      // the same transform pipeline the zero entry does
      outDir: islandOutDir,
      emptyOutDir: false,
      cssCodeSplit: false,
      minify: input.mode === 'production',
      sourcemap: false,
      rollupOptions: {
        input: input.island.entry,
        external: Object.keys(Static.ISLAND_EXTERNAL_GLOBALS),
        output: {
          format: 'iife',
          name: `tamaguiIsland_${input.island.id}`,
          entryFileNames: `${input.island.id}.js`,
          globals: Static.ISLAND_EXTERNAL_GLOBALS,
          inlineDynamicImports: true,
        },
      },
    },
  })

  const file = path.join(islandOutDir, `${input.island.id}.js`)
  const contents = readFileSync(file)
  input.controller.artifact.markIslandComplete(input.island.id)
  return {
    file,
    hash: createHash('sha256').update(contents).digest('hex').slice(0, 16),
  }
}

export function finalizeZeroCSS(
  controller: ZeroRuntimeController,
  outDir: string
): { href: string; hash: string; bytes: number; gzip: number } {
  const written = controller.artifact.write()
  if (!written.complete) {
    throw new Error(
      `[tamagui zero-runtime] cannot derive TAMAGUI_DID_OUTPUT_CSS: the generated CSS artifact is missing ${written.missing.join(
        ', '
      )}`
    )
  }
  const css = controller.artifact.css()
  const target = path.join(outDir, ZERO_CSS_FILENAME)
  writeFileSync(target, css)
  return {
    href: controller.cssHref,
    hash: written.hash,
    bytes: Buffer.byteLength(css),
    gzip: gzipSync(Buffer.from(css), { level: 9 }).length,
  }
}

export function assertZeroGraph(receipt: ZeroGraphReceipt): void {
  if (receipt.forbidden.length === 0) return
  throw new Error(Static.formatZeroGraphFailure(receipt))
}

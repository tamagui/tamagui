import Static from '@tamagui/static'
import type { TamaguiOptions } from '@tamagui/types'
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { gzipSync } from 'node:zlib'
import type { Compiler, RuleSetRule } from 'webpack'
import webpack from 'webpack'
import { requireResolve } from './requireResolve'
import {
  buildWebpackIsland,
  collectDefinitions,
  collectZeroBuildInfo,
  flattenModules,
  getWebpackZeroController,
  ZERO_CSS_FILENAME,
} from './zeroRuntime'

export type PluginOptions = TamaguiOptions & {
  isServer?: boolean
  exclude?: RuleSetRule['exclude']
  test?: RuleSetRule['test']
  jsLoader?: any
  disableEsbuildLoader?: boolean
  disableModuleJSXEntry?: boolean
  disableWatchConfig?: boolean
  disableAliases?: boolean
  useTamaguiSVG?: boolean
}

/**
 * One generation of the owned CSS artifact per build process, shared by every
 * compilation in it.
 */
const globalCSSGeneration = new Map<string, Promise<string>>()

function generateGlobalCSSOnce(
  cssPath: string,
  generate: () => Promise<string>
): Promise<string> {
  let pending = globalCSSGeneration.get(cssPath)
  if (!pending) {
    pending = generate()
    globalCSSGeneration.set(cssPath, pending)
  }
  return pending
}

export class TamaguiPlugin {
  pluginName = 'TamaguiPlugin'

  constructor(
    public options: PluginOptions = {
      platform: 'web',
      components: ['@tamagui/core'],
    }
  ) {}

  /**
   * The compiled-global-CSS tier: ordinary compiled Tamagui plus an owned
   * `outputCSS` artifact. `withTamagui` already inlined
   * `TAMAGUI_DID_OUTPUT_CSS='1'`, so this proves the artifact that replaces the
   * stripped rules exists, matches this build's config, and is in the client
   * graph. A build that cannot prove all three fails instead of shipping.
   */
  applyGlobalCSS(compiler: Compiler) {
    const root = this.options.root || compiler.context || process.cwd()
    if (compiler.options.mode === 'development') return
    const globalCSS = Static.resolveGlobalCSSOwnership(
      { platform: 'web', ...this.options },
      root
    )
    if (!globalCSS) return

    // Every compilation waits on the same generation, because Next builds the
    // server and client together and both resolve the app module that imports
    // the artifact. Generating it only on the client fails a build whose
    // artifact does not exist yet with "Module not found" on whichever pass
    // resolves first. Generating it once, before either resolves, is also what
    // keeps a later compilation from silently recreating a file this build
    // deliberately invalidated.
    let expectedCSS = ''
    compiler.hooks.beforeCompile.tapPromise(this.pluginName, async () => {
      expectedCSS = await generateGlobalCSSOnce(globalCSS.cssPath, async () => {
        const { projectInfo } = await Static.loadCompilerProject({
          root,
          target: 'web',
          options: { components: ['tamagui'], ...this.options },
          generation: 'next-webpack:global-css',
          missingProjectMessage:
            '[tamagui] outputCSS is set but the Tamagui config did not evaluate, so no CSS artifact can be generated',
        })
        return projectInfo.tamaguiConfig!.getCSS()
      })
    })

    // the client compilation is the entry graph that has to load the artifact
    if (this.options.isServer) return

    compiler.hooks.afterEmit.tap(this.pluginName, (compilation) => {
      const loadedModuleIds: string[] = []
      for (const module of flattenModules(compilation.modules)) {
        const resource = (module as any)?.resource as string | undefined
        if (resource) loadedModuleIds.push(resource)
      }
      const failure = Static.checkGlobalCSSArtifact({
        cssPath: globalCSS.cssPath,
        expectedCSS,
        loadedModuleIds,
        importHint: `Import it once from your root layout or _app: import ${JSON.stringify(
          relativeImportSpecifier(root, globalCSS.cssPath)
        )}`,
      })
      if (failure) throw new Error(failure.message)
    })
  }

  /**
   * The zero-runtime half: the plugin owns the one generated CSS artifact, runs
   * each declared island as a separate full-runtime compilation, and proves the
   * emitted client graph carries no forbidden Tamagui module.
   */
  applyZeroRuntime(compiler: Compiler) {
    const root = this.options.root || compiler.context || process.cwd()
    const zero = getWebpackZeroController({ platform: 'web', ...this.options }, root)
    if (!zero || zero.islandBuild) return

    compiler.hooks.beforeCompile.tapPromise(this.pluginName, async () => {
      const { projectInfo } = await Static.loadCompilerProject({
        root,
        target: 'web',
        options: { components: ['tamagui'], ...this.options },
        generation: 'next-webpack:zero-runtime',
        missingProjectMessage:
          '[tamagui zero-runtime] the Tamagui config did not evaluate, so no CSS artifact can be generated',
      })
      if (zero.isEnforcing) Static.assertZeroConfigDrivers(projectInfo.tamaguiConfig!)
      const configCSS = projectInfo.tamaguiConfig!.getCSS()
      zero.configHash = createHash('sha256').update(configCSS).digest('hex').slice(0, 16)
      zero.artifact.setConfigCSS(configCSS)
    })

    // the client compilation is the zero entry graph and owns the gates
    if (this.options.isServer) return

    compiler.hooks.afterEmit.tapPromise(this.pluginName, async (compilation) => {
      // Replay every module's recorded CSS, bridge rules and violations. A warm
      // webpack cache skips the loader, so reading these off the loader's own
      // return path would emit an artifact missing every rule this process never
      // collected and silently drop violations that must fail the build.
      // The client compilation is the whole zero entry graph, so its modules are
      // the complete set: reset first rather than accumulate across compilations.
      zero.artifact.clearGraphs()
      zero.bridges.clear()
      zero.violations.length = 0
      const collected = collectZeroBuildInfo(zero, compilation.modules)

      // Written in both modes and before the failure, so `report` and `enforce`
      // emit the identical list and only their exit differs.
      Static.writeZeroViolationReport(zero.resolved.outDir, 'next-zero', {
        integration: 'next-webpack',
        mode: zero.isEnforcing ? 'enforce' : 'report',
        violations: zero.violations,
      })
      if (!zero.isEnforcing) return
      if (zero.violations.length) {
        throw new Error(Static.formatZeroViolations(zero.violations))
      }

      const islandOutputHashes: Record<string, string> = {}
      for (const island of zero.resolved.islands) {
        const built = await buildWebpackIsland({
          island,
          controller: zero,
          webpack,
          mode: compiler.options.mode === 'development' ? 'development' : 'production',
          resolve: compiler.options.resolve,
          defines: collectDefinitions(compiler),
          moduleRules: [
            {
              test: /\.tsx?$/,
              exclude: /node_modules/,
              use: [
                {
                  loader: requireResolve('esbuild-loader'),
                  options: { target: 'es2020', jsx: 'automatic', loader: 'tsx' },
                },
                {
                  loader: requireResolve('tamagui-loader'),
                  options: { ...this.options, isServer: false },
                },
              ],
            },
          ],
        })
        islandOutputHashes[island.id] = built.hash
      }

      const written = zero.artifact.write()
      if (!written.complete) {
        throw new Error(
          `[tamagui zero-runtime] cannot derive TAMAGUI_DID_OUTPUT_CSS: the generated CSS artifact is missing ${written.missing.join(
            ', '
          )}`
        )
      }
      const css = zero.artifact.css()
      mkdirSync(zero.publicDir, { recursive: true })
      const published = join(zero.publicDir, ZERO_CSS_FILENAME)
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

      // a generated or virtual module has no resource, so fall back to its
      // webpack identifier: the graph check ignores non-absolute ids, and the
      // importer chain still needs those nodes to reach an entry
      const moduleId = (module: unknown) =>
        ((module as any)?.resource as string | undefined) ??
        ((module as any)?.identifier?.() as string | undefined)

      const modules: { id: string; importers: string[] }[] = []
      const importerEdges = new Map<string, string[]>()
      // scope hoisting reports one ConcatenatedModule in place of everything it
      // merged, so the top level alone hides most of what actually shipped
      for (const module of flattenModules(compilation.modules)) {
        const id = moduleId(module)
        if (!id) continue
        const importers: string[] = []
        const issuer = moduleId(compilation.moduleGraph.getIssuer(module))
        if (issuer) importers.push(issuer)
        for (const connection of compilation.moduleGraph.getIncomingConnections(module)) {
          const origin = moduleId(connection.originModule)
          if (origin && !importers.includes(origin)) importers.push(origin)
        }
        importerEdges.set(id, importers)
        modules.push({ id, importers })
      }
      const entries: string[] = []
      for (const [, entry] of compilation.entries) {
        for (const dependency of entry.dependencies) {
          const id = moduleId(compilation.moduleGraph.getModule(dependency))
          if (id) entries.push(id)
        }
      }

      const escape = Static.erasedExportEscape({
        integration: 'next-webpack',
        transformed: collected.transformed,
        erasedExports: collected.erasedExports,
        importersOf: importerEdges,
      })
      if (escape) throw new Error(escape)
      const checked = Static.checkZeroGraph({
        entries,
        modules,
        importerEdges,
        root: zero.resolved.root,
      })
      const bridgeManifest = Static.canonicalizeBridgeManifest(
        Object.fromEntries(
          [...zero.bridges.entries()].sort(([left], [right]) => (left < right ? -1 : 1))
        )
      )
      const identityInputs = {
        runtimeLiteral: 'zero' as const,
        target: 'web' as const,
        configGeneration: zero.configHash,
        cssHash: written.hash,
        compilerVersion: Static.ZERO_COMPILER_VERSION,
        islandEntries: zero.resolved.islands.map((island) => island.module),
        bridgeManifestHash: Static.hashBridgeManifest(bridgeManifest),
        islandOutputHashes,
      }
      const receipt = {
        integration: 'next-webpack',
        graph: 'zero' as const,
        entries: entries.sort(),
        moduleCount: modules.length,
        tamaguiModules: checked.tamaguiModules,
        forbidden: checked.forbidden,
        cssArtifact: { path: zero.cssHref, hash: written.hash },
        identity: Static.hashZeroIdentity(identityInputs),
        gzip: {
          [ZERO_CSS_FILENAME]: gzipSync(Buffer.from(css), { level: 9 }).length,
        },
        plansRestoredFromCache: collected.restored > 0,
      }
      Static.writeZeroGraphReceipt(zero.resolved.outDir, 'next-zero', receipt)
      writeFileSync(
        join(zero.resolved.outDir, 'next-zero.bridges.json'),
        `${JSON.stringify({ identity: receipt.identity, identityInputs, bridges: bridgeManifest }, null, 2)}\n`
      )
      if (receipt.forbidden.length) {
        throw new Error(Static.formatZeroGraphFailure(receipt))
      }
      console.info(
        `  ➡ [tamagui zero-runtime] ${modules.length} modules, 0 forbidden, css ${receipt.gzip[ZERO_CSS_FILENAME]} gzip, islands: ${
          zero.resolved.islands.map((island) => island.id).join(', ') || 'none'
        }`
      )
    })
  }

  safeResolves = (resolves: [string, string][], multiple = false) => {
    const res: string[][] = []
    for (const [out, mod] of resolves) {
      if (out.endsWith('$')) {
        res.push([out, mod])
        continue
      }
      try {
        res.push([out, requireResolve(mod)])
        if (multiple) {
          res.push([out, requireResolve(mod)])
        }
      } catch (err) {
        if (out.includes(`@gorhom/bottom-sheet`)) {
          continue
        }
        if (process.env.DEBUG?.startsWith('tamagui')) {
          console.info(`  withTamagui skipping resolving ${out}`, err)
        }
      }
    }
    return res
  }

  get componentsFullPaths() {
    return this.safeResolves(
      this.options.components?.map(
        (moduleName) => [moduleName, moduleName] as [string, string]
      ) || [],
      true
    )
  }

  get componentsBaseDirs() {
    return this.componentsFullPaths.map(([_, fullPath]) => {
      let rootPath = dirname(fullPath as string)
      while (rootPath.length > 1) {
        const pkg = join(rootPath, 'package.json')
        const hasPkg = existsSync(pkg)
        if (hasPkg) {
          return rootPath
        }
        rootPath = join(rootPath, '..')
      }
      throw new Error(`Couldn't find package.json in any path above: ${fullPath}`)
    })
  }

  isInComponentModule = (fullPath: string) => {
    return this.componentsBaseDirs.some((componentDir) =>
      fullPath.startsWith(componentDir)
    )
  }

  get defaultAliases() {
    return Object.fromEntries(
      this.safeResolves([
        ['@tamagui/core/reset.css', '@tamagui/core/reset.css'],

        // fixes https://github.com/kentcdodds/mdx-bundler/issues/143
        // `react/jsx-runtime` and `react/jsx-dev-runtime` will break the build in nextjs 15 + app router
        ['react/jsx-runtime.js', 'react/jsx-runtime'],
        ['react/jsx-dev-runtime.js', 'react/jsx-dev-runtime'],

        ...(this.options.useTamaguiSVG
          ? [['react-native-svg', '@tamagui/react-native-svg'] as [string, string]]
          : ([] as any)),

        ...(this.options.useReactNativeWebLite
          ? [
              ['react-native$', '@tamagui/react-native-web-lite'],
              ['react-native-web$', '@tamagui/react-native-web-lite'],
            ]
          : [
              ['react-native$', 'react-native-web'],
              ['react-native-web$', 'react-native-web'],
            ]),
      ])
    )
  }

  apply(compiler: Compiler) {
    // Prime the same main-process config used by the shared compiler frontend.
    // In zero mode the combined artifact owns that path, so priming must not
    // write config-only CSS over it.
    void Static.loadCompilerProject({
      root: this.options.root || compiler.context || process.cwd(),
      target: 'web',
      options: { components: ['tamagui'], ...this.options },
      generation: 'next-webpack:warmup',
    })

    this.applyZeroRuntime(compiler)
    this.applyGlobalCSS(compiler)

    if (compiler.options.mode === 'development' && !this.options.disableWatchConfig) {
      void Static.watchTamaguiConfig(this.options).then((watcher) => {
        // yes this is weirdly done promise...
        process.once('exit', () => {
          watcher?.dispose()
        })
      })
    }

    // mark as side effect
    compiler.hooks.normalModuleFactory.tap(this.pluginName, (nmf) => {
      nmf.hooks.createModule.tap(
        this.pluginName,
        (createData: {
          matchResource?: string
          settings?: { sideEffects?: boolean }
        }) => {
          if (createData.matchResource?.endsWith('.tamagui.css') && createData.settings) {
            createData.settings.sideEffects = true
          }
        }
      )
    })

    // default exclude definition
    if (!this.options.disableAliases) {
      const existingAlias = compiler.options.resolve.alias
      if (Array.isArray(existingAlias)) {
        //
      } else if (typeof existingAlias === 'object') {
        Object.assign(existingAlias, this.defaultAliases)
      }
    }

    // explude react native web exports:
    const excludeExports = this.options.excludeReactNativeWebExports
    if (excludeExports) {
      if (Array.isArray(excludeExports)) {
        try {
          const regexStr = `react-native-web(-lite)?/.*(${excludeExports.join('|')}).*js`
          const regex = new RegExp(regexStr)

          compiler.hooks.environment.tap('MyPlugin', () => {
            // Here you create a new instance of the plugin you want to add
            const definePlugin = new webpack.NormalModuleReplacementPlugin(
              regex,
              requireResolve('@tamagui/proxy-worm')
            )
            // Manually apply the plugin to the compiler
            definePlugin.apply(compiler)
          })
        } catch (err) {
          console.warn(
            `Invalid names provided to excludeReactNativeWebExports: ${excludeExports.join(
              ', '
            )}`
          )
        }
      }
    }

    compiler.options.resolve.extensions = [
      ...new Set([
        '.web.tsx',
        '.web.ts',
        '.web.js',
        '.ts',
        '.tsx',
        '.js',
        ...(compiler.options.resolve.extensions || []),
      ]),
    ]

    compiler.options.resolve.fallback ||= {}
    compiler.options.resolve.fallback['crypto'] ||= false

    // look for compiled js with jsx intact as specified by module:jsx
    const mainFields = compiler.options.resolve.mainFields
    if (mainFields) {
      compiler.options.resolve.mainFields = Array.isArray(mainFields)
        ? mainFields
        : [mainFields]
      if (!this.options.disableModuleJSXEntry) mainFields.unshift('module:jsx')
    }

    if (!compiler.options.module) {
      return
    }

    const { jsLoader } = this.options

    const existing = compiler.options.module.rules as any[]

    const rules =
      (existing.find((x) => (typeof x === 'object' && 'oneOf' in x ? x : null))
        ?.oneOf as any[]) ?? existing

    const tamaguiLoader = {
      loader: requireResolve('tamagui-loader'),
      options: {
        ...this.options,
      },
    }

    let didReplaceNextJS = false

    for (const [index, rule] of rules.entries()) {
      const shouldReplaceNextJSRule =
        (rule?.use?.loader === 'next-swc-loader' ||
          (Array.isArray(rule?.use) && rule?.use[0].loader === 'next-swc-loader')) &&
        !rule.issuerLayer

      if (shouldReplaceNextJSRule) {
        didReplaceNextJS = true

        rules[index] = {
          ...rule,
          test: this.options.test ?? rule.test ?? /\.m?[jt]sx?$/,
          exclude: this.options.exclude ?? rule.exclude,
          use: [
            ...(jsLoader ? [jsLoader] : []),
            ...(rule.use ? [].concat(rule.use) : []),
            tamaguiLoader,
          ],
        }
      }
    }

    // for dev mode we need to match the data-at attributes else hydration
    if (!didReplaceNextJS) {
      if (compiler.options.mode === 'development') {
        existing.push({
          test: this.options.test ?? /\.tsx$/,
          exclude: this.options.exclude,
          use: [tamaguiLoader],
        })
      }
    }
  }
}

function relativeImportSpecifier(from: string, to: string) {
  const path = relative(from, to).replace(/\\/g, '/')
  return path.startsWith('.') ? path : `./${path}`
}

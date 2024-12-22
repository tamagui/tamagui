import type { TamaguiOptions } from '@tamagui/static'
import Static from '@tamagui/static'
import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import type { Compiler, RuleSetRule } from 'webpack'
import webpack from 'webpack'
import { requireResolve } from './requireResolve'

const { watchTamaguiConfig } = Static

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

export class TamaguiPlugin {
  pluginName = 'TamaguiPlugin'

  constructor(
    public options: PluginOptions = {
      platform: 'web',
      components: ['@tamagui/core'],
    }
  ) {}

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
        ['@tamagui/core', '@tamagui/core'],
        ['@tamagui/web', '@tamagui/web'],

        // fixes https://github.com/kentcdodds/mdx-bundler/issues/143
        ['react/jsx-runtime.js', 'react/jsx-runtime'],
        ['react/jsx-runtime', 'react/jsx-runtime'],
        ['react/jsx-dev-runtime.js', 'react/jsx-dev-runtime'],
        ['react/jsx-dev-runtime', 'react/jsx-dev-runtime'],

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
    Static.loadTamaguiSync(this.options)

    if (compiler.options.mode === 'development' && !this.options.disableWatchConfig) {
      void watchTamaguiConfig(this.options).then((watcher) => {
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
        // @ts-expect-error CreateData is typed as 'object'...
        (createData: {
          matchResource?: string
          settings: { sideEffects?: boolean }
        }) => {
          if (createData.matchResource?.endsWith('.tamagui.css')) {
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

    if (this.options.emitSingleCSSFile) {
      console.info(`    ➡ [tamagui] 🎨 combining css into one file`)

      compiler.hooks.make.tap(this.pluginName, (compilation) => {
        compilation.hooks.processAssets.tap(this.pluginName, (assets) => {
          try {
            const cssFiles = Object.keys(assets).filter((asset) => asset.endsWith('.css'))
            if (cssFiles.length === 0) {
              return
            }

            const combinedCSS = cssFiles.reduce((acc, file) => {
              const cssContent = compilation.assets[file].source()
              return `${acc}\n${cssContent}`
            }, '')

            for (const [index, cssFile] of cssFiles.entries()) {
              if (index > 0) {
                compilation.updateAsset(
                  cssFile,
                  new compiler.webpack.sources.RawSource(``)
                )
              } else {
                console.info(`    ➡ [tamagui] 🎨 emitting single css to ${cssFile}`)
                // just replace the first one? hacky
                compilation.updateAsset(
                  cssFile,
                  new compiler.webpack.sources.RawSource(Buffer.from(combinedCSS))
                )
              }
            }
          } catch (error: any) {
            compilation.errors.push(error)
          }
        })
      })
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
        _disableLoadTamagui: true,
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

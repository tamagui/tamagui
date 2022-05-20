import path from 'path'

import type { TamaguiOptions } from '@tamagui/static'
import browserslist from 'browserslist'
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin'
import MiniCSSExtractPlugin from 'mini-css-extract-plugin'
import { lazyPostCSS } from 'next/dist/build/webpack/config/blocks/css'
import { getGlobalCssLoader } from 'next/dist/build/webpack/config/blocks/css/loaders'
import { shouldExclude as shouldExcludeDefault } from 'tamagui-loader'
import webpack from 'webpack'

export type WithTamaguiProps = TamaguiOptions & {
  aliasReactPackages?: boolean
  shouldExtract?: (path: string, projectRoot: string) => boolean | undefined
  shouldExcludeFromServer?: (props: {
    context: string
    request: string
    fullPath: string
  }) => boolean | string | undefined
}

export const withTamagui = (tamaguiOptions: WithTamaguiProps) => {
  // allows configuration
  const shouldExclude = (path: string, projectRoot: string) => {
    const res = tamaguiOptions.shouldExtract?.(path, projectRoot)
    if (typeof res === 'boolean') {
      return res
    }
    return shouldExcludeDefault(path, projectRoot)
  }

  return (nextConfig: any = {}) => {
    return {
      ...nextConfig,
      webpack: (webpackConfig: any, options: any) => {
        const { dir, config, dev, isServer } = options

        // @ts-ignore
        if (typeof globalThis['__DEV__'] === 'undefined') {
          // @ts-ignore
          globalThis['__DEV__'] = dev
        }

        const isNext12 = typeof options.config?.swcMinify === 'boolean'
        const prefix = `${isServer ? ' ssr ' : ' web '} |`

        const safeResolves = (
          ...resolves: ([string, string] | [string, string, [string, string]])[]
        ) => {
          let res: string[][] = []
          for (const [out, mod, replace] of resolves) {
            try {
              const next = [out, require.resolve(mod)]
              if (replace) {
                next[1] = next[1].replace(...replace)
              }
              res.push(next)
            } catch (err) {
              // console.log(prefix, `withTamagui skipping resolving ${out}`)
            }
          }
          return Object.fromEntries(res)
        }

        const alias = {
          ...(webpackConfig.resolve.alias || {}),
          ...safeResolves(
            // fixes https://github.com/kentcdodds/mdx-bundler/issues/143
            ['react/jsx-runtime.js', 'react/jsx-runtime'],
            ['react/jsx-runtime', 'react/jsx-runtime'],
            ['react/jsx-dev-runtime.js', 'react/jsx-dev-runtime'],
            ['react/jsx-dev-runtime', 'react/jsx-dev-runtime'],
            ['react-native$', 'react-native-web'],
            ['react-native-reanimated', 'react-native-reanimated'],
            ['expo-linear-gradient', '@tamagui/expo-linear-gradient'],
            ['react-native-web$', 'react-native-web'],
            ['@testing-library/react-native', '@tamagui/proxy-worm'],
            ['@gorhom/bottom-sheet$', '@gorhom/bottom-sheet', ['commonjs', 'module']],
            ...(tamaguiOptions.aliasReactPackages
              ? ([
                  ['react', 'react'],
                  ['react-dom', 'react-dom'],
                ] as any)
              : [])
          ),
          // expo fix https://github.com/expo/expo/issues/9999
          'react-native-web/src': require.resolve('react-native-web/dist'),
          // react: require.resolve('react'),
          // 'react-dom': require.resolve('react-dom'),
        }

        webpackConfig.resolve.alias = alias

        webpackConfig.plugins.push(
          new webpack.DefinePlugin({
            'process.env.IS_STATIC': '""',
            'process.env.TAMAGUI_TARGET': '"web"',
            __DEV__: JSON.stringify(dev),
          })
        )

        const excludeExports = tamaguiOptions.excludeReactNativeWebExports
        if (Array.isArray(excludeExports)) {
          try {
            const regexStr = `\/react-native-web\/.*(${excludeExports.join('|')}).*\/`
            const regex = new RegExp(regexStr)
            console.log(prefix, 'exclude', regexStr)
            webpackConfig.plugins.push(
              new webpack.NormalModuleReplacementPlugin(
                regex,
                require.resolve('@tamagui/proxy-worm')
              )
            )
          } catch (err) {
            console.warn(
              `Invalid names provided to excludeReactNativeWebExports: ${excludeExports.join(', ')}`
            )
          }
        }

        if (process.env.IGNORE_TS_CONFIG_PATHS) {
          if (process.env.DEBUG) {
            console.log(prefix, 'ignoring tsconfig paths')
          }
          if (webpackConfig.resolve.plugins[0]) {
            delete webpackConfig.resolve.plugins[0].paths['@tamagui/*']
            delete webpackConfig.resolve.plugins[0].paths['tamagui']
          }
        }

        // TODO document and make configurable
        // replace minifier with css-minimizer-webpack-plugin which handles deduping atomic styles
        if (!dev) {
          const cssMin = webpackConfig.optimization.minimizer.find((x) =>
            x.toString().includes('css-minimizer-plugin')
          )
          if (cssMin) {
            webpackConfig.optimization.minimizer = webpackConfig.optimization.minimizer.slice(
              cssMin.index,
              1
            )
          }
          webpackConfig.optimization.minimizer.push(new CssMinimizerPlugin())
        }

        if (!webpackConfig.resolve.extensions.includes('.web.js')) {
          webpackConfig.resolve.extensions = ['.web.js', ...webpackConfig.resolve.extensions]
        }

        // look for compiled js with jsx intact as specified by module:jsx
        webpackConfig.resolve.mainFields.unshift('module:jsx')

        if (isServer) {
          const externalize = (context: string, request: string) => {
            const fullPath = request[0] === '.' ? path.join(context, request) : request

            if (tamaguiOptions.shouldExcludeFromServer) {
              const userRes = tamaguiOptions.shouldExcludeFromServer({
                context,
                request,
                fullPath,
              })
              if (userRes !== undefined) {
                return userRes
              }
            }

            if (
              fullPath.startsWith('react-native-web') ||
              fullPath.includes('node_modules/react-native-web') ||
              /^(react-dom|react)\/$/.test(fullPath)
            ) {
              return `commonjs ${fullPath}`
            }
            if (
              fullPath.includes('/moti/') ||
              fullPath.includes('/solito/') ||
              fullPath === 'tamagui' ||
              fullPath.startsWith('@tamagui/') ||
              fullPath === 'react-native-safe-area-context' ||
              fullPath.startsWith('@react-navigation') ||
              fullPath === '@gorhom/bottom-sheet'
            ) {
              return
            }
            if (/^\@?react-native-/.test(request)) {
              return false
            }
            return true
          }

          // externalize react native things from bundle
          webpackConfig.externals = [
            ...webpackConfig.externals.map((external) => {
              if (typeof external !== 'function') {
                return external
              }
              // only runs on server
              return (ctx, cb) => {
                const isCb = typeof cb === 'function'
                const res = externalize(ctx.context, ctx.request)
                if (isCb) {
                  if (typeof res === 'string') {
                    return cb(null, res)
                  }
                  if (res) {
                    return external(ctx, cb)
                  }
                  return cb()
                }
                return !res
                  ? Promise.resolve(undefined)
                  : typeof res === 'string'
                  ? Promise.resolve(res)
                  : external(ctx)
              }
            }),
          ]
        }

        const oneOfRule = webpackConfig.module.rules.find((x) => !!x.oneOf)

        const cssLoader = getGlobalCssLoader(
          // @ts-ignore
          {
            assetPrefix: options.config.assetPrefix || config.assetPrefix,
            future: nextConfig.future,
            experimental: nextConfig.experimental || {},
            isClient: !isServer,
            isServer,
            isDevelopment: dev,
          },
          // @ts-ignore
          () => lazyPostCSS(dir, getSupportedBrowsers(dir, dev)),
          []
        )

        if (oneOfRule) {
          if (!dev) {
            const postCSSLoader = cssLoader[cssLoader.length - 1]
            // replace nextjs picky style rules with simple minicssextract
            oneOfRule.oneOf.unshift({
              test: /\.css$/i,
              use: [MiniCSSExtractPlugin.loader, 'css-loader', postCSSLoader],
              sideEffects: true,
            })
            webpackConfig.plugins.push(
              new MiniCSSExtractPlugin({
                filename: 'static/css/[name].[contenthash].css',
                ignoreOrder: true,
                runtime: false,
              })
            )
          } else {
            oneOfRule.oneOf.unshift({
              test: /\.css$/i,
              sideEffects: true,
              use: cssLoader,
            })
          }
        }

        if (isNext12) {
          const firstOneOfRule = webpackConfig.module.rules.findIndex((x) => x && !!x.oneOf)
          const oneOfJSRules: any[] = webpackConfig.module.rules[firstOneOfRule].oneOf
          const afterSWCLoaderIndex =
            oneOfJSRules.findIndex(
              (x) => x && x.use && x.use.loader === 'next-swc-loader' && x.issuerLayer !== 'api'
            ) + 1
          const swcLoader = oneOfJSRules[afterSWCLoaderIndex]

          // put an earlier loader where we just do tamagui stuff before regular swc
          oneOfJSRules.splice(
            afterSWCLoaderIndex,
            0,
            {
              test: /(bottom-sheet).*\.[tj]sx?$/,
              use: [
                {
                  loader: 'babel-loader',
                  options: {
                    presets: ['@babel/preset-react'],
                    plugins: ['react-native-reanimated/plugin'],
                  },
                },
              ],
            },
            {
              test: /\.(jsx?|tsx?)$/,
              exclude: (path: string) => shouldExclude(path, options.dir),
              use: [
                ...[].concat(swcLoader.use),
                {
                  loader: 'tamagui-loader',
                  options: tamaguiOptions,
                },
              ],
            }
          )
        } else {
          // next 11 modify loader
          const [first, second, ...rest] = webpackConfig.module.rules
          webpackConfig.module.rules = [
            first,
            second,
            {
              test: /\.(tsx|jsx)$/,
              exclude: (path: string) => shouldExclude(path, options.dir),
              use: [
                'thread-loader',
                {
                  loader: 'esbuild-loader',
                  options: {
                    loader: 'tsx',
                    minify: false,
                  },
                },
                {
                  loader: 'tamagui-loader',
                  options: {
                    prefixLogs: prefix,
                    ...tamaguiOptions,
                  },
                },
              ],
            },
            ...rest,
          ]
        }

        if (typeof nextConfig.webpack === 'function') {
          return nextConfig.webpack(webpackConfig, options)
        }

        return webpackConfig
      },
    }
  }
}

function getSupportedBrowsers(dir, isDevelopment) {
  let browsers
  try {
    browsers = browserslist.loadConfig({
      path: dir,
      env: isDevelopment ? 'development' : 'production',
    })
  } catch {}

  return browsers
}

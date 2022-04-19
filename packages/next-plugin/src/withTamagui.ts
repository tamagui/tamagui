import path from 'path'

import { TamaguiOptions } from '@tamagui/static'
import browserslist from 'browserslist'
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin'
import { lazyPostCSS } from 'next/dist/build/webpack/config/blocks/css'
import { getGlobalCssLoader } from 'next/dist/build/webpack/config/blocks/css/loaders'
import { shouldExclude } from 'tamagui-loader'
import webpack from 'webpack'

export type WithTamaguiProps = TamaguiOptions & {
  shouldIncludeModuleServer?: (props: {
    context: string
    request: string
    fullPath: string
  }) => boolean | string | undefined
}

export const withTamagui = (tamaguiOptions: WithTamaguiProps) => {
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
        const isWebpack5 = true

        // fixes https://github.com/kentcdodds/mdx-bundler/issues/143
        const jsxRuntime = require.resolve('react/jsx-runtime')
        const jsxDevRuntime = require.resolve('react/jsx-dev-runtime')
        const rnw = require.resolve('react-native-web')
        const reanimated = require.resolve('react-native-reanimated')
        const proxyWorm = require.resolve('@dish/proxy-worm')
        const prefix = `${isServer ? ' ssr ' : ' web '} |`

        webpackConfig.resolve.alias = {
          ...(webpackConfig.resolve.alias || {}),
          'react/jsx-runtime.js': jsxRuntime,
          'react/jsx-runtime': jsxRuntime,
          'react/jsx-dev-runtime.js': jsxDevRuntime,
          'react/jsx-dev-runtime': jsxDevRuntime,
          // 'react-dom/client': require.resolve('react-dom/client'),
          'react-native$': rnw,
          'react-native-reanimated': reanimated,
          'react-native-web$': rnw,
          '@testing-library/react-native': proxyWorm,
          '@gorhom/bottom-sheet$': require
            .resolve('@gorhom/bottom-sheet')
            .replace('commonjs', 'module'),
          // expo fix https://github.com/expo/expo/issues/9999
          'react-native-web/src': require.resolve('react-native-web/dist'),
          react: require.resolve('react'),
          'react-dom': require.resolve('react-dom'),
        }

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
        if (!isServer && !dev) {
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
          const includeModule = (context: string, request: string) => {
            const fullPath = request[0] === '.' ? path.join(context, request) : request

            const userRes = tamaguiOptions.shouldIncludeModuleServer?.({
              context,
              request,
              fullPath,
            })

            if (userRes !== undefined) {
              return userRes
            }

            if (
              fullPath.startsWith('react-native-web') ||
              fullPath.includes('node_modules/react-native-web') ||
              /^(react-dom|react)$/.test(fullPath)
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
              return 'inline'
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
              console.log('isWebpack5', isWebpack5)
              return (ctx, cb) => {
                const res = includeModule(ctx.context, ctx.request)
                if (res === 'inline') {
                  return cb()
                }
                if (typeof res === 'string') {
                  return cb(null, res)
                }
                if (res) {
                  return external(ctx, cb)
                }
                return cb()
              }
            }),
          ]
        }

        const oneOfRule = webpackConfig.module.rules.find((x) => !!x.oneOf)

        if (oneOfRule) {
          if (!dev && !isServer) {
            // replace nextjs picky style rules with simple minicssextract
            const MiniCssExtractPlugin = require('mini-css-extract-plugin')
            oneOfRule.oneOf.unshift({
              test: /\.css$/i,
              use: [MiniCssExtractPlugin.loader, 'css-loader'],
              sideEffects: true,
            })
            const idx = webpackConfig.plugins.findIndex(
              (x) => x.constructor.name === 'NextMiniCssExtractPlugin'
            )
            webpackConfig.plugins.splice(
              idx,
              1,
              new MiniCssExtractPlugin({
                filename: 'static/css/[name].[contenthash].css',
                ignoreOrder: true,
              })
            )
          } else {
            oneOfRule.oneOf.unshift({
              test: /\.css$/i,
              sideEffects: true,
              use: getGlobalCssLoader(
                // @ts-ignore
                {
                  assetPrefix: options.config.assetPrefix || config.assetPrefix,
                  future: nextConfig.future,
                  experimental: nextConfig.experimental || {},
                  isClient: !isServer,
                  isServer,
                  isDevelopment: true,
                },
                // @ts-ignore
                () => lazyPostCSS(dir, getSupportedBrowsers(dir, dev)),
                []
              ),
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
                    plugins: [
                      'react-native-reanimated/plugin',
                      '@babel/plugin-transform-react-jsx',
                    ],
                  },
                },
              ],
            },
            {
              test: /\.(jsx?|tsx?)$/,
              exclude: (path: string) => shouldExclude(path, options.dir, tamaguiOptions),
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
              exclude: (path: string) => shouldExclude(path, options.dir, tamaguiOptions),
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

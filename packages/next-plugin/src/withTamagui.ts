import path from 'path'

import { TamaguiOptions } from '@tamagui/static'
import browserslist from 'browserslist'
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin'
import { lazyPostCSS } from 'next/dist/build/webpack/config/blocks/css'
import { getGlobalCssLoader } from 'next/dist/build/webpack/config/blocks/css/loaders'
import webpack from 'webpack'

export const withTamagui = (tamaguiOptions: TamaguiOptions) => {
  return (nextConfig: any = {}) => {
    return Object.assign({}, nextConfig, {
      webpack: (webpackConfig: any, options) => {
        const { dir, config, dev, isServer } = options

        // @ts-ignore
        if (typeof globalThis['__DEV__'] === 'undefined') {
          // @ts-ignore
          globalThis['__DEV__'] = dev
        }

        const isNext12 = typeof options.config?.swcMinify === 'boolean'

        // fixes https://github.com/kentcdodds/mdx-bundler/issues/143
        const jsxRuntime = require.resolve('react/jsx-runtime')
        const jsxDevRuntime = require.resolve('react/jsx-dev-runtime')
        const rnw = require.resolve('react-native-web')
        const reanimated = require.resolve('react-native-reanimated')
        const proxyWorm = require.resolve('@dish/proxy-worm')
        const prefix = `${isServer ? '[ssr]' : '[web]'} »`

        webpackConfig.resolve.alias = {
          ...(webpackConfig.resolve.alias || {}),
          'react/jsx-runtime.js': jsxRuntime,
          'react/jsx-runtime': jsxRuntime,
          'react/jsx-dev-runtime.js': jsxDevRuntime,
          'react/jsx-dev-runtime': jsxDevRuntime,
          'react-dom/client': require.resolve('react-dom/client'),
          'react-native$': rnw,
          'react-native-reanimated': reanimated,
          '@testing-library/react-native': proxyWorm,
          '@gorhom/bottom-sheet$': require
            .resolve('@gorhom/bottom-sheet')
            .replace('commonjs', 'module'),
          'react-native-web/src/modules/normalizeColor': require.resolve(
            'react-native-web/dist/cjs/modules/normalizeColor'
          ),
          react: require.resolve('react'),
          'react-dom': require.resolve('react-dom'),
        }

        webpackConfig.plugins.push(
          new webpack.DefinePlugin({
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
          console.log(prefix, 'ignoring tsconfig paths')
          delete webpackConfig.resolve.plugins[0].paths['@tamagui/*']
          delete webpackConfig.resolve.plugins[0].paths['tamagui']
        }

        // TODO document and make configurable
        // replace minifier with css-minimizer-webpack-plugin which handles deduping atomic styles
        if (!isServer) {
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

        const isWebpack5 = !!config.future?.webpack5 || typeof config.webpack5 === 'undefined'

        const includeModule = (context: string, request: string) => {
          const fullPath = request[0] === '.' ? path.join(context, request) : request
          if (/^\@?react-native-/.test(request)) {
            return false
          }
          if (fullPath === '@gorhom/bottom-sheet') {
            return 'inline'
          }
          if (
            fullPath.startsWith('react-native-web') ||
            fullPath.includes('node_modules/react-native-web')
          ) {
            return `commonjs ${fullPath}`
          }
          if (/^(react-dom|react)$/.test(fullPath)) {
            return `commonjs ${fullPath}`
          }
          return true
        }

        if (isServer) {
          // externalize react native things from bundle
          webpackConfig.externals = [
            ...webpackConfig.externals.map((external) => {
              if (typeof external !== 'function') {
                return external
              }
              // only runs on server
              if (isWebpack5) {
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
              }
              return (ctx, req, cb) => {
                const res = includeModule(ctx, req)
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

        // add loader
        const shouldExclude = (x: string) => {
          if (x.includes('react-native-reanimated')) {
            return false
          }
          // analyze everything in our jsx dir
          // analyze everything in the components dirs
          const shouldInclude =
            x.includes(options.dir) ||
            tamaguiOptions.components.some(
              (c) =>
                x.includes(`/node_modules/${c}`) ||
                x.includes(`${c}/dist/jsx/`) ||
                // more generic catch-all for independent tamagui packages like drawer
                (x.includes('tamagui') && x.includes('/dist/jsx/'))
            )
          if (!shouldInclude) {
            return true
          }
          return false
        }

        if (isNext12) {
          const firstOneOfRule = webpackConfig.module.rules.findIndex((x) => x && !!x.oneOf)
          const oneOfJSRules: any[] = webpackConfig.module.rules[firstOneOfRule].oneOf
          const swcLoaderIndex = oneOfJSRules.findIndex(
            (x) => x && x.use && x.use.loader === 'next-swc-loader'
          )
          const swcLoader = oneOfJSRules[swcLoaderIndex]
          // put an earlier loader where we just do tamagui stuff before regular swc
          oneOfJSRules.splice(
            swcLoaderIndex,
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
              exclude: shouldExclude,
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
              exclude: shouldExclude,
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
    })
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

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

        const isNext12 = typeof options.config?.swcMinify === 'boolean'

        // fixes https://github.com/kentcdodds/mdx-bundler/issues/143
        const jsxRuntime = require.resolve('react/jsx-runtime.js')
        const jsxDevRuntime = require.resolve('react/jsx-dev-runtime.js')

        webpackConfig.resolve.alias = {
          ...(webpackConfig.resolve.alias || {}),
          'react/jsx-runtime.js': jsxRuntime,
          'react/jsx-runtime': jsxRuntime,
          'react/jsx-dev-runtime.js': jsxDevRuntime,
          'react/jsx-dev-runtime': jsxDevRuntime,
          'react-native$': 'react-native-web',
          'react-native-web/src/modules/normalizeColor': require.resolve(
            'react-native-web/dist/cjs/modules/normalizeColor'
          ),
          react: require.resolve('react'),
          'react-dom': require.resolve('react-dom'),
        }

        webpackConfig.plugins.push(
          new webpack.DefinePlugin({
            'process.env.TAMAGUI_TARGET': '"web"',
          })
        )

        if (process.env.IGNORE_TS_CONFIG_PATHS) {
          console.log('ignoring tsconfig paths, they mess up transpile')
          delete webpackConfig.resolve.plugins[0].paths['@tamagui/*']
          delete webpackConfig.resolve.plugins[0].paths['tamagui']
        }

        // TODO document and make configurable
        // replace minifier with css-minimizer-webpack-plugin which handles deduping atomic styles
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
          if (!dev) {
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
        const shouldExclude = (x) => {
          // analyze everything in our jsx dir
          // analyze everything in the components dirs
          const shouldInclude =
            x.includes(options.dir) ||
            tamaguiOptions.components.some(
              (c) => x.includes(`/node_modules/${c}`) || x.includes(`${c}/dist/jsx/`)
            )
          if (!shouldInclude) {
            return true
          }
          return false
        }

        if (isNext12) {
          const oneOfJSRules = webpackConfig.module.rules[2].oneOf
          const swcLoaderIndex = 3
          const swcLoader = oneOfJSRules[swcLoaderIndex]
          // put an earlier loader where we just do tamagui stuff before regular swc
          oneOfJSRules.splice(swcLoaderIndex, 0, {
            test: /\.(jsx?|tsx?)$/,
            exclude: shouldExclude,
            use: [
              ...[].concat(swcLoader.use),
              {
                loader: 'tamagui-loader',
                options: tamaguiOptions,
              },
            ],
          })
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
                  options: tamaguiOptions,
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

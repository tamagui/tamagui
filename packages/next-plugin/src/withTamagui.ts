import path from 'path'

import { TamaguiOptions } from '@tamagui/static'
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin'
import webpack from 'webpack'

export const withTamagui = (tamaguiOptions: TamaguiOptions) => {
  return (nextConfig: any = {}) => {
    return Object.assign({}, nextConfig, {
      webpack: (webpackConfig, options) => {
        const { config, dev, isServer } = options

        webpackConfig.resolve.alias = {
          ...(webpackConfig.resolve.alias || {}),
          'react-native$': 'react-native-web',
          'react-native-web/src/modules/normalizeColor': require.resolve(
            'react-native-web/dist/cjs/modules/normalizeColor'
          ),
          // fix mdx-bundler issue importing .js specifically
          // 'react/jsx-runtime.js': require.resolve('react/jsx-runtime'),
          'react/jsx-runtime': require.resolve('react/jsx-runtime'),
          'react/jsx-dev-runtime': require.resolve('react/jsx-dev-runtime'),
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

        // why is it undefined on next11??? but it says using webpack5
        const isWebpack5 = !!config.future.webpack5 || typeof config.webpack5 === 'undefined'

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

        for (const rule of webpackConfig.module.rules) {
          console.log('rule', rule)
        }

        if (oneOfRule) {
          if (!dev) {
            // replace nextjs picky style rules with simple minicssextract
            const MiniCssExtractPlugin = require('mini-css-extract-plugin')
            oneOfRule.oneOf = [
              {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
                sideEffects: true,
              },
            ]
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
            // const {
            //   getGlobalCssLoader,
            // } = require('next/dist/build/webpack/config/blocks/css/loaders')
            // oneOfRule.oneOf.unshift({
            //   test: /\.css$/i,
            //   sideEffects: true,
            //   use: getGlobalCssLoader(
            //     {
            //       assetPrefix: options.config.assetPrefix,
            //       future: { webpack5: true },
            //       isClient: !isServer,
            //       isServer,
            //       isDevelopment: true,
            //     },
            //     [],
            //     []
            //   ),
            // })
          }
        }

        // add loader
        const shouldExclude = (x) => {
          // analyze everything in our src dir
          // analyze everything in the components dirs
          if (
            x.includes(options.dir) ||
            tamaguiOptions.components.some(
              (c) => x.includes(`/node_modules/${c}`) || x.includes(`${c}/_jsx/`)
            )
          ) {
            return false
          }
          // exclude everything else
          return true
        }
        const [first, second, ...rest] = webpackConfig.module.rules
        webpackConfig.module.rules = [
          first,
          second,
          {
            test: /\.(tsx|js|mjs|jsx)$/,
            exclude: shouldExclude,
            use: [
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

        if (typeof nextConfig.webpack === 'function') {
          return nextConfig.webpack(webpackConfig, options)
        }

        return webpackConfig
      },
    })
  }
}

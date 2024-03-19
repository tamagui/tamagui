const path = require('path')
const webpack = require('webpack')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { TamaguiPlugin } = require('tamagui-loader')
const MiniCSSExtractPlugin = require('mini-css-extract-plugin')

const NODE_ENV = process.env.NODE_ENV || 'development'
const isProduction = NODE_ENV === 'production'

const boolVals = {
  true: true,
  false: false,
}
const disableExtraction =
  boolVals[process.env.DISABLE_EXTRACTION] ?? process.env.NODE_ENV === 'development'

/** @type { import('webpack').Configuration } */
module.exports = {
  context: __dirname,
  stats: 'normal', // 'detailed'
  mode: NODE_ENV,
  entry: ['./src/index.tsx'],
  devtool: 'source-map',
  resolve: {
    mainFields: ['module:jsx', 'browser', 'module', 'main'],
    alias: {
      'react-native-svg': '@tamagui/react-native-svg',
    },
  },
  devServer: {
    client: {
      overlay: false,
      logging: 'warn',
    },
    hot: true,
    static: {
      directory: path.join(__dirname, 'public'),
    },
    compress: true,
    port: 9000,
  },
  module: {
    rules: [
      {
        oneOf: [
          {
            test: /\.(ts|js)x?$/,
            use: [
              {
                loader: 'esbuild-loader',
                options: {
                  target: 'es2020',
                  loader: 'tsx',
                  minify: false,
                },
              },
            ],
          },

          {
            test: /\.css$/,
            use: [MiniCSSExtractPlugin.loader, 'css-loader'],
          },

          {
            test: /\.(png|jpg|gif|woff|woff2)$/i,
            use: [
              {
                loader: 'url-loader',
                options: {
                  limit: 8192,
                },
              },
            ],
            type: 'javascript/auto',
          },
        ],
      },
    ],
  },
  plugins: [
    new TamaguiPlugin({
      config: './src/tamagui.config.ts',
      components: ['tamagui'],
      importsWhitelist: ['constants.js'],
      disableExtraction,
      emitSingleCSSFile: true,
    }),

    // new BundleAnalyzerPlugin(),

    new MiniCSSExtractPlugin({
      filename: 'static/css/[name].[contenthash].css',
      ignoreOrder: true,
    }),

    isProduction ? null : new ReactRefreshWebpackPlugin(),

    new webpack.DefinePlugin({
      process: {
        env: {
          __DEV__: NODE_ENV === 'development' ? 'true' : 'false',
          NODE_ENV: JSON.stringify(NODE_ENV),
          DEBUG: JSON.stringify(process.env.DEBUG || '0'),
        },
      },
    }),

    new HtmlWebpackPlugin({
      template: `./index.html`,
    }),
  ].filter(Boolean),
}

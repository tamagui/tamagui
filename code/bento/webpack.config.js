const path = require('path')
const webpack = require('webpack')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { shouldExclude, TamaguiPlugin } = require('tamagui-loader')
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const MiniCSSExtractPlugin = require('mini-css-extract-plugin')

const NODE_ENV = process.env.NODE_ENV || 'development'
const target = 'web'
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
  entry: ['./src/main.web.tsx'],
  devtool: 'cheap-module-source-map',
  optimization: {
    concatenateModules: false,
    minimize: false,
  },
  resolve: {
    mainFields: ['module:jsx', 'browser', 'module', 'main'],
    extensions: ['.ts', '.tsx', '.js'],
    alias: {
      'react-native$': 'react-native-web',
      'react-native-svg': '@tamagui/react-native-svg',
      '@expo/vector-icons': '@tamagui/proxy-worm',
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
            test: /\.(gif|jpe?g|png|svg|ttf|otf|woff2?|bmp|webp|png|jpg|gif|woff|woff2)$/i,
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
      components: ['tamagui', '@tamagui/sandbox-ui'],
      importsWhitelist: ['constants.js'],
      // enableDynamicEvaluation: true,
      disableExtraction,
      themeBuilder: {
        input: '../core/themes/src/themes-new.ts',
        output: path.join(
          require.resolve('@tamagui/themes/src/themes-new.ts'),
          '..',
          'generated-new.ts'
        ),
      },
      // disable: true,
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
          NODE_ENV: JSON.stringify(NODE_ENV),
          __DEV__: NODE_ENV === 'development' ? 'true' : 'false',
          DEBUG: JSON.stringify(process.env.DEBUG || '0'),
        },
      },
    }),
    new HtmlWebpackPlugin({
      template: `./index.html`,
    }),
  ].filter(Boolean),
}

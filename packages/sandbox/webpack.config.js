const path = require('path')
const webpack = require('webpack')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { shouldExclude } = require('tamagui-loader')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const NODE_ENV = process.env.NODE_ENV || 'development'

const target = process.env.TARGET || 'css'

const boolVals = {
  true: true,
  false: false,
}
const disableExtraction =
  boolVals[process.env.DISABLE_EXTRACTION] ?? process.env.NODE_ENV === 'development'
const tamaguiOptions = {
  config: './tamagui.config.ts',
  components: ['tamagui'],
  importsWhitelist: ['constants.js'],
  disableExtraction,
}

console.log('disableExtraction', disableExtraction)

module.exports = /** @type { import('webpack').Configuration } */ {
  context: __dirname,
  mode: 'development',
  entry: ['./index.tsx'],
  devtool: 'source-map',
  resolve: {
    extensions: [`${target}.ts`, `${target}.tsx`, '.web.js', '.ts', '.tsx', '.js'],
    mainFields: ['module:jsx', 'browser', 'module', 'main'],
    alias: {
      'react-native$': 'react-native-web',
      'react-native/Libraries/Renderer/shims/ReactFabric': '@tamagui/proxy-worm',
      'react-native-reanimated': require.resolve('react-native-reanimated'),
      'react-native-reanimated$': require.resolve('react-native-reanimated'),
    },
  },
  devServer: {
    client: {
      overlay: false,
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
            test: /(react-native-reanimated|gorhom\/portal).*\.[tj]sx?$/,
            use: [
              {
                loader: 'babel-loader',
                options: {
                  presets: ['@babel/preset-react'],
                },
              },
            ],
          },
          {
            test: /(bottom-sheet).*\.[tj]sx?$/,
            use: [
              {
                loader: 'babel-loader',
                options: {
                  presets: ['@babel/preset-react'],
                  plugins: [
                    'react-native-reanimated/plugin',
                    '@babel/plugin-proposal-class-properties',
                  ],
                },
              },
            ],
          },
          {
            test: /\.(ts|js)x?$/,
            exclude: (path) => shouldExclude(path, __dirname, tamaguiOptions),
            use: [
              'thread-loader',
              {
                loader: 'esbuild-loader',
                options: {
                  jsxFactory: 'createElement',
                  target: 'es2020',
                  loader: 'tsx',
                  minify: false,
                  banner:
                    "import { createElement } from '@welldone-software/why-did-you-render';\n",
                },
              },
              {
                loader: 'tamagui-loader',
                options: tamaguiOptions,
              },
            ],
          },
          {
            test: /\.css$/,
            use: ['style-loader', 'css-loader'],
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
    // new BundleAnalyzerPlugin(),
    new ReactRefreshWebpackPlugin(),
    new webpack.DefinePlugin({
      process: {
        env: {
          __DEV__: NODE_ENV === 'development' ? 'true' : 'false',
          IS_STATIC: '""',
          NODE_ENV: JSON.stringify(NODE_ENV),
          TAMAGUI_TARGET: JSON.stringify('web'),
          DEBUG: JSON.stringify(process.env.DEBUG || 0),
        },
      },
    }),
    new HtmlWebpackPlugin({
      template: `./public/index.html`,
    }),
  ],
}

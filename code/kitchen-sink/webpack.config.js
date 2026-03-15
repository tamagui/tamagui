const path = require('path')
const webpack = require('webpack')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { shouldExclude, TamaguiPlugin } = require('tamagui-loader')

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
  entry: ['./src/index.tsx'],
  devtool: 'cheap-module-source-map',
  optimization: {
    concatenateModules: false,
    minimize: false,
  },
  resolve: {
    mainFields: ['module:jsx', 'browser', 'module', 'main'],
    extensions: ['.web.tsx', '.web.ts', '.ts', '.tsx', '.js'],
    alias: {
      'react/jsx-runtime': require.resolve('react/jsx-runtime'),
      'react/jsx-dev-runtime': require.resolve('react/jsx-dev-runtime'),
      'react/compiler-runtime': require.resolve('react/compiler-runtime'),
      react: require.resolve('react'),
      'react-dom/client': require.resolve('react-dom/client'),
      'react-dom': require.resolve('react-dom'),
      'react-native$': 'react-native-web',
      'react-native-svg': '@tamagui/react-native-svg',
    },
  },
  devServer: {
    client: {
      overlay: false,
      logging: 'error',
    },
    hot: true,
    static: {
      directory: path.join(__dirname, 'public'),
    },
    compress: true,
    port: process.env.PORT || 7979,
  },
  ignoreWarnings: [
    // suppress react-native-worklets critical dependency warning
    /Critical dependency: require function is used in a way/,
    // suppress expo-modules-core tsconfig warnings
    /expo-modules-core.*expo-module-scripts\/tsconfig\.base/,
    // suppress all esbuild-loader tsconfig warnings
    /esbuild-loader.*Error parsing tsconfig\.json/,
  ],
  module: {
    rules: [
      // Process react-native-reanimated and @tamagui/animations-reanimated with Babel plugin
      // The reanimated babel plugin transforms 'worklet' directives for web
      {
        test: /\.(js|ts)x?$/,
        include: [
          /node_modules\/(react-native-reanimated|react-native-worklets)/,
          /code\/core\/animations-reanimated/,
        ],
        use: {
          loader: 'babel-loader',
          options: {
            configFile: true,
          },
        },
      },
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
            use: ['style-loader', 'css-loader'],
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
      disableExtraction,
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

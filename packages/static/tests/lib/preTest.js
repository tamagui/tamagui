const path = require('path')
const webpack = require('webpack')
const { externalizeModules } = require('./externalizeModules')
const { outDir, specDir } = require('./test-constants')

const outFileBabel = 'out-babel.js'
const outFileWebpack = 'out-webpack.js'

module.exports = async function main() {
  await Promise.all([
    //
    // extractStaticAppBabel(),
    extractStaticWebpackApp(),
  ])
  process.env.IS_STATIC = undefined
}

async function extractStaticAppBabel() {
  const compiler = webpack({
    context: specDir,
    mode: 'development',
    devtool: false,
    optimization: {
      minimize: false,
      concatenateModules: false,
      splitChunks: false,
    },
    entry: path.join(specDir, 'extract-specs.tsx'),
    output: {
      libraryTarget: 'commonjs',
      filename: outFileBabel,
      path: outDir,
    },
    externals: [externalizeModules],
    resolve: {
      extensions: ['.ts', '.tsx', '.js'],
      mainFields: ['tsmain', 'browser', 'module', 'main'],
      alias: {
        'react-native': 'react-native-web',
      },
    },
    module: {
      rules: [
        {
          test: /\.[jt]sx?$/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                // add our plugin
                plugins: [require.resolve('@tamagui/babel-plugin')],
                presets: [require.resolve('@dish/babel-preset')],
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        'process.env.DEBUG': JSON.stringify(process.env.DEBUG ?? ''),
        'process.env.TARGET': JSON.stringify('web'),
        'process.env.SNACKUI_COMPILE_PROCESS': JSON.stringify(1),
      }),
    ],
  })

  await new Promise((res) => {
    compiler.run((err, result) => {
      // console.log({ err })
      // console.log(result?.toString())
      res()
    })
  })
}

async function extractStaticWebpackApp() {
  const compiler = webpack({
    context: specDir,
    mode: 'development',
    devtool: false,
    optimization: {
      minimize: false,
      concatenateModules: false,
      splitChunks: false,
    },
    entry: path.join(specDir, 'extract-specs.tsx'),
    output: {
      publicPath: '',
      libraryTarget: 'commonjs',
      filename: outFileWebpack,
      path: outDir,
    },
    externals: [externalizeModules],
    resolve: {
      extensions: ['.ts', '.tsx', '.js'],
      mainFields: ['tsmain', 'browser', 'module', 'main'],
      alias: {
        'react-native': 'react-native-web',
      },
    },
    module: {
      rules: [
        {
          test: /\.[jt]sx?$/,
          exclude: /node_modules\/(?!react-native-web)/g,
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: ['@dish/babel-preset'],
              },
            },
            {
              loader: require.resolve('tamagui-loader'),
              options: {
                importsWhitelist: ['constants.js'],
              },
            },
          ],
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        'process.env.TARGET': JSON.stringify('web'),
        'process.env.DEBUG': JSON.stringify(process.env.DEBUG),
        'process.env.SNACKUI_COMPILE_PROCESS': JSON.stringify(1),
      }),
    ],
  })

  await new Promise((res) => {
    compiler.run((err, result) => {
      // console.log({ err })
      // console.log(result?.toString())
      res()
    })
  })
}

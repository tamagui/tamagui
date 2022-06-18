const path = require('path')
const webpack = require('webpack')
const { externalizeModules } = require('./externalizeModules')
const { outDir, specDir } = require('./test-constants')

const outFileBabel = 'out-babel.js'
const outFileWebpack = 'out-webpack.js'

module.exports = async function main() {
  await Promise.all([
    //
    extractStaticAppBabel(),
    extractStaticWebpackApp(),
  ])
  process.env.IS_STATIC = undefined
}

const alias = {
  'react-native$': 'react-native-web',
  'react-native-reanimated$': '@tamagui/proxy-worm',
  'react-native-gesture-handler$': '@tamagui/proxy-worm',
  'react-native-safe-area-context$': '@tamagui/fake-react-native',
  '@gorhom/bottom-sheet$': '@tamagui/proxy-worm',
}

const defines = {
  'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
  __DEV__: JSON.stringify(false),
  'process.env.DEBUG': JSON.stringify(process.env.DEBUG ?? ''),
  'process.env.TAMAGUI_TARGET': JSON.stringify('web'),
  'process.env.TAMAGUI_COMPILE_PROCESS': JSON.stringify(1),
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
      mainFields: ['module:jsx', 'browser', 'module', 'main'],
      alias,
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: 'null-loader',
        },
        {
          test: /\.[jt]sx?$/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                // add our plugin
                plugins: [
                  [
                    '@tamagui/babel-plugin',
                    {
                      config: './tests/lib/tamagui.config.js',
                      components: ['tamagui'],
                    },
                  ],
                ],
                presets: [require.resolve('@dish/babel-preset')],
              },
            },
          ],
        },
      ],
    },
    plugins: [new webpack.DefinePlugin(defines)],
  })

  await new Promise((res) => {
    compiler.run((err, result) => {
      console.log({ err })
      console.log(result?.toString())
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
      mainFields: ['module:jsx', 'browser', 'module', 'main'],
      alias,
    },
    module: {
      rules: [
        {
          test: /\.[jt]sx?$/,
          exclude: /node_modules\/(?!react-native-web)/g,
          use: [
            {
              loader: require.resolve('esbuild-loader'),
              options: {
                loader: 'tsx',
                target: 'es2020',
                keepNames: true,
              },
            },
            {
              loader: require.resolve('tamagui-loader'),
              options: {
                config: './tests/lib/tamagui.config.js',
                components: ['tamagui'],
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
    plugins: [new webpack.DefinePlugin(defines)],
  })

  await new Promise((res) => {
    compiler.run((err, result) => {
      console.log({ err })
      console.log(result?.toString())
      res()
    })
  })
}

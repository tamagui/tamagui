// const path = require('path')
// const webpack = require('webpack')
// const { externalizeModules } = require('./externalizeModules')
// const { outDir, specDir } = require('./test-constants')

// const outFileWebpack = 'out-webpack.js'

// const alias = {
//   'react-native$': 'react-native-web',
//   'react-native-reanimated$': '@tamagui/proxy-worm',
//   'react-native-gesture-handler$': '@tamagui/proxy-worm',
//   'react-native-safe-area-context$': '@tamagui/fake-react-native',
// }

process.env.NODE_ENV = 'test'

// const defines = {
//   'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
//   __DEV__: JSON.stringify(false),
//   'process.env.DEBUG': JSON.stringify(process.env.DEBUG ?? ''),
//   'process.env.TAMAGUI_TARGET': JSON.stringify('web'),
//   'process.env.TAMAGUI_COMPILE_PROCESS': JSON.stringify(1),
// }

// async function extractStaticWebpackApp() {
//   const compiler = webpack({
//     context: specDir,
//     mode: 'development',
//     devtool: false,
//     optimization: {
//       minimize: false,
//       minimizer: [],
//       concatenateModules: false,
//       splitChunks: false,
//     },
//     entry: path.join(specDir, 'extract-specs.tsx'),
//     output: {
//       publicPath: '',
//       libraryTarget: 'commonjs',
//       filename: outFileWebpack,
//       path: outDir,
//     },
//     externals: [externalizeModules],
//     resolve: {
//       extensions: ['.ts', '.tsx', '.js'],
//       mainFields: ['module:jsx', 'browser', 'module', 'main'],
//       alias,
//     },
//     module: {
//       rules: [
//         {
//           test: /\.[jt]sx?$/,
//           use: [
//             {
//               loader: require.resolve('esbuild-loader'),
//               options: {
//                 loader: 'tsx',
//                 target: 'es2021',
//                 keepNames: true,
//               },
//             },
//             {
//               loader: require.resolve('tamagui-loader'),
//               options: {
//                 config: './tests/lib/tamagui.config.js',
//                 components: ['tamagui'],
//                 importsWhitelist: ['constants.js'],
//               },
//             },
//           ],
//         },
//         {
//           test: /\.css$/,
//           use: ['style-loader', 'css-loader'],
//         },
//       ],
//     },
//     plugins: [new webpack.DefinePlugin(defines)],
//   })

//   await new Promise((res) => {
//     compiler.run((err, result) => {
//       console.log({ err })
//       console.log(result?.toString())
//       res()
//     })
//   })
// }

async function main() {
  // https://gist.github.com/mizchi/5f67109d0719ef6dd57695e1f528ce8d
  console.log(
    'disabling intergration webpack for now... https://gist.github.com/mizchi/5f67109d0719ef6dd57695e1f528ce8d'
  )
  return

  if (process.env.DISABLE_PRE_TEST) {
    return
  }
  await extractStaticWebpackApp()
  process.env.IS_STATIC = undefined
  process.exit(0)
}

main()

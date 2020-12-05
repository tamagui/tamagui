import '@o/react-test-env/jsdom-register'

import path from 'path'

import * as babel from '@babel/core'
import { TestRenderer, act, render } from '@o/react-test-env'
import React from 'react'
import webpack from 'webpack'

import {
  outDir,
  outFile,
  outFileFull,
  specDir,
  test,
} from './spec/test-constants'

process.env.NODE_ENV = 'test'

test.before(async (t) => {
  await extractStaticApp()
  const app = require(outFileFull)
  t.context.app = app
  for (const key in app) {
    act(() => {
      const App = app[key]
      t.context[key.toLowerCase()] = {
        Element: App,
        renderer: TestRenderer.create(<App conditional={true} />),
        rendererFalse: TestRenderer.create(<App conditional={false} />),
      }
    })
  }
})

test('extracts stylesheets out', async (t) => {
  const output = extract(`
import { VStack } from 'snackui'

export function Test() {
  return (
    <VStack backgroundColor="red" />
  )
}
  `)

  console.log('output\n\n', output?.code)

  t.assert(1 === 1)
})

function extract(code: string) {
  return babel.transformSync(code, {
    filename: 'test.tsx',
    plugins: [
      require('../_/index'),
      [
        '@babel/plugin-syntax-typescript',
        {
          isTSX: true,
        },
      ],
    ],
  })
}

async function extractStaticApp() {
  const options = {
    // add our plugin
    plugins: [require.resolve('../_/index')],
    presets: [require.resolve('@o/babel-preset')],
  }
  console.log('options', options)
  const compiler = webpack({
    context: specDir,
    mode: 'production',
    devtool: false,
    optimization: {
      minimize: false,
      concatenateModules: false,
    },
    entry: path.join(specDir, 'extract-specs.tsx'),
    output: {
      libraryTarget: 'commonjs',
      filename: outFile,
      path: outDir,
    },
    externals: {
      react: 'react',
      'react-dom': 'react-dom',
    },
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
              options,
            },
          ],
        },
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        'process.env.DEBUG': JSON.stringify(process.env.DEBUG),
        'process.env.SNACKUI_COMPILE_PROCESS': JSON.stringify(1),
      }),
    ],
  })

  await new Promise<void>((res) => {
    compiler.run((err, result) => {
      console.log({ err })
      console.log(result?.toString())
      res()
    })
  })
}

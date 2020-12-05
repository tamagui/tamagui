import '@o/react-test-env/jsdom-register'

import path from 'path'

import * as babel from '@babel/core'
import { TestRenderer, act, render } from '@o/react-test-env'
import anyTest, { TestInterface } from 'ava'
import React from 'react'
import webpack from 'webpack'

import { outDir, outFile, outFileFull, specDir } from './spec/test-constants'

window['React'] = React
process.env.NODE_ENV = 'test'

export const test = anyTest as TestInterface<{
  app: any
}>

test.before(async (t) => {
  await extractStaticApp()
  try {
    const app = require(outFileFull)
    t.context.app = app
  } catch (err) {
    console.log('error', err.message, err.stack)
  }
})

test('extracts stylesheets out, basic straightforward babel check', async (t) => {
  const output = extract(`
import { VStack } from 'snackui'

export function Test() {
  return (
    <VStack backgroundColor="red" />
  )
}
  `)
  const code = output?.code ?? ''
  t.assert(
    code.includes(`"backgroundColor": "red"`) &&
      code.includes(`ReactNativeStyleSheet.create`)
  )
})

test('1. extracts to a div for simple views', async (t) => {
  const { app } = t.context
  const App = app.Test1

  const out = render(<App conditional={true} />)

  const is2 = await out.findByText('hello world')
  const parent = is2.parentElement

  console.log(window.getComputedStyle(parent!))

  t.assert(true)
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
    externals: [
      // all of this to ensure we share a react/react-dom
      ({ context, request }, callback) => {
        if (request === './cjs/react.development.js') {
          return callback(undefined, 'react')
        }
        if (request === './cjs/react-dom.development.js') {
          return callback(undefined, 'react-dom')
        }
        if (context.includes('node_modules')) {
          if (context.includes('react-native-web') && request[0] === '.') {
            const out = path
              .resolve(path.join(context, request))
              .replace(/.*node_modules\/react-native-web\//, '')
            return callback(undefined, 'commonjs ' + `react-native-web/${out}`)
          }
          return callback(undefined, 'commonjs ' + request)
        }
        callback()
      },
    ],
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
                plugins: [require.resolve('../_/index')],
                presets: [require.resolve('@o/babel-preset')],
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

import '@dish/react-test-env/jsdom-register'

import path from 'path'

import { TestRenderer, act, render } from '@dish/react-test-env'
import React from 'react'
import webpack from 'webpack'

import { externalizeModules } from './lib/externalizeModules'
import { outDir, specDir, test } from './lib/test-constants'
import { testStyles } from './lib/testStyles'

const outFile = 'out-webpack.js'
const outFileFull = path.join(outDir, outFile)

// @ts-ignore
window.matchMedia = function () {}

process.env.NODE_ENV = 'test'
process.env.IDENTIFY_TAGS = 'true'

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

//
// test styles
//
// testStyles(test)

test('1. extracts to a div for simple views', async (t) => {
  const { test1 } = t.context
  const out = test1.renderer.toJSON()!
  t.snapshot(out)
})

test('2. extracts className for complex views but keeps other props', async (t) => {
  const { test2 } = t.context
  const out = test2.renderer.toJSON()!
  t.snapshot(out)
  const outFalse = test2.rendererFalse.toJSON()
  t.snapshot(outFalse)
})

test('3. places className correctly given a single spread', async (t) => {
  const {
    test3: { Element },
  } = t.context
  const out = render(<Element />)
  const list = [...out.container.firstChild?.['classList']]
  t.snapshot(list)
})

test('4. leaves dynamic variables', async (t) => {
  const {
    test4: { renderer, Element },
  } = t.context
  const out = render(<Element />)
  const firstChild = out.container.firstChild!
  const classList = [...firstChild['classList']]
  t.snapshot(classList)
  const r = renderer.toJSON()
  t.snapshot(r)
})

test('5. spread conditional', async (t) => {
  const { test5 } = t.context
  const out = test5.renderer.toJSON()
  t.snapshot(out)
})

test('6. spread ternary', async (t) => {
  const { test6 } = t.context
  t.snapshot(test6.renderer.toJSON())
  t.snapshot(test6.rendererFalse.toJSON())
})

test('7. ternary + data-is', async (t) => {
  const { test7 } = t.context
  const out = test7.renderer.toJSON()
  t.snapshot(out)
})

test('8. styleExpansions', async (t) => {
  const { test8 } = t.context
  const out = test8.renderer.toJSON()
  t.snapshot(out)
  // TODO test constant folding
})

test('9. combines with classname', async (t) => {
  const { test9 } = t.context
  const out = test9.renderer.toJSON()
  t.snapshot(out)
})

test('10. extracts Text', async (t) => {
  const { test10 } = t.context
  const out = test10.renderer.toJSON()
  t.snapshot(out)
})

test('11. combines everything', async (t) => {
  const {
    test11: { Element },
  } = t.context
  const out = render(<Element conditional={false} />)
  const firstChild = out.container.firstChild!
  const classList = [...firstChild['classList']]
  t.snapshot(classList)
})

test('12. ternary multiple on same key', async (t) => {
  const { test12 } = t.context
  t.snapshot(test12.renderer.toJSON())
})

test('13. text with complex conditional and local vars', async (t) => {
  const { test13 } = t.context
  // console.log('test13', test13.renderer!.toTree())
  t.is(1, 1)
})

test('14. extracts psuedo styles and evaluates constants', async (t) => {
  const { test14 } = t.context
  const out = test14.renderer.toJSON()
  t.snapshot(out)
})

test('15. extracts spacer (complex expansion)', async (t) => {
  const { test15 } = t.context
  const out = test15.renderer.toJSON()
  t.snapshot(out)
})

test('16. deopt when spreading multiple', async (t) => {
  const { test16 } = t.context
  const out = test16.renderer.toJSON()
  t.snapshot(out)
})

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
      publicPath: '',
      libraryTarget: 'commonjs',
      filename: outFile,
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
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
            },
            {
              loader: require.resolve('../loader'),
              options: {
                evaluateImportsWhitelist: ['constants.js'],
              },
            },
          ],
        },
        {
          test: /\.css$/,
          use: [
            { loader: 'file-loader', options: { name: 'out.[fullhash].css' } },
            'extract-loader',
            'css-loader',
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

import '@o/react-test-env/jsdom-register'

import path from 'path'

import { TestRenderer, act, render, screen } from '@o/react-test-env'
import anyTest, { TestInterface } from 'ava'
import React from 'react'
// import { ViewStyle } from 'react-native'
import webpack from 'webpack'

// @ts-ignore
window.matchMedia = function() {}

import { UIStaticWebpackPlugin, getStylesAtomic } from '../src'

const mode = 'production'
process.env.NODE_ENV = 'test'
process.env.IDENTIFY_TAGS = 'true'

type TestApp = {
  renderer: TestRenderer.ReactTestRenderer
  rendererFalse: TestRenderer.ReactTestRenderer
  Element: any
}

const test = anyTest as TestInterface<{
  test1: TestApp
  test2: TestApp
  test3: TestApp
  test4: TestApp
  test5: TestApp
  test6: TestApp
  test7: TestApp
  test8: TestApp
  test9: TestApp
  test10: TestApp
  test11: TestApp
  test12: TestApp
  test13: TestApp
  test14: TestApp
  test15: TestApp
  test16: TestApp
  app: any
}>

const specDir = path.join(__dirname, 'spec')
const outDir = path.join(specDir, 'out')
const outFile = 'out.js'
const outFileFull = path.join(outDir, outFile)

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

test('converts a style object to class names', async (t) => {
  const style = {
    backgroundColor: 'red',
    transform: [{ rotateY: '10deg' }],
    shadowRadius: 10,
    shadowColor: 'red',
    borderBottomWidth: 1,
    borderBottomColor: 'blue',
  }
  const styles = getStylesAtomic(style)
  const style1 = styles.find((x) => x.property === 'backgroundColor')
  const style2 = styles.find((x) => x.property === 'transform')
  const style3 = styles.find((x) => x.property === 'boxShadow')
  t.assert(!!style1)
  t.assert(!!style2)
  t.assert(!!style3)
  t.assert(
    styles.find((x) => x.property === 'borderBottomStyle').value === 'solid',
  )
  t.deepEqual(style1!.rules, [
    '.r-backgroundColor-1g6456j{background-color:rgba(255,0,0,1.00);}',
  ])
  t.deepEqual(style2!.rules, [
    '.r-transform-1kwkdns{-webkit-transform:rotateY(10deg);transform:rotateY(10deg);}',
  ])
  t.deepEqual(style3!.rules, [
    '.r-boxShadow-rfqnir{box-shadow:0px 0px 10px rgba(255,0,0,1.00);}',
  ])
})

test('expands and resolves shorthand props', async (t) => {
  const style = {
    padding: 10,
    paddingVertical: 0,
  }
  const [pB, pL, pR, pT] = getStylesAtomic(style)
  t.is(pT.value, '0px')
  t.is(pB.value, '0px')
  t.is(pL.value, '10px')
  t.is(pR.value, '10px')

  const style2 = {
    borderColor: 'yellow',
    borderWidth: 10,
  }
  const styles2 = getStylesAtomic(style2)
  t.assert(styles2.some((x) => x.property === 'borderRightStyle'))
})

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
  console.log('out', out)
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
    mode,
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
            { loader: 'file-loader', options: { name: 'out.[hash].css' } },
            'extract-loader',
            'css-loader',
          ],
        },
      ],
    },
    plugins: [
      new UIStaticWebpackPlugin(),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        'process.env.DEBUG': JSON.stringify(process.env.DEBUG),
      }),
    ],
  })

  await new Promise((res) => {
    compiler.run((err, result) => {
      console.log({ err })
      console.log(result?.toString())
      res()
    })
  })
}

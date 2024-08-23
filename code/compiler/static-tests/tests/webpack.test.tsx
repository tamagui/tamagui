import '@expo/match-media'
import TestRenderer from 'react-test-renderer'
import { describe, expect, test } from 'vitest'

/**
 * disabled for now but we really need to bring this back
 */

function getTest(name: string) {
  const app = require('./spec/out/out-webpack')
  const App = app[name]
  if (!App) {
    throw new Error(`No app found: ${name} in ${Object.keys(app || {})}`)
  }
  const Provider = app.Provider
  return {
    get Element() {
      return (props) => (
        <Provider>
          <App {...props} />
        </Provider>
      )
    },
    get renderer() {
      return TestRenderer.create(
        <Provider>
          <App conditional={true} />
        </Provider>
      )
    },
    get rendererFalse() {
      return TestRenderer.create(
        <Provider>
          <App conditional={false} />
        </Provider>
      )
    },
  }
}

describe('webpack-tests', () => {
  test('1. extracts to a div for simple views, flat transforms', () => {
    const test1 = getTest('Test1')
    const out = test1.renderer.toJSON()!
    expect(out).toMatchSnapshot()
  })

  test('2. extracts className for complex views but keeps other props', () => {
    const test2 = getTest('Test2')
    const out = test2.renderer.toJSON()!
    expect(out).toMatchSnapshot()
    const outFalse = test2.rendererFalse.toJSON()
    expect(outFalse).toMatchSnapshot()
  })

  // test('3. places className correctly given a single spread', async () => {
  //   const { Element } = getTest('Test3')
  //   const out = render(<Element />)
  //   const list = [...out.container.firstChild?.['classList']]
  //   expect(list).toMatchSnapshot()
  // })

  // test('4. leaves dynamic variables', async () => {
  //   const { renderer, Element } = getTest('Test4')
  //   const out = render(<Element />)
  //   const firstChild = out.container.firstChild!
  //   const classList = [...firstChild['classList']]
  //   expect(classList).toMatchSnapshot()
  //   const r = renderer.toJSON()
  //   expect(r).toMatchSnapshot()
  // })

  test('5. spread conditional', async () => {
    const test5 = getTest('Test5')
    const out = test5.renderer.toJSON()
    expect(out).toMatchSnapshot()
  })

  test('6. spread ternary', async () => {
    const test6 = getTest('Test6')
    expect(test6.renderer.toJSON()).toMatchSnapshot()
    expect(test6.rendererFalse.toJSON()).toMatchSnapshot()
  })

  test('7. ternary + data-is', async () => {
    const test7 = getTest('Test7')
    const out = test7.renderer.toJSON()
    expect(out).toMatchSnapshot()
  })

  test('8. styleExpansions', async () => {
    const test8 = getTest('Test8')
    const out = test8.renderer.toJSON()
    expect(out).toMatchSnapshot()
  })

  test('9. combines with classname', async () => {
    const test9 = getTest('Test9')
    const out = test9.renderer.toJSON()
    expect(out).toMatchSnapshot()
  })

  test('10. extracts Text', async () => {
    const test10 = getTest('Test10')
    const out = test10.renderer.toJSON()
    expect(out).toMatchSnapshot()
  })

  // test('11. combines everything', async () => {
  //   const { Element } = getTest('Test11')
  //   const out = render(<Element conditional={false} />)
  //   const firstChild = out.container.firstChild!
  //   const classList = [...firstChild['classList']]
  //   expect(classList).toMatchSnapshot()
  // })

  test('12. te  rnary multiple on same key', async () => {
    const test12 = getTest('Test12')
    expect(test12.renderer.toJSON()).toMatchSnapshot()
  })

  // test('13. text with complex conditional and local vars', async () => {
  // const test13 } = getTest('{')
  //   // console.log('test13', test13.renderer!.toTree())
  //   t.is(1, 1)
  // })

  test('14. extracts pseudo styles and evaluates constants', async () => {
    const test14 = getTest('Test14')
    const out = test14.renderer.toJSON()
    expect(out).toMatchSnapshot()
  })

  test('15. extracts spacer (complex expansion)', () => {
    const test15 = getTest('Test15')
    const out = test15.renderer.toJSON()
    expect(out).toMatchSnapshot()
  })

  test('16. deopt when spreading multiple', () => {
    const test16 = getTest('Test16')
    const out = test16.renderer.toJSON()
    expect(out).toMatchSnapshot()
  })

  test('17. variant default false flattens properly', () => {
    const out = getTest('TestVariantDefaultFalseOn').renderer.toJSON()
    const outCn = out.children[0].children[0].children[0].props.className

    const out2 = getTest('TestVariantDefaultFalseOff').renderer.toJSON()
    const out2Cn = out2.children[0].children[0].children[0].props.className

    expect(outCn).to.not.contain(`_pt-var--space-40093`)
    expect(out2Cn).to.contain(`_pt-var--space-40093`)
  })
})

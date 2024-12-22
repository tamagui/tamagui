import '@expo/match-media'
import { render, screen } from '@testing-library/react'
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
    Element: (props: any) => (
      <Provider>
        <App {...props} />
      </Provider>
    ),
    renderTrue: () =>
      render(
        <Provider>
          <App conditional={true} />
        </Provider>
      ),
    renderFalse: () =>
      render(
        <Provider>
          <App conditional={false} />
        </Provider>
      ),
  }
}

describe('webpack-tests', () => {
  test('1. extracts to a div for simple views, flat transforms', () => {
    const { renderTrue } = getTest('Test1')
    const { container } = renderTrue()
    expect(container).toMatchSnapshot()
  })

  test('2. extracts className for complex views but keeps other props', () => {
    const { renderTrue, renderFalse } = getTest('Test2')
    const { container: containerTrue } = renderTrue()
    expect(containerTrue).toMatchSnapshot()
    const { container: containerFalse } = renderFalse()
    expect(containerFalse).toMatchSnapshot()
  })

  test('5. spread conditional', () => {
    const { renderTrue } = getTest('Test5')
    const { container } = renderTrue()
    expect(container).toMatchSnapshot()
  })

  test('6. spread ternary', () => {
    const { renderTrue, renderFalse } = getTest('Test6')
    expect(renderTrue().container).toMatchSnapshot()
    expect(renderFalse().container).toMatchSnapshot()
  })

  test('7. ternary + data-is', () => {
    const { renderTrue } = getTest('Test7')
    const { container } = renderTrue()
    expect(container).toMatchSnapshot()
  })

  test('8. styleExpansions', () => {
    const { renderTrue } = getTest('Test8')
    const { container } = renderTrue()
    expect(container).toMatchSnapshot()
  })

  test('9. combines with classname', () => {
    const { renderTrue } = getTest('Test9')
    const { container } = renderTrue()
    expect(container).toMatchSnapshot()
  })

  test('10. extracts Text', () => {
    const { renderTrue } = getTest('Test10')
    const { container } = renderTrue()
    expect(container).toMatchSnapshot()
  })

  test('12. ternary multiple on same key', () => {
    const { renderTrue } = getTest('Test12')
    expect(renderTrue().container).toMatchSnapshot()
  })

  test('14. extracts pseudo styles and evaluates constants', () => {
    const { renderTrue } = getTest('Test14')
    const { container } = renderTrue()
    expect(container).toMatchSnapshot()
  })

  test('15. extracts spacer (complex expansion)', () => {
    const { renderTrue } = getTest('Test15')
    const { container } = renderTrue()
    expect(container).toMatchSnapshot()
  })

  test('16. deopt when spreading multiple', () => {
    const { renderTrue } = getTest('Test16')
    const { container } = renderTrue()
    expect(container).toMatchSnapshot()
  })

  test('17. variant default false flattens properly', () => {
    const { renderTrue: renderOn } = getTest('TestVariantDefaultFalseOn')
    const { renderTrue: renderOff } = getTest('TestVariantDefaultFalseOff')

    const { container: containerOn } = renderOn()
    const { container: containerOff } = renderOff()

    const outCn =
      containerOn.firstChild?.firstChild?.firstChild?.firstChild?.['className']
    const out2Cn =
      containerOff.firstChild?.firstChild?.firstChild?.firstChild?.['className']

    expect(outCn).not.toContain(`_pl-t-space-4`)
    expect(out2Cn).toContain(`_pl-t-space-4`)
  })
})

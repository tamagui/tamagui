/**
 * @vitest-environment jsdom
 */

import { render } from '@testing-library/react'
import React from 'react'
import { describe, expect, test } from 'vitest'

// Make React available globally for the webpack output
;(global as any).React = React
if (typeof window !== 'undefined') {
  ;(window as any).React = React
}

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

    // Find the div with is_MyComponent class which has the padding classes
    const divOn = containerOn.querySelector('.is_MyComponent')
    const divOff = containerOff.querySelector('.is_MyComponent')

    const outCn = divOn?.className
    const out2Cn = divOff?.className

    expect(outCn).not.toContain(`_pl-t-space-4`)
    expect(out2Cn).toContain(`_pl-t-space-4`)
  })

  test('18. extracts flexWrap property', () => {
    const { renderTrue } = getTest('TestFlexWrap')
    const { container } = renderTrue()

    const element = container.querySelector('div[class*="_fwr-"]')
    expect(element).toBeTruthy()

    const computedStyle = window.getComputedStyle(element!)
    expect(computedStyle.flexWrap).toBe('wrap')

    expect(container).toMatchSnapshot()
  })

  test('19. extracts flexWrap with conditional', () => {
    const { renderTrue, renderFalse } = getTest('TestFlexWrapConditional')

    const { container: containerTrue } = renderTrue()
    const { container: containerFalse } = renderFalse()

    const elementTrue = containerTrue.querySelector('div[class*="_fwr-"]')
    const elementFalse = containerFalse.querySelector('div[class*="_fwr-"]')

    expect(elementTrue).toBeTruthy()
    expect(elementFalse).toBeTruthy()

    const computedStyleTrue = window.getComputedStyle(elementTrue!)
    const computedStyleFalse = window.getComputedStyle(elementFalse!)

    expect(computedStyleTrue.flexWrap).toBe('wrap')
    expect(computedStyleFalse.flexWrap).toBe('nowrap')

    expect(containerTrue).toMatchSnapshot()
    expect(containerFalse).toMatchSnapshot()
  })

  test('20. extracts multiple flex properties together', () => {
    const { renderTrue } = getTest('TestFlexProperties')
    const { container } = renderTrue()

    // Select the div element which is the actual component (inside theme/font wrapper spans)
    const element = container.querySelector('span.is_Theme div') as HTMLElement
    expect(element).toBeTruthy()

    const computedStyle = window.getComputedStyle(element!)
    expect(computedStyle.flexWrap).toBe('wrap')
    expect(computedStyle.flexDirection).toBe('column')
    expect(computedStyle.flexGrow).toBe('1')
    expect(computedStyle.flexShrink).toBe('0')
    expect(computedStyle.alignItems).toBe('stretch')

    expect(container).toMatchSnapshot()
  })

  test('21. complex real-world case - flexWrap with many conditionals and media queries', () => {
    const { renderTrue, renderFalse } = getTest('TestComplexFlexWithConditionals')

    const { container: containerTrue } = renderTrue()
    const { container: containerFalse } = renderFalse()

    // Find the XStack (nested child) that has flexWrap
    const xstackTrue = containerTrue.querySelector('div > div')
    const xstackFalse = containerFalse.querySelector('div > div')

    expect(xstackTrue).toBeTruthy()
    expect(xstackFalse).toBeTruthy()

    const computedStyleTrue = window.getComputedStyle(xstackTrue!)
    const computedStyleFalse = window.getComputedStyle(xstackFalse!)

    expect(computedStyleTrue.flexWrap).toBe('wrap')
    expect(computedStyleFalse.flexWrap).toBe('wrap')

    expect(containerTrue).toMatchSnapshot()
    expect(containerFalse).toMatchSnapshot()
  })

  test('22. flexWrap with media query conditionals', () => {
    const { renderTrue } = getTest('TestFlexWrapWithMediaQuery')
    const { container } = renderTrue()

    // Select the div element which is the actual component (inside theme/font wrapper spans)
    const element = container.querySelector('span.is_Theme div') as HTMLElement
    expect(element).toBeTruthy()

    const computedStyle = window.getComputedStyle(element!)
    expect(computedStyle.flexWrap).toBe('wrap')

    expect(container).toMatchSnapshot()
  })
})

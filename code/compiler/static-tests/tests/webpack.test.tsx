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

    const divOn = containerOn.querySelector('.is_MyComponent')
    const divOff = containerOff.querySelector('.is_MyComponent')

    expect(divOn).toBeTruthy()
    expect(divOff).toBeTruthy()
    expect(window.getComputedStyle(divOn!).paddingLeft).toBe('')
    expect(window.getComputedStyle(divOff!).paddingLeft).toBe('var(--c-space-4)')
  })

  test('18. extracts flexWrap property', () => {
    const { renderTrue } = getTest('TestFlexWrap')
    const { container } = renderTrue()

    const element = container.querySelector('[data-testid="flex-wrap"]')
    expect(element).toBeTruthy()

    const computedStyle = window.getComputedStyle(element!)
    expect(computedStyle.flexWrap).toBe('wrap')

    expect(container).toMatchSnapshot()
  })

  test('19. extracts flexWrap with conditional', () => {
    const { renderTrue, renderFalse } = getTest('TestFlexWrapConditional')

    const { container: containerTrue } = renderTrue()
    const { container: containerFalse } = renderFalse()

    const elementTrue = containerTrue.querySelector(
      '[data-testid="flex-wrap-conditional"]'
    )
    const elementFalse = containerFalse.querySelector(
      '[data-testid="flex-wrap-conditional"]'
    )

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

    const element = container.querySelector(
      '[data-testid="flex-properties"]'
    ) as HTMLElement
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

    const element = container.querySelector(
      '[data-testid="flex-wrap-media"]'
    ) as HTMLElement
    expect(element).toBeTruthy()

    const computedStyle = window.getComputedStyle(element!)
    expect(computedStyle.flexWrap).toBe('wrap')

    expect(container).toMatchSnapshot()
  })

  test('23. inert animatedBy selector flattens with group styles', () => {
    const { renderTrue } = getTest('TestAnimatedByWithoutAnimation')
    const { container } = renderTrue()
    const parent = container.querySelector('[data-testid="animated-group"]')
    const child = container.querySelector('[data-testid="animated-group-child"]')

    expect(parent).toBeTruthy()
    expect(parent?.hasAttribute('animatedby')).toBe(false)
    expect(parent?.className).toContain('t_group_animated')
    expect(child?.className).toContain('_bc-')
    expect(container).toMatchSnapshot()
  })

  test('24. DOM frontend lowers to semantic host elements', () => {
    const { renderTrue } = getTest('TestDOMSemanticTags')
    const { container } = renderTrue()
    const main = container.querySelector('[data-testid="dom-main"]')
    const heading = main?.querySelector('h1')
    const navigation = main?.querySelector('nav')
    const link = navigation?.querySelector('a')

    expect(main?.tagName).toBe('MAIN')
    expect(heading?.textContent).toBe('DOM heading')
    expect(navigation?.getAttribute('aria-label')).toBe('DOM navigation')
    expect(link?.getAttribute('href')).toBe('/dom-link')
    expect(link?.textContent).toBe('DOM link')
  })
})

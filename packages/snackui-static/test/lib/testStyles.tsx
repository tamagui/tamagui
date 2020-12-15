import { cleanup, render } from '@dish/react-test-env'
import { TestInterface } from 'ava'
import React from 'react'

export function testStyles(
  test: TestInterface<{
    app: any
  }>
) {
  test('styles - 1. extracts to a div for simple views', async (t) => {
    const { app } = t.context
    const { style } = await getTestElement(app.Test1)
    t.is(style.backgroundColor, 'rgb(255, 0, 0)')
    t.is(style.borderTopLeftRadius, '100px')
    t.is(style.boxShadow, '0px 0px 10px rgba(0,0,0,1.00)')
  })

  test('styles - 2. extracts className for complex views but keeps other props', async (t) => {
    const { app } = t.context
    const [truthy, falsy] = await getTestElements(app.Test2)
    t.is(truthy.style.backgroundColor, 'rgb(255, 255, 255)')
    t.is(truthy.style.top, '-14px')
    t.is(falsy.style.backgroundColor, 'rgb(0, 0, 0)')
    t.is(falsy.style.top, '0px')
  })

  test('styles - 6. spread ternary', async (t) => {
    const { app } = t.context
    const [truthy, falsy] = await getTestElements(app.Test6)
    t.is(truthy.style.backgroundColor, 'rgb(0, 0, 255)')
    t.is(falsy.style.backgroundColor, 'rgb(255, 0, 0)')
  })

  test('styles - 11. all in one', async (t) => {
    const { app } = t.context
    const [truthy, falsy] = await getTestElements(app.Test11)
    t.is(truthy.style.height, '31px')
    t.is(truthy.style.borderTopLeftRadius, '8px')
    t.is(truthy.style.borderTopColor, 'rgba(0,0,0,0.15)')
    t.is(truthy.style['overflow-x'], 'hidden')
    t.is(truthy.style.backgroundColor, 'rgb(0, 0, 255)')
    t.is(falsy.style.height, '0px')
    t.is(falsy.style.borderTopLeftRadius, '0px')
    t.is(falsy.style.borderTopColor, 'rgba(0,0,0,0.15)')
    t.is(falsy.style['overflow-x'], 'hidden')
    t.is(falsy.style.backgroundColor, 'rgb(0, 0, 255)')
  })
}

export async function getTestElement(Component: any, conditional = false) {
  const out = render(<Component conditional={conditional} />)
  const childElement = await out.findByText('hello world')
  const element = childElement.parentElement!
  const style = window.getComputedStyle(element)
  cleanup()
  return {
    element,
    style,
  }
}

export async function getTestElements(Component: any) {
  return [
    await getTestElement(Component, true),
    await getTestElement(Component, false),
  ] as const
}

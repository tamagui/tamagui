import { cleanup, render } from '@dish/react-test-env'
import React from 'react'

export function testStyles(test: TestFn, app: any) {
  test('styles - 1. extracts to a div for simple views', async (t) => {
    const { style } = await getTestElement(app.Test1)
    expect(style.backgroundColor).toBe('rgb(255, 0, 0)')
    expect(style.borderTopLeftRadius).toBe('100px')
    expect(style.boxShadow).toBe('0px 0px 10px rgba(0,0,0,1.00)')
  })

  test('styles - 2. extracts className for complex views but keeps other props', async (t) => {
    const [truthy, falsy] = await getTestElements(app.Test2)
    expect(truthy.style.backgroundColor).toBe('rgb(255, 255, 255)')
    expect(truthy.style.top).toBe('-14px')
    expect(falsy.style.backgroundColor).toBe('rgb(0, 0, 0)')
    expect(falsy.style.top).toBe('0px')
  })

  test('styles - 6. spread ternary', async (t) => {
    const [truthy, falsy] = await getTestElements(app.Test6)
    expect(truthy.style.backgroundColor).toBe('rgb(0, 0, 255)')
    expect(falsy.style.backgroundColor).toBe('rgb(255, 0, 0)')
  })

  test('styles - 11. all in one', async (t) => {
    const [truthy, falsy] = await getTestElements(app.Test11)
    expect(truthy.style.height).toBe('31px')
    expect(truthy.style.borderTopLeftRadius).toBe('8px')
    expect(truthy.style.borderTopColor).toBe('rgba(0,0,0,0.15)')
    expect(truthy.style['overflow-x']).toBe('hidden')
    expect(truthy.style.backgroundColor).toBe('rgb(0, 0, 255)')
    expect(falsy.style.height).toBe('0px')
    expect(falsy.style.borderTopLeftRadius).toBe('0px')
    expect(falsy.style.borderTopColor).toBe('rgba(0,0,0,0.15)')
    expect(falsy.style['overflow-x']).toBe('hidden')
    expect(falsy.style.backgroundColor).toBe('rgb(0, 0, 255)')
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

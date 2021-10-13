import { cleanup, render } from '@dish/react-test-env'
import * as React from 'react'

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
  const a = await getTestElement(Component, true)
  const b = await getTestElement(Component, false)
  return [a, b] as const
}

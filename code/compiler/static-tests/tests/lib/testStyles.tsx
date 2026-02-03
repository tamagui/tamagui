import { cleanup, render } from '@testing-library/react'

export async function getTestElement(Provider: any, Component: any, conditional = false) {
  const out = render(
    <Provider>
      <Component conditional={conditional} />
    </Provider>
  )
  const childElement = await out.findByText('hello world')
  const element = childElement.parentElement!
  const style = window.getComputedStyle(element)
  cleanup()
  return {
    element,
    style,
  }
}

export async function getTestElements(Provider: any, Component: any) {
  const a = await getTestElement(Provider, Component, true)
  const b = await getTestElement(Provider, Component, false)
  return [a, b] as const
}

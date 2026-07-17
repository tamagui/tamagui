import { createRequire } from 'node:module'
import type { ReactElement } from 'react'
import { describe, expect, test } from 'vitest'

import { ToastControl } from '../components/CurrentToast'
import { Provider } from '../components/Provider'

type TestNode = {
  props: Record<string, any>
}

type Rendered = {
  root: {
    find(predicate: (node: TestNode) => boolean): TestNode
    findAll(predicate: (node: TestNode) => boolean): TestNode[]
  }
}

const require = createRequire(import.meta.url)
const TestRenderer = require('react-test-renderer') as {
  act(callback: () => void | Promise<void>): Promise<void>
  create(element: ReactElement): Rendered
}
const { act } = TestRenderer

function textContent(value: unknown): string {
  if (Array.isArray(value)) return value.map(textContent).join('')
  if (typeof value === 'string' || typeof value === 'number') return String(value)
  if (value && typeof value === 'object' && 'props' in value) {
    return textContent((value as { props?: { children?: unknown } }).props?.children)
  }
  return ''
}

function responder(rendered: Rendered, testID: string): TestNode {
  return rendered.root.find(
    (node) =>
      node.props.testID === testID &&
      typeof node.props.onStartShouldSetResponder === 'function' &&
      node.props.onStartShouldSetResponder({}) === true &&
      typeof node.props.onResponderGrant === 'function' &&
      typeof node.props.onResponderRelease === 'function'
  )
}

async function press(node: TestNode) {
  await act(async () => {
    node.props.onResponderGrant({})
    node.props.onResponderRelease({})
  })
}

describe('Expo Router starter on native', () => {
  test('renders and interacts with the starter toast controls', async () => {
    let rendered: Rendered | null = null

    await act(async () => {
      rendered = TestRenderer.create(
        <Provider>
          <ToastControl />
        </Provider>
      )
    })

    await press(responder(rendered!, 'toast-show'))

    expect(
      rendered!.root
        .findAll((node) => node.props.testID === 'toast-title')
        .some((node) => textContent(node.props.children) === 'Successfully saved!')
    ).toBe(true)

    await press(responder(rendered!, 'toast-hide'))
    expect(
      rendered!.root.findAll((node) => node.props.testID === 'toast-title')
    ).toHaveLength(0)
  })
})

import { createRequire } from 'node:module'
import type { ReactElement } from 'react'
import { describe, expect, test, vi } from 'vitest-native'

import { App } from '../src/App'

type TestNode = { props: Record<string, any> }
type Rendered = {
  root: {
    find(predicate: (node: TestNode) => boolean): TestNode
    findAll(predicate: (node: TestNode) => boolean): TestNode[]
  }
}

const require = createRequire(import.meta.url)
const TestRenderer = require('react-test-renderer') as {
  act(cb: () => void | Promise<void>): Promise<void>
  create(el: ReactElement): Rendered
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

// mount the blank expo app (with the installed Button), fire a native press via
// the RN responder events the styled Button wires up, and assert the visible
// press count advances — the copied item builds under Metro resolution AND
// behaves.
describe('installed Button on native', () => {
  test('renders and responds to press', async () => {
    vi.useFakeTimers()
    let rendered: Rendered | null = null
    await act(async () => {
      rendered = TestRenderer.create(<App />)
    })

    const countText = () =>
      rendered!.root
        .findAll((n) => n.props.testID === 'smoke-count')
        .map((n) => textContent(n.props.children))
        .find((t) => t.startsWith('presses:'))

    expect(countText()).toBe('presses:0')

    const responder = rendered!.root.find(
      (n) =>
        n.props.testID === 'smoke-button' &&
        typeof n.props.onStartShouldSetResponder === 'function' &&
        n.props.onStartShouldSetResponder({}) === true &&
        typeof n.props.onResponderRelease === 'function'
    )

    await act(async () => {
      responder.props.onResponderGrant?.({})
      responder.props.onResponderRelease({})
      vi.runAllTimers()
    })

    expect(countText()).toBe('presses:1')
  })
})

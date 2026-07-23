import { createRequire } from 'node:module'
import type { ReactElement } from 'react'
import { describe, expect, test, vi } from 'vitest-native'

import { CanaryTree } from '../src/CanaryTree'

type TestNode = {
  props: Record<string, any>
}

type Rendered = {
  root: {
    find(predicate: (node: TestNode) => boolean): TestNode
    findAll(predicate: (node: TestNode) => boolean): TestNode[]
    findAllByProps(props: Record<string, any>): TestNode[]
  }
}

const require = createRequire(import.meta.url)
const TestRenderer = require('react-test-renderer') as {
  act(callback: () => void | Promise<void>): Promise<void>
  create(element: ReactElement): Rendered
}
const { act } = TestRenderer

function flattenStyle(style: unknown): Record<string, unknown> {
  if (Array.isArray(style)) {
    return Object.assign({}, ...style.map(flattenStyle))
  }
  return (style as Record<string, unknown>) || {}
}

function textContent(value: unknown): string {
  if (Array.isArray(value)) return value.map(textContent).join('')
  if (typeof value === 'string' || typeof value === 'number') return String(value)
  if (value && typeof value === 'object' && 'props' in value) {
    return textContent((value as { props?: { children?: unknown } }).props?.children)
  }
  return ''
}

function byTestID(rendered: Rendered, testID: string) {
  const matches = rendered.root.findAll((node) => node.props.testID === testID)
  return matches.findLast((node) => node.props.style !== undefined) ?? matches[0]
}

describe('shared v3 canary on native', () => {
  test('renders claimed tokens, context variants, and copied skins', async () => {
    vi.useFakeTimers()
    let rendered: Rendered | null = null

    await act(async () => {
      rendered = TestRenderer.create(<CanaryTree />)
    })

    const claimed = flattenStyle(byTestID(rendered!, 'canary-claimed').props.style)
    const crossFile = flattenStyle(byTestID(rendered!, 'canary-cross-file').props.style)
    const buttonResponder = rendered!.root.find(
      (node) =>
        node.props.testID === 'canary-button' &&
        typeof node.props.onStartShouldSetResponder === 'function' &&
        node.props.onStartShouldSetResponder({}) === true &&
        typeof node.props.onResponderGrant === 'function' &&
        typeof node.props.onResponderRelease === 'function'
    )
    const circular = flattenStyle(
      byTestID(rendered!, 'canary-button-compound').props.style
    )
    const selectTrigger = flattenStyle(
      byTestID(rendered!, 'canary-select-trigger').props.style
    )

    expect(claimed.padding ?? claimed.paddingTop).toBe(18)
    expect(claimed.backgroundColor).toBe('#7c3aed')
    expect(crossFile).toMatchObject({
      height: 32,
      minHeight: 12,
      opacity: 0.5,
      paddingTop: 0,
      width: 32,
    })
    expect(circular).toMatchObject({ height: 30, width: 30 })
    expect(selectTrigger.height).toBe(32)

    await act(async () => {
      buttonResponder.props.onResponderGrant({})
      buttonResponder.props.onResponderRelease({})
      vi.runAllTimers()
    })

    expect(
      rendered!.root
        .findAll((node) => node.props.testID === 'canary-press-count')
        .some((node) => textContent(node.props.children) === 'presses:1')
    ).toBe(true)
  })
})

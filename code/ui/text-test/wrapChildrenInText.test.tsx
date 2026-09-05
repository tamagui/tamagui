import React from 'react'
import { expect, test } from 'vitest'

import { wrapChildrenInText } from '../text/src/wrapChildrenInText'

const Comp = () => {}
const re = <div data-id={Math.random()} />
const reID = re.props['data-id']

test('should wrap string children, joining adjacent ones', () => {
  const out = wrapChildrenInText(Comp, {
    children: [re, 'a', 'b', re, 'c', re, 'd'],
  }) as any

  // 'a' and 'b' are adjacent, so they share a single Text
  expect(out).toHaveLength(6)

  expect(out[0].props['data-id']).toBe(reID)

  expect(out[1].type).toBe(Comp)
  expect(out[1].props.children).toStrictEqual('ab')

  expect(out[2].props['data-id']).toBe(reID)
  expect(out[3].props.children).toStrictEqual('c')
  expect(out[4].props['data-id']).toBe(reID)
  expect(out[5].props.children).toStrictEqual('d')
})

test('should first child string', () => {
  const out = wrapChildrenInText(Comp, {
    children: ['a', re],
  }) as any

  expect(out[0].type).toBe(Comp)
  expect(out[0].props.children).toStrictEqual('a')

  expect(out[1].props['data-id']).toBe(reID)
})

// `<Button>increment {name}</Button>` is children ['increment ', name]. Wrapping each
// separately renders sibling text nodes with a visible gap, and breaks ellipsis,
// wrapping and accessible-label matching across the whole string.
test('should join an interpolated string into one text node', () => {
  const out = wrapChildrenInText(Comp, {
    children: ['increment ', 'slot'],
  }) as any

  expect(out).toHaveLength(1)
  expect(out[0].type).toBe(Comp)
  expect(out[0].props.children).toStrictEqual('increment slot')
})

// numbers are text too — left unwrapped they throw
// "Text strings must be rendered within a <Text> component" on native
test('should wrap numeric children and join them with adjacent strings', () => {
  const out = wrapChildrenInText(Comp, {
    children: ['Count: ', 5],
  }) as any

  expect(out).toHaveLength(1)
  expect(out[0].type).toBe(Comp)
  expect(out[0].props.children).toStrictEqual('Count: 5')
})

test('should wrap a lone numeric child', () => {
  const out = wrapChildrenInText(Comp, { children: 5 }) as any

  expect(out).toHaveLength(1)
  expect(out[0].type).toBe(Comp)
  expect(out[0].props.children).toStrictEqual(5)
})

test('should keep non-text children untouched and unjoined', () => {
  const out = wrapChildrenInText(Comp, { children: [re, re] }) as any

  expect(out).toHaveLength(2)
  expect(out[0].props['data-id']).toBe(reID)
  expect(out[1].props['data-id']).toBe(reID)
})

import React from 'react'
import { expect, test } from 'vitest'

import { wrapChildrenInText } from '../text/src/wrapChildrenInText'

const Comp = () => {}
const re = <div data-id={Math.random()} />
const reID = re.props['data-id']

test('should wrap all string children', () => {
  const out = wrapChildrenInText(Comp, {
    children: [re, 'a', 'b', re, 'c', re, 'd'],
  }) as any

  expect(out[0].props['data-id']).toBe(reID)

  expect(out[1].type).toBe(Comp)
  expect(out[1].props.children).toStrictEqual('a')
  expect(out[2].props.children).toStrictEqual('b')
  expect(out[3].props['data-id']).toBe(reID)
  expect(out[4].props.children).toStrictEqual('c')
  expect(out[5].props['data-id']).toBe(reID)
  expect(out[6].props.children).toStrictEqual('d')
})

test('should first child string', () => {
  const out = wrapChildrenInText(Comp, {
    children: ['a', re],
  }) as any

  expect(out[0].type).toBe(Comp)
  expect(out[0].props.children).toStrictEqual('a')

  expect(out[1].props['data-id']).toBe(reID)
})

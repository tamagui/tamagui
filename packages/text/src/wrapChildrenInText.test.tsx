import { expect, test } from 'vitest'

import { wrapChildrenInText } from './wrapChildrenInText'

const Comp = () => {}
const re = <div data-id={Math.random()} />
const reID = re.props['data-id']

test('should wrap all string children, not wrap others', () => {
  const out = wrapChildrenInText(Comp, {
    children: [re, 'a', 'b', re, 'c', re, 'd'],
  }) as any

  expect(out[0].props['data-id']).toBe(reID)

  expect(out[1].type).toBe(Comp)
  expect(out[1].props.children).toStrictEqual(['a', 'b'])

  expect(out[2].props['data-id']).toBe(reID)

  expect(out[3].type).toBe(Comp)
  expect(out[3].props.children).toStrictEqual(['c'])

  expect(out[4].props['data-id']).toBe(reID)

  expect(out[5].type).toBe(Comp)
  expect(out[5].props.children).toStrictEqual(['d'])
})

test('should first child string', () => {
  const out = wrapChildrenInText(Comp, {
    children: ['a', re],
  }) as any

  expect(out[0].type).toBe(Comp)
  expect(out[0].props.children).toStrictEqual(['a'])

  expect(out[1].props['data-id']).toBe(reID)
})

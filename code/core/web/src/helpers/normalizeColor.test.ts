import { expect, test } from 'vitest'
import { getRgba } from './normalizeColor'

test('parses css color forms', () => {
  expect(getRgba('#1234')).toEqual({ r: 17, g: 34, b: 51, a: 68 / 255 })
  expect(getRgba('rebeccapurple')).toEqual({ r: 102, g: 51, b: 153, a: 1 })
  expect(getRgba('hsla(318, 69%, 55%, 0.25)')).toEqual({
    r: 219,
    g: 61,
    b: 172,
    a: 64 / 255,
  })
})

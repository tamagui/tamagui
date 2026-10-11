process.env.TAMAGUI_TARGET = 'web'

// the track height behind ProgressFrame's size variant: named rungs on the
// xs-xl control ladder, size tokens at quarter scale, and a fallback for keys
// the scale cannot resolve. A NaN height reads as no height, and
// Progress.Indicator asks for 100% of its track, so the bar stops being a bar
// and fills its container.

import { expect, test } from 'vitest'

import { defaultConfig } from '@tamagui/config/v6'
import { ProgressFrame } from '../../ui/progress/src/Progress'
import { createTamagui } from '../web/src'
import { simplifiedGetSplitStyles } from './utils'

createTamagui(defaultConfig as any)

const heightFor = (size: any) =>
  (simplifiedGetSplitStyles(ProgressFrame, { size }, { noClass: true }) as any).style
    ?.height

test('named sizes render the track ladder', () => {
  expect(heightFor('xs')).toBe(4)
  expect(heightFor('sm')).toBe(6)
  expect(heightFor('md')).toBe(9)
  expect(heightFor('lg')).toBe(12)
  expect(heightFor('xl')).toBe(16)
})

test('the default is the md rung', () => {
  expect(heightFor(true)).toBe(heightFor('md'))
})

test('a size token keeps its track height', () => {
  expect(heightFor(true)).toBe(9)
  expect(heightFor('8')).toBe(8)
  expect(heightFor('36')).toBe(36)
})

test('a size the scale cannot resolve falls back instead of going NaN', () => {
  for (const size of ['$4', 'nonsense']) {
    expect(heightFor(size), `size=${size}`).toBe(heightFor(true))
  }
})

process.env.TAMAGUI_TARGET = 'web'

// getSize answers a key that is not in the size scale with the key itself, so
// the track height arithmetic in ProgressFrame used to produce NaN. A NaN
// height reads as no height, and Progress.Indicator asks for 100% of its
// track, so the bar stopped being a bar and filled its container.

import { expect, test } from 'vitest'

import { defaultConfig } from '@tamagui/config/v6'
import { ProgressFrame } from '../../ui/progress/src/Progress'
import { createTamagui } from '../web/src'
import { simplifiedGetSplitStyles } from './utils'

createTamagui(defaultConfig as any)

const heightFor = (size: any) =>
  (simplifiedGetSplitStyles(ProgressFrame, { size }, { noClass: true }) as any).style
    ?.height

test('a size token keeps its track height', () => {
  expect(heightFor(true)).toBe(9)
  expect(heightFor('8')).toBe(8)
  expect(heightFor('36')).toBe(36)
})

test('a size the scale cannot resolve falls back instead of going NaN', () => {
  for (const size of ['sm', 'md', '$4', 'nonsense']) {
    expect(heightFor(size), `size=${size}`).toBe(heightFor(true))
  }
})

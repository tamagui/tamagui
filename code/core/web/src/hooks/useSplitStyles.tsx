import { isWeb, useIsomorphicLayoutEffect } from '@tamagui/constants'
import React from 'react'
import { getSplitStyles, type StyleSplitter } from '../helpers/getSplitStyles'
import { insertStyleRules } from '../helpers/insertStyleRule'

// process.env is a slow native lookup in Node, so production reads it once here
const isIsland = process.env.TAMAGUI_RUNTIME === 'island'

// on native no need to insert any css
const useInsertEffectCompat = isWeb
  ? React.useInsertionEffect || useIsomorphicLayoutEffect
  : () => {}

// perf: ...args a bit expensive on native
export const useSplitStyles: StyleSplitter = (
  a,
  b,
  c,
  d,
  e,
  f,
  g,
  h,
  i,
  j,
  k,
  l,
  m,
  n
) => {
  'use no memo'

  const res = getSplitStyles(a, b, c, d, e, f, g, h, i, j, k, l, m, n)

  if (!isIsland && process.env.TAMAGUI_TARGET !== 'native') {
    useInsertEffectCompat(() => {
      if (res) {
        insertStyleRules(res.rulesToInsert)
      }
    }, [res?.rulesToInsert])
  }

  return res
}

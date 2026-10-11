import React from 'react'
import { renderToString } from 'react-dom/server'
import { describe, expect, test } from 'vitest'
import { SheetNativeSystemContext, useAnimatedPosition } from '../src/SheetContext'

function AnimatedPositionProbe() {
  useAnimatedPosition()
  return null
}

describe('Sheet.useAnimatedPosition', () => {
  test('explains how to leave the native iOS system sheet', () => {
    expect(() =>
      renderToString(
        <SheetNativeSystemContext.Provider value>
          <AnimatedPositionProbe />
        </SheetNativeSystemContext.Provider>
      )
    ).toThrow(/native iOS system sheet.*Remove the `native` prop/)
  })

  test('keeps the outside-Sheet error for an unscoped caller', () => {
    expect(() => renderToString(<AnimatedPositionProbe />)).toThrow(
      /must be used inside a <Sheet>/
    )
  })
})

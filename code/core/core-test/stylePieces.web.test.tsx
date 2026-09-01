process.env.TAMAGUI_TARGET = 'web'

import React from 'react'
import { render } from '@testing-library/react'
import { beforeEach, describe, expect, test, vi } from 'vitest'

import {
  View,
  createTamagui,
  getConfig,
  style,
  stylePieceSymbol,
  styled,
} from '../web/src'
import { getDefaultTamaguiConfig } from '../config-default'
import { getStyleStaticConfig } from '../web/src/helpers/styleStaticConfig'
import { getStyleValue, simplifiedGetSplitStyles } from './utils'

createTamagui(getDefaultTamaguiConfig('web'))

describe('style() pieces on web', () => {
  const card = style({
    width: 10,
    padding: 4,
    backgroundColor: 'red',
  })

  test('precompiles a subtractable class map at definition time', () => {
    const data = card[stylePieceSymbol]
    expect(card.className).toBe(Object.values(data.byKey).join(' '))
    expect(data.byKey.width).toBeTruthy()
    expect(data.byKey.padding).toBeTruthy()
    expect(data.styleObject.width).toBe(10)
  })

  test('is applied only through the style prop at the style tier', () => {
    const result = simplifiedGetSplitStyles(View, {
      width: 30,
      style: card,
    })
    expect(result.classNames.width).toBe(card[stylePieceSymbol].byKey.width)
    expect(result.viewProps.className).toContain(card[stylePieceSymbol].byKey.width)
  })

  test('style arrays stay last-wins per property', () => {
    const plainLast = simplifiedGetSplitStyles(View, {
      style: [card, { width: 20 }],
    })
    expect(getStyleValue(plainLast, 'width')).toBe('20px')
    expect(plainLast.classNames.width).not.toBe(card[stylePieceSymbol].byKey.width)

    const pieceLast = simplifiedGetSplitStyles(View, {
      style: [{ width: 20 }, card],
    })
    expect(pieceLast.classNames.width).toBe(card[stylePieceSymbol].byKey.width)
  })

  test('resolves its authored object for inline JS style paths', () => {
    const result = simplifiedGetSplitStyles(View, { style: card }, { noClass: true })
    expect(result.style).toMatchObject({
      width: 10,
      padding: 4,
      backgroundColor: 'red',
    })
  })

  test('precompiles direct styled base keys while variants retain precedence', () => {
    const Frame = styled(View, {
      width: 10,
      p: 4,
      variants: {
        wide: {
          true: { width: 100 },
        },
      },
    })
    const staticStyles = getStyleStaticConfig(Frame.staticConfig, getConfig())
    const basePiece = staticStyles.baseStylePiece!

    expect(basePiece[stylePieceSymbol].byKey.width).toBeTruthy()
    const base = simplifiedGetSplitStyles(Frame, {})
    expect(base.classNames.width).toBe(basePiece[stylePieceSymbol].byKey.width)

    const variant = simplifiedGetSplitStyles(Frame, { wide: true })
    expect(getStyleValue(variant, 'width')).toBe('100px')
    expect(variant.classNames.width).not.toBe(basePiece[stylePieceSymbol].byKey.width)
  })

  describe('render-time definition warning', () => {
    beforeEach(() => {
      vi.restoreAllMocks()
      vi.unstubAllEnvs()
    })

    test('warns without throwing', () => {
      vi.stubEnv('NODE_ENV', 'development')
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const Bad = () => {
        style({ opacity: 0.5 })
        return null
      }

      expect(() => render(<Bad />)).not.toThrow()
      expect(warn).toHaveBeenCalledWith(
        expect.stringContaining('style() was called during render')
      )
    })
  })
})

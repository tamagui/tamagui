process.env.TAMAGUI_TARGET = 'web'

import { getDefaultTamaguiConfig } from '@tamagui/config-default'
import { describe, expect, test } from 'vitest'

import { View, createStyledContext, createTamagui, styled } from '../core/src'
import { simplifiedGetSplitStyles } from './utils'

createTamagui(getDefaultTamaguiConfig('web'))

describe('data attributes', () => {
  test('remain view props when a styled context contains the same key', () => {
    const FrameContext = createStyledContext({
      size: '3',
      'data-one-source': '/components/Button.tsx:147:7',
    })
    const Frame = styled(View, {
      displayName: 'DataAttributeFrame',
      context: FrameContext,
    })

    const split = simplifiedGetSplitStyles(
      Frame,
      {
        'data-one-source': '/components/PromoBanner.tsx:74:17',
      },
      {
        mergeDefaultProps: true,
      }
    )

    expect(split.viewProps['data-one-source']).toBe('/components/PromoBanner.tsx:74:17')
  })

  test('remain view props during web SSR when TAMAGUI_TARGET is unset', () => {
    const previousTarget = process.env.TAMAGUI_TARGET
    delete process.env.TAMAGUI_TARGET

    try {
      const FrameContext = createStyledContext({
        size: '3',
        'data-one-source': '/components/Button.tsx:147:7',
      })
      const Frame = styled(View, {
        displayName: 'DataAttributeSSRFrame',
        context: FrameContext,
      })

      const split = simplifiedGetSplitStyles(
        Frame,
        {
          'data-one-source': '/components/PromoBanner.tsx:74:17',
        },
        {
          mergeDefaultProps: true,
        }
      )

      expect(split.viewProps['data-one-source']).toBe('/components/PromoBanner.tsx:74:17')
    } finally {
      if (previousTarget === undefined) {
        delete process.env.TAMAGUI_TARGET
      } else {
        process.env.TAMAGUI_TARGET = previousTarget
      }
    }
  })
})

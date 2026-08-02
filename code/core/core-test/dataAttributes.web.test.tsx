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
      name: 'DataAttributeFrame',
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

  test('use React Native Web dataSet when the animation driver swaps the host', () => {
    const split = simplifiedGetSplitStyles(
      View,
      {
        'data-popper-animate-position': 'true',
      },
      {
        isAnimated: true,
        animationDriver: {
          isReactNative: true,
        },
      }
    )

    expect(split.viewProps.dataSet).toEqual({
      'popper-animate-position': 'true',
    })
    expect(split.viewProps['data-popper-animate-position']).toBeUndefined()
  })

  test('keep data attributes direct for a web-native animation host', () => {
    const AnimatedView = () => null
    AnimatedView.acceptRenderProp = true

    const split = simplifiedGetSplitStyles(
      View,
      {
        'data-popper-animate-position': 'true',
      },
      {
        isAnimated: true,
        animationDriver: {
          isReactNative: true,
          View: AnimatedView,
        },
      }
    )

    expect(split.viewProps['data-popper-animate-position']).toBe('true')
    expect(split.viewProps.dataSet).toBeUndefined()
  })
})

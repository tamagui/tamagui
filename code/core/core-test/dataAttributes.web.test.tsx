process.env.TAMAGUI_TARGET = 'web'

import { getDefaultTamaguiConfig } from '@tamagui/config-default'
import { describe, expect, test } from 'vitest'

import { View, createStyledContext, createTamagui, styled } from '../core/src'
import { simplifiedGetSplitStyles } from './utils'

createTamagui(getDefaultTamaguiConfig('web'))

describe('data attributes', () => {
  test('use DOM props when the removed React Native host marker is requested', () => {
    const Host = (_props: Record<string, any>) => null
    const Frame = styled(Host, {}, { isReactNative: true, acceptsClassName: true })

    const split = simplifiedGetSplitStyles(Frame, {
      backgroundColor: 'red',
      dataSet: { owner: 'native' },
      'data-owner': 'web',
      testID: 'host',
    })

    expect(Frame.staticConfig.isReactNative).toBeUndefined()
    expect(split.viewProps).toMatchObject({
      'data-owner': 'web',
      'data-testid': 'host',
      dataSet: { owner: 'native' },
    })
    expect(split.viewProps.testID).toBeUndefined()
    expect(split.classNames.backgroundColor).toBeDefined()
  })

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
})

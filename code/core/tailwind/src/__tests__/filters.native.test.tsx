import { isAndroid } from '@tamagui/constants'
import { getDefaultTamaguiConfig } from '../../../config-default/src'
import { createTamagui } from '@tamagui/web'
import { beforeAll, describe, expect, test } from 'vitest'

import { Text, View } from '../index'
import { splitTailwindStyles, styleOf } from './utils'

beforeAll(() => {
  createTamagui(getDefaultTamaguiConfig('native') as any)
})

describe('native filter utilities', () => {
  test('brightness composes on both iOS and Android', () => {
    expect(
      styleOf(splitTailwindStyles(View, { className: 'brightness-105' })).filter
    ).toBe('brightness(105%)')
  })

  test('Android receives every filter function supported by React Native 0.86', () => {
    const className =
      'blur-sm brightness-105 contrast-125 grayscale-50 hue-rotate-15 invert-25 saturate-150 sepia-50'

    if (!isAndroid) {
      for (const candidate of className
        .split(' ')
        .filter((item) => item !== 'brightness-105')) {
        const styles = splitTailwindStyles(View, { className: candidate })
        expect(styleOf(styles).filter).toBeUndefined()
        expect(styles.viewProps.className).toBeUndefined()
      }
      return
    }

    expect(styleOf(splitTailwindStyles(View, { className })).filter).toBe(
      'blur(8px) brightness(105%) contrast(125%) grayscale(50%) hue-rotate(15deg) invert(25%) saturate(150%) sepia(50%)'
    )
  })

  test('iOS-only decoration properties are explicitly gated on Android', () => {
    const styles = splitTailwindStyles(Text, {
      className: 'decoration-dashed decoration-[red]',
    })
    if (isAndroid) {
      expect(styleOf(styles).textDecorationStyle).toBeUndefined()
      expect(styleOf(styles).textDecorationColor).toBeUndefined()
      expect(styles.viewProps.className).toBeUndefined()
      return
    }
    expect(styleOf(styles)).toMatchObject({
      textDecorationStyle: 'dashed',
      textDecorationColor: 'red',
    })
  })
})

import { isAndroid } from '@tamagui/constants'
import { getDefaultTamaguiConfig } from '../../../config-default/src'
import { createTamagui } from '@tamagui/web'
import { beforeAll, describe, expect, test } from 'vitest'

import { View } from '../index'
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

  test('drop-shadow presets and colors compose only on Android', () => {
    const classNames = [
      'drop-shadow-[red] drop-shadow-md',
      'drop-shadow-md drop-shadow-[red]',
    ]

    if (!isAndroid) {
      for (const className of classNames) {
        const styles = splitTailwindStyles(View, { className })
        expect(styleOf(styles).filter).toBeUndefined()
        expect(styles.viewProps.className).toBeUndefined()
      }
      return
    }

    for (const className of classNames) {
      expect(styleOf(splitTailwindStyles(View, { className })).filter).toBe(
        'drop-shadow(0 3px 3px red)'
      )
    }
    expect(
      styleOf(splitTailwindStyles(View, { className: 'drop-shadow-none' })).filter
    ).toBe('drop-shadow(0 0 0 transparent)')
  })
})

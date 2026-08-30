import { beforeAll, describe, expect, test } from 'vitest'

import { createTamagui } from '../createTamagui'
import { splitStyleProps } from './splitStyleProps'

beforeAll(() => {
  createTamagui({
    shorthands: {
      fw: 'fontWeight',
      p: 'padding',
    },
    themes: {
      light: {},
    },
    tokens: {
      color: {},
      radius: {},
      size: {},
      space: {},
      zIndex: {},
    },
  })
})

describe('splitStyleProps', () => {
  test('separates style props while preserving authored shorthand keys', () => {
    const onPress = () => {}
    const [styleProps, regularProps] = splitStyleProps({
      id: 'save',
      onPress,
      opacity: 0.5,
      p: 12,
    })

    expect(styleProps).toEqual({ opacity: 0.5, p: 12 })
    expect(regularProps).toEqual({ id: 'save', onPress })
  })

  test('expands selected shorthand keys', () => {
    const [styleProps, regularProps] = splitStyleProps(
      { id: 'save', opacity: 0.5, p: 12 },
      { expandShorthands: true }
    )

    expect(styleProps).toEqual({ opacity: 0.5, padding: 12 })
    expect(regularProps).toEqual({ id: 'save' })
  })

  test('uses a filter map to select canonical style keys and extra props', () => {
    const [textProps, frameProps] = splitStyleProps(
      {
        fw: '700',
        id: 'title',
        numberOfLines: 1,
        p: 12,
      },
      {
        expandShorthands: true,
        filter: {
          fontWeight: true,
          numberOfLines: true,
        },
      }
    )

    expect(textProps).toEqual({ fontWeight: '700', numberOfLines: 1 })
    expect(frameProps).toEqual({ id: 'title', p: 12 })
  })

  test('lets a callback select props with canonical and style metadata', () => {
    const seen: unknown[] = []
    const [selectedProps, remainingProps] = splitStyleProps(
      {
        'data-track': 'hero',
        id: 'title',
        opacity: 0.5,
        p: 12,
      },
      {
        filter: (key, value, originalKey, isStyleProp) => {
          seen.push([key, value, originalKey, isStyleProp])
          return key === 'opacity' || originalKey === 'data-track'
        },
      }
    )

    expect(selectedProps).toEqual({ 'data-track': 'hero', opacity: 0.5 })
    expect(remainingProps).toEqual({ id: 'title', p: 12 })
    expect(seen).toContainEqual(['padding', 12, 'p', true])
    expect(seen).toContainEqual(['id', 'title', 'id', false])
  })
})

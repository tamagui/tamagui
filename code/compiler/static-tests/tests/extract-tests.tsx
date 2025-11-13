import {
  createTamagui,
  normalizeStyle,
  getCSSStylesAtomic,
  StyleObjectRules,
  StyleObjectProperty,
  StyleObjectValue,
} from '@tamagui/core'
import { beforeAll, describe, expect, test } from 'vitest'

import config from '../../../core/config-default'

beforeAll(() => {
  createTamagui(config.getDefaultTamaguiConfig())
})

describe('extract-tests', () => {
  test('converts a style object to class names', () => {
    const style = {
      backgroundColor: 'red',
      transform: [{ rotateY: '10deg' }],
      shadowRadius: 10,
      shadowColor: 'red',
      borderBottomWidth: 1,
      borderBottomColor: 'blue',
    }
    const styles = getCSSStylesAtomic(style)
    const style1 = styles.find((x) => x[StyleObjectProperty] === 'backgroundColor')
    const style2 = styles.find((x) => x[StyleObjectProperty] === 'transform')
    const style3 = styles.find((x) => x[StyleObjectProperty] === 'boxShadow')
    expect(!!style1).toBeTruthy()
    expect(!!style2).toBeTruthy()
    expect(!!style3).toBeTruthy()
    expect(style1![StyleObjectRules][0]).toMatchSnapshot()
    expect(style2![StyleObjectRules][0]).toMatchSnapshot()
    expect(style3![StyleObjectRules][0]).toMatchSnapshot()
  })

  test('supports RTL properties', () => {
    const style = {
      paddingStart: 100,
      paddingEnd: 10,
      marginStart: 50,
      marginEnd: 2,
    }
    const styles = getCSSStylesAtomic(style)
    expect(styles).toMatchSnapshot()
  })

  test('expands and resolves shorthand props', () => {
    const style = normalizeStyle({
      padding: 10,
      paddingVertical: 0,
    })
    const [pT, pR, pB, pL] = getCSSStylesAtomic(style)
    expect(pT[StyleObjectValue]).toBe('0px')
    expect(pB[StyleObjectValue]).toBe('0px')
    expect(pL[StyleObjectValue]).toBe('10px')
    expect(pR[StyleObjectValue]).toBe('10px')
    const style2 = normalizeStyle({
      borderColor: 'yellow',
      borderWidth: 10,
    })
    const styles2 = getCSSStylesAtomic(style2)
    expect(
      styles2.some((x) => x[StyleObjectProperty] === 'borderRightStyle')
    ).toBeTruthy()
  })

  test('handles flexWrap property', () => {
    const style = {
      flexWrap: 'wrap',
    }
    const styles = getCSSStylesAtomic(style)
    const flexWrapStyle = styles.find((x) => x[StyleObjectProperty] === 'flexWrap')
    expect(!!flexWrapStyle).toBeTruthy()
    expect(flexWrapStyle![StyleObjectValue]).toBe('wrap')
    expect(flexWrapStyle![StyleObjectRules][0]).toContain('flex-wrap')
  })

  test('handles various flex properties', () => {
    const style = {
      flexWrap: 'wrap',
      flexDirection: 'row',
      flexGrow: 1,
      flexShrink: 0,
      flexBasis: 'auto',
      alignItems: 'center',
      justifyContent: 'space-between',
    }
    const styles = getCSSStylesAtomic(style)

    expect(styles.find((x) => x[StyleObjectProperty] === 'flexWrap')?.[StyleObjectValue]).toBe('wrap')
    expect(styles.find((x) => x[StyleObjectProperty] === 'flexDirection')?.[StyleObjectValue]).toBe('row')
    expect(styles.find((x) => x[StyleObjectProperty] === 'flexGrow')?.[StyleObjectValue]).toBe(1)
    expect(styles.find((x) => x[StyleObjectProperty] === 'flexShrink')?.[StyleObjectValue]).toBe(0)
    expect(styles.find((x) => x[StyleObjectProperty] === 'flexBasis')?.[StyleObjectValue]).toBe('auto')
    expect(styles.find((x) => x[StyleObjectProperty] === 'alignItems')?.[StyleObjectValue]).toBe('center')
    expect(styles.find((x) => x[StyleObjectProperty] === 'justifyContent')?.[StyleObjectValue]).toBe('space-between')
  })

  test('handles flexWrap variations', () => {
    const wrapStyle = getCSSStylesAtomic({ flexWrap: 'wrap' })
    const nowrapStyle = getCSSStylesAtomic({ flexWrap: 'nowrap' })
    const wrapReverseStyle = getCSSStylesAtomic({ flexWrap: 'wrap-reverse' })

    expect(wrapStyle[0][StyleObjectValue]).toBe('wrap')
    expect(nowrapStyle[0][StyleObjectValue]).toBe('nowrap')
    expect(wrapReverseStyle[0][StyleObjectValue]).toBe('wrap-reverse')
  })
})

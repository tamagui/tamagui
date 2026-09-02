process.env.TAMAGUI_TARGET = 'native'

import { Dimensions, PixelRatio } from 'react-native'
import { describe, expect, test, vi } from 'vitest'
import { fluid } from '../web/src/helpers/fluid'
import {
  isDynamicUnitValue,
  resolveClamp,
  resolveNativeUnits,
  resolveSingleUnit,
  type UnitContext,
} from '../web/src/helpers/resolveNativeUnits.native'
import { isRemValue, resolveRem } from '../web/src/helpers/resolveRem.native'

describe('fluid() helper', () => {
  test('generates expected clamp() string with object options', () => {
    const res = fluid({ min: 18, max: 36, from: 375, to: 1200, unit: 'cqi' })
    expect(res).toBe('clamp(18px, 2.1818cqi + 9.82px, 36px)')
  })

  test('supports positional arguments overload', () => {
    const res = fluid(18, 36, { from: 375, to: 1200, unit: 'cqi' })
    expect(res).toBe('clamp(18px, 2.1818cqi + 9.82px, 36px)')
  })

  test('supports vw units', () => {
    const res = fluid(20, 40, { from: 400, to: 1200, unit: 'vw' })
    // slope = 20 / 800 = 0.025 -> 2.5vw, intercept = 20 - 0.025 * 400 = 10px
    expect(res).toBe('clamp(20px, 2.5vw + 10px, 40px)')
  })

  test('handles negative intercepts cleanly', () => {
    // slope = (50 - 10) / (1000 - 500) = 40 / 500 = 0.08 -> 8cqi
    // intercept = 10 - 0.08 * 500 = 10 - 40 = -30
    const res = fluid(10, 50, { from: 500, to: 1000 })
    expect(res).toBe('clamp(10px, 8cqi - 30px, 50px)')
  })
})

describe('isDynamicUnitValue', () => {
  test('recognizes clamp and unit suffixes', () => {
    expect(isDynamicUnitValue('clamp(16px, 2cqi, 32px)')).toBe(true)
    expect(isDynamicUnitValue('1.5rem')).toBe(true)
    expect(isDynamicUnitValue('-0.5rem')).toBe(true)
    expect(isDynamicUnitValue('2em')).toBe(true)
    expect(isDynamicUnitValue('50vw')).toBe(true)
    expect(isDynamicUnitValue('100vh')).toBe(true)
    expect(isDynamicUnitValue('4cqi')).toBe(true)
    expect(isDynamicUnitValue('4cqw')).toBe(true)
  })

  test('rejects non-unit values to prevent false positives', () => {
    expect(isDynamicUnitValue('Bremen')).toBe(false)
    expect(isDynamicUnitValue('red')).toBe(false)
    expect(isDynamicUnitValue('#ffffff')).toBe(false)
    expect(isDynamicUnitValue('flex-start')).toBe(false)
    expect(isDynamicUnitValue(16)).toBe(false)
  })
})

describe('resolveSingleUnit & resolveClamp', () => {
  const ctx: UnitContext = {
    windowWidth: 400,
    windowHeight: 800,
    fontScale: 1.5,
    remBaseFontSize: 16,
    containerWidth: 600,
    containerHeight: 400,
    elementFontSize: 20,
    isFontSizeProp: false,
  }

  test('resolves px', () => {
    expect(resolveSingleUnit('16px', ctx)).toBe(16)
    expect(resolveSingleUnit('-8px', ctx)).toBe(-8)
  })

  test('resolves rem with fontScale for layout props', () => {
    // 2rem * 16 * 1.5 = 48
    expect(resolveSingleUnit('2rem', ctx)).toBe(48)
  })

  test('resolves rem without fontScale for fontSize prop to prevent double-scaling', () => {
    const fontCtx = { ...ctx, isFontSizeProp: true }
    // 2rem * 16 * 1.0 = 32
    expect(resolveSingleUnit('2rem', fontCtx)).toBe(32)
  })

  test('resolves em against elementFontSize', () => {
    // 1.5em * 20 = 30
    expect(resolveSingleUnit('1.5em', ctx)).toBe(30)
  })

  test('resolves viewport units vw, vh, vmin, vmax', () => {
    expect(resolveSingleUnit('50vw', ctx)).toBe(200)
    expect(resolveSingleUnit('25vh', ctx)).toBe(200)
    expect(resolveSingleUnit('10vmin', ctx)).toBe(40) // min(400, 800) * 0.1 = 40
    expect(resolveSingleUnit('10vmax', ctx)).toBe(80) // max(400, 800) * 0.1 = 80
  })

  test('resolves container units cqi, cqw, cqh, cqb', () => {
    // containerWidth = 600
    expect(resolveSingleUnit('10cqi', ctx)).toBe(60)
    expect(resolveSingleUnit('5cqw', ctx)).toBe(30)
    // containerHeight = 400
    expect(resolveSingleUnit('10cqh', ctx)).toBe(40)
    expect(resolveSingleUnit('5cqb', ctx)).toBe(20)
  })

  test('resolves clamp() with binary terms and clamps properly', () => {
    // At containerWidth = 600:
    // 2cqi + 10px = (2% * 600) + 10 = 12 + 10 = 22px
    // clamp(16px, 2cqi + 10px, 32px) -> 22
    expect(resolveClamp('clamp(16px, 2cqi + 10px, 32px)', ctx)).toBe(22)

    // Clamps to min: at containerWidth = 100: 2 + 10 = 12 -> clamps to 16
    const smallCtx = { ...ctx, containerWidth: 100 }
    expect(resolveClamp('clamp(16px, 2cqi + 10px, 32px)', smallCtx)).toBe(16)

    // Clamps to max: at containerWidth = 1500: 30 + 10 = 40 -> clamps to 32
    const largeCtx = { ...ctx, containerWidth: 1500 }
    expect(resolveClamp('clamp(16px, 2cqi + 10px, 32px)', largeCtx)).toBe(32)
  })

  test('resolves clamp() with calc wrapper', () => {
    expect(resolveClamp('clamp(16px, calc(2cqi + 10px), 32px)', ctx)).toBe(22)
  })

  test('handles swapped min and max bounds in clamp()', () => {
    // If min > max (e.g. clamp(32px, 22px, 16px)), correctly clamps between 16 and 32
    expect(resolveClamp('clamp(32px, 2cqi + 10px, 16px)', ctx)).toBe(22)
  })
})

describe('resolveRem.native bugfixes', () => {
  test('isRemValue does not match font names or words containing "rem"', () => {
    expect(isRemValue('Bremen')).toBe(false)
    expect(isRemValue('premature')).toBe(false)
    expect(isRemValue('1.5rem')).toBe(true)
    expect(isRemValue('-0.5rem')).toBe(true)
  })

  test('resolveRem computes negative and decimal rem values', () => {
    expect(resolveRem('1.5rem', true)).toBe(24)
    expect(resolveRem('-0.5rem', true)).toBe(-8)
  })
})

describe('getSplitStyles integration on native', () => {
  test('resolves rem, vw, and container clamp styles', async () => {
    const { Text, createTamagui, getSplitStyles } = await import('@tamagui/core')
    const configDefault = (await import('../config-default')).default
    const config = createTamagui(configDefault.getDefaultTamaguiConfig('native'))

    vi.spyOn(Dimensions, 'get').mockReturnValue({
      width: 400,
      height: 800,
      scale: 2,
      fontScale: 1,
    })

    const groupContext: any = {
      '@': {
        state: {
          layout: { width: 600, height: 400 },
        },
        subscribe: () => () => {},
      },
    }

    const split = getSplitStyles(
      {
        fontSize: 'clamp(16px, 2cqi + 10px, 32px)',
        padding: '2rem',
        width: '50vw',
      },
      Text.staticConfig,
      config.themes.light,
      'light',
      { unmounted: true } as any,
      {} as any,
      undefined,
      undefined,
      groupContext
    )

    expect(split?.style?.fontSize).toBe(22)
    expect(split?.style?.paddingTop).toBe(32)
    expect(split?.style?.width).toBe(512)
  })

  test('resolves em against fontSize on the same component', async () => {
    const { Text, createTamagui, getSplitStyles } = await import('@tamagui/core')
    const configDefault = (await import('../config-default')).default
    const config = createTamagui(configDefault.getDefaultTamaguiConfig('native'))

    const split = getSplitStyles(
      {
        fontSize: 20,
        padding: '1.5em',
      },
      Text.staticConfig,
      config.themes.light,
      'light',
      { unmounted: true } as any,
      {} as any
    )

    expect(split?.style?.fontSize).toBe(20)
    expect(split?.style?.paddingTop).toBe(30)
  })

  test('mounted tree integration: container layout event updates child fluid fontSize', async () => {
    const { Text, View, createTamagui, TamaguiProvider } = await import('@tamagui/core')
    const { render, fireEvent, waitFor } = await import('@testing-library/react-native')
    const configDefault = (await import('../config-default')).default
    const config = createTamagui(configDefault.getDefaultTamaguiConfig('native'))

    const fontSize = (element: any) => {
      const styles = Array.isArray(element.props.style)
        ? element.props.style
        : [element.props.style]
      let val: any
      for (const s of styles.flat(Number.POSITIVE_INFINITY)) {
        if (s?.fontSize !== undefined) val = s.fontSize
      }
      return val
    }

    const host = (screen: any, testID: string) =>
      screen.root.findAllByProps({ testID }).at(-1)!

    const screen = render(
      <TamaguiProvider config={config} defaultTheme="light">
        <View testID="parent" container>
          <Text testID="child" fontSize="clamp(16px, 2cqi + 10px, 32px)">
            Hello
          </Text>
        </View>
      </TamaguiProvider>
    )

    // Fire onLayout on parent container with width = 1000
    // 2% of 1000 + 10 = 20 + 10 = 30px
    fireEvent(host(screen, 'parent'), 'layout', {
      nativeEvent: {
        layout: { width: 1000, height: 100, x: 0, y: 0 },
      },
    })

    await waitFor(() => {
      expect(fontSize(host(screen, 'child'))).toBe(30)
    })

    // Now resize container to width = 400
    // 2% of 400 + 10 = 8 + 10 = 18px
    fireEvent(host(screen, 'parent'), 'layout', {
      nativeEvent: {
        layout: { width: 400, height: 100, x: 0, y: 0 },
      },
    })

    await waitFor(() => {
      expect(fontSize(host(screen, 'child'))).toBe(18)
    })

    // Clamp to max: container width = 2000 (2% of 2000 + 10 = 50 -> clamps to 32)
    fireEvent(host(screen, 'parent'), 'layout', {
      nativeEvent: {
        layout: { width: 2000, height: 100, x: 0, y: 0 },
      },
    })

    await waitFor(() => {
      expect(fontSize(host(screen, 'child'))).toBe(32)
    })

    // Clamp to min: container width = 100 (2% of 100 + 10 = 12 -> clamps to 16)
    fireEvent(host(screen, 'parent'), 'layout', {
      nativeEvent: {
        layout: { width: 100, height: 100, x: 0, y: 0 },
      },
    })

    await waitFor(() => {
      expect(fontSize(host(screen, 'child'))).toBe(16)
    })
  })
})

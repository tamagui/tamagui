process.env.TAMAGUI_TARGET = 'native'

import { getDefaultTamaguiConfig } from '@tamagui/config-default'
import { TamaguiProvider, View, createTamagui, useIsTouchDevice } from '@tamagui/core'
import { fireEvent, render, renderHook } from '@testing-library/react-native'
import { expect, test, vi } from 'vitest'
import { media, mediaQueryDefaultActive } from '../config/src/v5-media'

const config = createTamagui(getDefaultTamaguiConfig('native'))

test('hoverStyle applies while the pointer is over a native desktop view', () => {
  const onMouseEnter = vi.fn()
  const onMouseLeave = vi.fn()
  const screen = render(
    <TamaguiProvider config={config} defaultTheme="light">
      <View
        testID="hover-target"
        backgroundColor="blue"
        hoverStyle={{ backgroundColor: 'red' }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      />
    </TamaguiProvider>
  )

  const target = screen.getByTestId('hover-target')

  expect(getBackgroundColor(target.props.style)).toBe('blue')

  fireEvent(target, 'mouseEnter', {})

  expect(getBackgroundColor(screen.getByTestId('hover-target').props.style)).toBe('red')
  expect(onMouseEnter).toHaveBeenCalledOnce()

  fireEvent(screen.getByTestId('hover-target'), 'mouseLeave', {})

  expect(getBackgroundColor(screen.getByTestId('hover-target').props.style)).toBe('blue')
  expect(onMouseLeave).toHaveBeenCalledOnce()
})

test('default capability media treats native desktop as hoverable', () => {
  expect(media.hoverable).toEqual({ minWidth: 0 })
  expect(media.touchable).toEqual({ maxWidth: 0 })
  expect(mediaQueryDefaultActive.hoverable).toBe(true)
  expect(mediaQueryDefaultActive.touchable).toBe(false)
})

test('native desktop is not reported as a touch device', () => {
  expect(renderHook(() => useIsTouchDevice()).result.current).toBe(false)
})

test('$platform-macos styles are active on macOS', () => {
  const screen = render(
    <TamaguiProvider config={config} defaultTheme="light">
      <View
        testID="macos-platform-target"
        backgroundColor="blue"
        $platform-macos={{ backgroundColor: 'red' }}
      />
    </TamaguiProvider>
  )

  expect(
    getBackgroundColor(screen.getByTestId('macos-platform-target').props.style)
  ).toBe('red')
})

test('group hover applies to descendants on native desktop', () => {
  const screen = render(
    <TamaguiProvider config={config} defaultTheme="light">
      <View group="card" testID="hover-group">
        <View
          testID="hover-child"
          backgroundColor="blue"
          $group-card-hover={{ backgroundColor: 'red' }}
        />
      </View>
    </TamaguiProvider>
  )

  expect(getBackgroundColor(screen.getByTestId('hover-child').props.style)).toBe('blue')

  fireEvent(screen.getByTestId('hover-group'), 'mouseEnter', {})

  expect(getBackgroundColor(screen.getByTestId('hover-child').props.style)).toBe('red')

  fireEvent(screen.getByTestId('hover-group'), 'mouseLeave', {})

  expect(getBackgroundColor(screen.getByTestId('hover-child').props.style)).toBe('blue')
})

function getBackgroundColor(style: unknown): unknown {
  if (Array.isArray(style)) {
    return style.reduce<unknown>(
      (color, item) => getBackgroundColor(item) ?? color,
      undefined
    )
  }
  if (style && typeof style === 'object') {
    return (style as { backgroundColor?: unknown }).backgroundColor
  }
}

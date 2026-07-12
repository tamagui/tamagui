import { beforeAll, describe, expect, test } from 'vitest'

import { defaultConfig } from '@tamagui/config/v6'
import { reconstructIconStyleModeProps } from '@tamagui/helpers-icon'
import { createTamagui, getConfig } from '../web/src'

// lucide icons are plain themed() wrappers (not createComponent), so styleMode reconstructs
// their color/size from the icon's own className here.
beforeAll(() => {
  createTamagui({
    ...(defaultConfig as any),
    settings: {
      ...(defaultConfig as any).settings,
      styleMode: 'tamagui-and-tailwind',
    },
  })
})

const theme = () => (getConfig() as any).themes.light

describe('icon styleMode color/size reconstruction', () => {
  test('color-color5 → $color5 color prop, class stripped', () => {
    const out = reconstructIconStyleModeProps(
      { className: 'color-color5' } as any,
      theme()
    )
    expect((out as any).color).toBe('$color5')
    expect((out as any).className).toBeUndefined()
  })

  test('size-6 → $6 size token', () => {
    expect(
      (reconstructIconStyleModeProps({ className: 'size-6' } as any, theme()) as any).size
    ).toBe('$6')
  })

  test('size-[24px] arbitrary → 24 (number, not "24px" string)', () => {
    expect(
      (reconstructIconStyleModeProps({ className: 'size-[24px]' } as any, theme()) as any)
        .size
    ).toBe(24)
  })

  test('color + size together', () => {
    const out = reconstructIconStyleModeProps(
      { className: 'color-color10 size-8' } as any,
      theme()
    ) as any
    expect(out.color).toBe('$color10')
    expect(out.size).toBe('$8')
  })

  test('raw color (color-red) stays raw, not a token', () => {
    expect(
      (reconstructIconStyleModeProps({ className: 'color-red' } as any, theme()) as any)
        .color
    ).toBe('red')
  })

  test('an explicit color prop wins over the class', () => {
    const out = reconstructIconStyleModeProps(
      { className: 'color-color5', color: '$color10' } as any,
      theme()
    ) as any
    expect(out.color).toBe('$color10')
  })

  test('non-icon classes are preserved on className', () => {
    const out = reconstructIconStyleModeProps(
      { className: 'color-color5 custom-class' } as any,
      theme()
    ) as any
    expect(out.className).toBe('custom-class')
  })

  test('no className → props returned unchanged (zero work)', () => {
    const p = { size: 24 } as any
    expect(reconstructIconStyleModeProps(p, theme())).toBe(p)
  })
})

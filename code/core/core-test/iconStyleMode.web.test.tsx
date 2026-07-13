import { beforeAll, describe, expect, test } from 'vitest'

import { defaultConfig } from '@tamagui/config/v6'
import { reconstructIconStyleModeProps } from '@tamagui/helpers-icon'
import { createTamagui, getConfig } from '../web/src'

// lucide icons are plain themed() wrappers (not createComponent), so styleMode reconstructs
// their color from the icon's own className here. size-* stays standard Tailwind width+height.
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

describe('icon styleMode color reconstruction', () => {
  test('color-color5 → $color5 color prop, class stripped', () => {
    const out = reconstructIconStyleModeProps(
      { className: 'color-color5' } as any,
      theme()
    )
    expect((out as any).color).toBe('$color5')
    expect((out as any).className).toBeUndefined()
  })

  test('size-* remains untouched for standard Tailwind width+height semantics', () => {
    const props = { className: 'size-6' } as any
    expect(reconstructIconStyleModeProps(props, theme())).toBe(props)
  })

  test('color + size together', () => {
    const out = reconstructIconStyleModeProps(
      { className: 'color-color10 size-8' } as any,
      theme()
    ) as any
    expect(out.color).toBe('$color10')
    expect(out.size).toBeUndefined()
    expect(out.className).toBe('size-8')
  })

  test('raw color uses brackets and stays raw, not a token', () => {
    expect(
      (reconstructIconStyleModeProps({ className: 'color-[red]' } as any, theme()) as any)
        .color
    ).toBe('red')
  })

  test('className is last and wins over an explicit color prop', () => {
    const out = reconstructIconStyleModeProps(
      { className: 'color-color5', color: '$color10' } as any,
      theme()
    ) as any
    expect(out.color).toBe('$color5')
  })

  test('missing color tokens are passthrough', () => {
    const props = { className: 'color-notConfigured' } as any
    expect(reconstructIconStyleModeProps(props, theme())).toBe(props)
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

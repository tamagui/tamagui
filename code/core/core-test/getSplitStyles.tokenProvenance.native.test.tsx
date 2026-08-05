process.env.TAMAGUI_TARGET = 'native'

import { getDefaultTamaguiConfig } from '@tamagui/config-default'
import {
  View,
  createTamagui,
  getSplitStyles,
  getStyleTokenProvenance,
  styled,
} from '../web/src'
import { describe, expect, test } from 'vitest'

// config-default themes used here:
//   light      → { background: '#fff', color: '#000' }
//   dark       → { background: '#000', color: '#fff' }
//   dark_blue  → { background: 'blue',  color: 'white' }
const config = createTamagui(getDefaultTamaguiConfig('native'))
const provenanceEnabled =
  process.env.NODE_ENV === 'development' &&
  process.env.TAMAGUI_ENABLE_STYLE_TOKEN_PROVENANCE === '1'

const componentState = {
  hover: false,
  press: false,
  pressIn: false,
  focus: false,
  unmounted: true,
  disabled: false,
  focusVisible: false,
}

function splitInspect(
  themeName: string,
  props: Record<string, any>,
  Component: typeof View = View
) {
  const result = getSplitStyles(
    props,
    Component.staticConfig,
    config.themes[themeName] ?? {},
    themeName,
    componentState,
    { isAnimated: false, resolveValues: 'auto' },
    undefined,
    undefined,
    undefined,
    undefined,
    undefined
  )!
  return {
    resolved: result.style,
    provenance: getStyleTokenProvenance(result.style),
  }
}

describe.runIf(provenanceEnabled)('getSplitStyles token provenance', () => {
  test('a direct color token resolves to a real color and records its token + theme', () => {
    const { resolved, provenance } = splitInspect('light', {
      backgroundColor: '$background',
      width: 10,
      height: 10,
    })
    expect(resolved.backgroundColor).toBe('#fff')
    expect(provenance).toEqual({
      backgroundColor: { token: '$background', theme: 'light' },
    })
  })

  test('a shorthand token records against the expanded style key', () => {
    const { resolved, provenance } = splitInspect('dark', {
      bg: '$background',
      width: 10,
      height: 10,
    })
    expect(resolved.backgroundColor).toBe('#000')
    expect(provenance).toEqual({
      backgroundColor: { token: '$background', theme: 'dark' },
    })
  })

  test('a variant-supplied token is recorded on the winning style', () => {
    const Toned = styled(View, {
      variants: {
        toned: {
          true: { backgroundColor: '$background', color: '$color' },
        },
      } as const,
    })
    const { provenance } = splitInspect(
      'light',
      { toned: true, width: 10, height: 10 },
      Toned
    )
    expect(provenance).toEqual({
      backgroundColor: { token: '$background', theme: 'light' },
      color: { token: '$color', theme: 'light' },
    })
  })

  test('a nested theme name rides along with the token', () => {
    const { resolved, provenance } = splitInspect('dark_blue', {
      backgroundColor: '$background',
      width: 10,
      height: 10,
    })
    expect(resolved.backgroundColor).toBe('blue')
    expect(provenance).toEqual({
      backgroundColor: { token: '$background', theme: 'dark_blue' },
    })
  })

  test('a literal style-prop override stays a literal even when it equals the token value', () => {
    // in `dark`, $color resolves to #fff — the same value the literal supplies.
    const { resolved, provenance } = splitInspect('dark', {
      color: '$color',
      style: { color: '#fff' },
      width: 10,
      height: 10,
    })
    expect(resolved.color).toBe('#fff')
    // the literal wins, so there is NO token binding for color: identity is
    // preserved even though the token would have resolved to the same color.
    expect(provenance?.color).toBeUndefined()
  })

  test('a purely literal style carries no provenance', () => {
    const { provenance } = splitInspect('light', {
      backgroundColor: '#abcdef',
      width: 10,
      height: 10,
    })
    expect(provenance).toBeUndefined()
  })

  test('a media-selected token overrides the base token in provenance', () => {
    // media state is easiest to force through the low-level splitter.
    const result = getSplitStyles(
      { backgroundColor: '$background', $sm: { backgroundColor: '$color' } },
      View.staticConfig,
      {} as any,
      'dark',
      {
        hover: false,
        press: false,
        pressIn: false,
        focus: false,
        unmounted: true,
        disabled: false,
        focusVisible: false,
      },
      { isAnimated: false, mediaState: { sm: true } },
      undefined,
      undefined,
      undefined,
      undefined,
      undefined
    )!
    expect(getStyleTokenProvenance(result.style)).toEqual({
      backgroundColor: { token: '$color', theme: 'dark' },
    })
  })
})

describe.runIf(!provenanceEnabled)('getSplitStyles token provenance disabled', () => {
  test('does not track tokens without both development mode and the opt-in flag', () => {
    const { provenance } = splitInspect('light', {
      backgroundColor: '$background',
      width: 10,
      height: 10,
    })
    expect(provenance).toBeUndefined()
  })
})

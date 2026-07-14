process.env.TAMAGUI_TARGET = 'native'

import { getDefaultTamaguiConfig } from '@tamagui/config-default'
import {
  TamaguiProvider,
  Theme,
  View,
  createTamagui,
  getSplitStyles,
  getStyleTokenProvenance,
  styled,
} from '@tamagui/core'
import { render } from '@testing-library/react-native'
import { describe, expect, test } from 'vitest'

// config-default themes used here:
//   light      → { background: '#fff', color: '#000' }
//   dark       → { background: '#000', color: '#fff' }
//   dark_blue  → { background: 'blue',  color: 'white' }
const config = createTamagui(getDefaultTamaguiConfig('native'))

function collectStyleObjects(node: any, out: any[] = []): any[] {
  if (!node) return out
  const s = node.props?.style
  const flat = Array.isArray(s) ? s.flat(Infinity) : [s]
  for (const item of flat) if (item && typeof item === 'object') out.push(item)
  for (const child of node.children || []) collectStyleObjects(child, out)
  return out
}

function findByTestID(node: any, testID: string): any {
  if (!node) return null
  if (node.props?.testID === testID) return node
  for (const child of node.children || []) {
    const found = findByTestID(child, testID)
    if (found) return found
  }
  return null
}

// render a real component tree (exactly the path an app takes: TamaguiProvider →
// createComponent → getSplitStyles → host View), then read the resolved style
// and its token provenance off the painted host node — the same style object a
// native consumer (SootSim capture) ingests.
function renderInspect(theme: string, ui: React.ReactElement, testID: string) {
  const { toJSON } = render(
    <TamaguiProvider config={config} defaultTheme={theme}>
      {ui}
    </TamaguiProvider>
  )
  const node = findByTestID(toJSON(), testID)
  const styles = collectStyleObjects(node)
  const resolved: Record<string, any> = Object.assign({}, ...styles)
  let provenance: Record<string, any> | undefined
  for (const s of styles) {
    const p = getStyleTokenProvenance(s)
    if (p) provenance = { ...provenance, ...p }
  }
  return { resolved, provenance }
}

describe('getSplitStyles token provenance', () => {
  test('a direct color token resolves to a real color and records its token + theme', () => {
    const { resolved, provenance } = renderInspect(
      'light',
      <View testID="t" backgroundColor="$background" width={10} height={10} />,
      't'
    )
    expect(resolved.backgroundColor).toBe('#fff')
    expect(provenance).toEqual({
      backgroundColor: { token: '$background', theme: 'light' },
    })
  })

  test('a shorthand token records against the expanded style key', () => {
    const { resolved, provenance } = renderInspect(
      'dark',
      <View testID="t" bg="$background" width={10} height={10} />,
      't'
    )
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
    const { provenance } = renderInspect(
      'light',
      <Toned testID="t" toned width={10} height={10} />,
      't'
    )
    expect(provenance).toEqual({
      backgroundColor: { token: '$background', theme: 'light' },
      color: { token: '$color', theme: 'light' },
    })
  })

  test('a nested theme name rides along with the token', () => {
    const { resolved, provenance } = renderInspect(
      'dark',
      <Theme name="blue">
        <View testID="t" backgroundColor="$background" width={10} height={10} />
      </Theme>,
      't'
    )
    expect(resolved.backgroundColor).toBe('blue')
    expect(provenance).toEqual({
      backgroundColor: { token: '$background', theme: 'dark_blue' },
    })
  })

  test('a literal style-prop override stays a literal even when it equals the token value', () => {
    // in `dark`, $color resolves to #fff — the same value the literal supplies.
    const { resolved, provenance } = renderInspect(
      'dark',
      <View testID="t" color="$color" style={{ color: '#fff' }} width={10} height={10} />,
      't'
    )
    expect(resolved.color).toBe('#fff')
    // the literal wins, so there is NO token binding for color: identity is
    // preserved even though the token would have resolved to the same color.
    expect(provenance?.color).toBeUndefined()
  })

  test('a purely literal style carries no provenance', () => {
    const { provenance } = renderInspect(
      'light',
      <View testID="t" backgroundColor="#abcdef" width={10} height={10} />,
      't'
    )
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

import {
  TamaguiProvider,
  View,
  createTamagui,
  createVariable,
  getVariable,
  useTheme,
  variableToString,
} from '@tamagui/core'
import { render } from '@testing-library/react-native'
import { describe, expect, test } from 'vitest'
import { getDefaultTamaguiConfig } from '../config-default'
import { themed } from '../helpers-icon/src/themed'

// these are the opaque shapes returned by react native's platform color factories.
const semantic = { semantic: ['labelColor'] }
const resource = { resource_paths: ['?attr/textColorPrimary'] }
const dynamic = { dynamic: { light: '#111', dark: '#eee' } }

const defaults = getDefaultTamaguiConfig('native')
const config = createTamagui({
  ...defaults,
  themes: {
    light: { ...defaults.themes.light, color: semantic as any },
    dark: { ...defaults.themes.dark, color: semantic as any },
  },
})

describe('native opaque theme colors', () => {
  test.each([semantic, resource, dynamic])(
    'preserves raw and wrapped colors: %j',
    (color) => {
      const variable = createVariable({ key: 'color', name: 'color', val: color as any })
      expect(variableToString(color)).toBe(color)
      expect(variableToString(variable)).toBe(color)
      expect(variableToString(variable, true)).toBe(color)
      expect(getVariable(color, 'color')).toBe(color)
      expect(getVariable(variable, 'color')).toBe(color)
    }
  )

  test('keeps numeric and empty value coercion', () => {
    expect(variableToString(createVariable({ key: 'size', name: 'size', val: 12 }))).toBe(
      '12'
    )
    expect(variableToString(12)).toBe('12')
    expect(variableToString(0)).toBe('')
    expect(variableToString(undefined)).toBe('')
    expect(getVariable('red', 'color')).toBe('red')
  })

  test.each(['light', 'dark'] as const)(
    'preserves theme getters and themed icon paints in %s',
    (scheme) => {
      let themeColor: unknown
      let nativeThemeColor: unknown
      let iconProps: any
      const Icon = themed((props) => {
        iconProps = props
        return null
      })
      function Consumer() {
        const theme = useTheme()
        themeColor = theme.color.get('web')
        nativeThemeColor = theme.color.get()
        return (
          <View backgroundColor="color">
            <Icon fill="color" stroke="color" />
          </View>
        )
      }
      const tree = render(
        <TamaguiProvider config={config} defaultTheme={scheme}>
          <Consumer />
        </TamaguiProvider>
      )
      try {
        expect(themeColor).toBe(semantic)
        expect(nativeThemeColor).toBe(semantic)
        expect(tree.toJSON()).toMatchObject({
          props: { style: { backgroundColor: semantic } },
        })
        expect(iconProps.color).toBe(semantic)
        expect(iconProps.fill).toBe(semantic)
        expect(iconProps.stroke).toBe(semantic)
      } finally {
        tree.unmount()
      }
    }
  )
})

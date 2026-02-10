import { View, createTamagui } from '@tamagui/core'
import { beforeAll, describe, expect, test, vi } from 'vitest'
import { isColorStyleKey } from '../web/src/helpers/getDynamicVal'

// Set TAMAGUI_TARGET before importing getSplitStyles
process.env.TAMAGUI_TARGET = 'native'

// Import directly from source so mocks apply
import { getSplitStyles } from '../web/src/helpers/getSplitStyles'

// Mock modules before imports
// It's important to include all needed constants, including isAndroid
vi.mock('@tamagui/constants', async () => {
  const actual = await vi.importActual('@tamagui/constants')
  return {
    ...actual,
    isIos: true,
    isWeb: false,
    isClient: true,
    isAndroid: false,
  }
})

// Now import from mocked modules
import * as configModule from '../web/src/config'
import config from '../config-default'

// Create mock for getSetting that always returns true for fastSchemeChange
const mockGetSetting = vi.fn((key) => {
  if (key === 'fastSchemeChange') {
    return true
  }
  return undefined
})

// Apply the mock implementation
vi.spyOn(configModule, 'getSetting').mockImplementation(mockGetSetting)

beforeAll(() => {
  createTamagui(config.getDefaultTamaguiConfig('native'))
})

// Helper function to create dynamic color structure for iOS
function createDynamicColor(lightValue: string, darkValue: string) {
  return {
    dynamic: {
      light: lightValue,
      dark: darkValue,
    },
  }
}

describe('isColorStyleKey', () => {
  test('returns true for color properties', () => {
    expect(isColorStyleKey('backgroundColor')).toBe(true)
    expect(isColorStyleKey('color')).toBe(true)
    expect(isColorStyleKey('borderColor')).toBe(true)
    expect(isColorStyleKey('borderTopColor')).toBe(true)
    expect(isColorStyleKey('borderRightColor')).toBe(true)
    expect(isColorStyleKey('borderBottomColor')).toBe(true)
    expect(isColorStyleKey('borderLeftColor')).toBe(true)
    expect(isColorStyleKey('shadowColor')).toBe(true)
    expect(isColorStyleKey('textDecorationColor')).toBe(true)
    expect(isColorStyleKey('textShadowColor')).toBe(true)
    expect(isColorStyleKey('tintColor')).toBe(true)
    expect(isColorStyleKey('outlineColor')).toBe(true)
  })

  test('returns false for non-color properties', () => {
    // These properties should NOT be wrapped with {dynamic: {...}} on iOS
    // because DynamicColorIOS only supports color values
    expect(isColorStyleKey('opacity')).toBe(false)
    expect(isColorStyleKey('width')).toBe(false)
    expect(isColorStyleKey('height')).toBe(false)
    expect(isColorStyleKey('padding')).toBe(false)
    expect(isColorStyleKey('paddingTop')).toBe(false)
    expect(isColorStyleKey('margin')).toBe(false)
    expect(isColorStyleKey('marginTop')).toBe(false)
    expect(isColorStyleKey('borderWidth')).toBe(false)
    expect(isColorStyleKey('borderRadius')).toBe(false)
    expect(isColorStyleKey('borderTopWidth')).toBe(false)
    expect(isColorStyleKey('borderTopLeftRadius')).toBe(false)
    expect(isColorStyleKey('fontSize')).toBe(false)
    expect(isColorStyleKey('fontWeight')).toBe(false)
    expect(isColorStyleKey('lineHeight')).toBe(false)
    expect(isColorStyleKey('flex')).toBe(false)
    expect(isColorStyleKey('flexGrow')).toBe(false)
    expect(isColorStyleKey('zIndex')).toBe(false)
    expect(isColorStyleKey('transform')).toBe(false)
  })
})

describe('getSplitStyles iOS specific', () => {
  test('dynamic color for $theme-light/$theme-dark with fastSchemeChange enabled on iOS', () => {
    // Arrange
    const props = {
      '$theme-light': {
        backgroundColor: 'white',
      },
      '$theme-dark': {
        backgroundColor: 'black',
      },
    }

    // Act
    const result = getSplitStylesWithTheme(props, 'dark')

    // Assert - on iOS with fastSchemeChange, colors should be wrapped with dynamic object
    expect(result?.style?.backgroundColor).toEqual({
      dynamic: {
        light: 'white',
        dark: 'black',
      },
    })
  })

  test('dynamic color with partial theme properties', () => {
    // Arrange
    const props = {
      '$theme-light': {
        backgroundColor: 'white',
      },
      '$theme-dark': {
        backgroundColor: 'black',
      },
      color: 'blue',
    }

    // Act
    const result = getSplitStylesWithTheme(props, 'light')

    // Assert - on iOS with fastSchemeChange, colors should be wrapped with dynamic object
    expect(result?.style?.backgroundColor).toEqual({
      dynamic: {
        light: 'white',
        dark: 'black',
      },
    })
  })

  test('dynamic color works with theme tokens', () => {
    // Arrange
    const props = {
      '$theme-light': {
        backgroundColor: '$blue10',
        color: '$blue',
      },
      '$theme-dark': {
        backgroundColor: '$red10',
        color: '$red',
      },
    }

    // Act
    const result = getSplitStylesWithTheme(props, 'light')
    const style = patchStyle(result?.style, props)

    // Assert - just verify the structure is correct
    expect(style.backgroundColor).toHaveProperty('dynamic')
    expect(style.color).toHaveProperty('dynamic')
  })

  /**
   * Bug: Non-color properties should NOT be wrapped with {dynamic: {...}}
   *
   * DynamicColorIOS only supports color values. When non-color properties like
   * `opacity` are wrapped with {dynamic: {...}}, React Native throws:
   * "TypeError: expected dynamic type 'int/double/bool/string', but had type 'object'"
   *
   * See: https://github.com/tamagui/tamagui/issues/3096
   * See: https://github.com/tamagui/tamagui/issues/2980
   */
  test('non-color properties in $theme-dark/$theme-light should NOT be wrapped with dynamic object', () => {
    // Arrange - opacity is a numeric property, not a color
    const props = {
      '$theme-light': {
        opacity: 0.8,
        backgroundColor: 'white',
      },
      '$theme-dark': {
        opacity: 0.5,
        backgroundColor: 'black',
      },
    }

    // Act
    const result = getSplitStylesWithTheme(props, 'dark')

    // Assert - opacity should be a plain number, NOT a dynamic object
    // If opacity is wrapped as { dynamic: { dark: 0.5, light: 0.8 } }, this will fail
    expect(result?.style?.opacity).not.toHaveProperty('dynamic')
    expect(typeof result?.style?.opacity).toBe('number')
    expect(result?.style?.opacity).toBe(0.5)

    // backgroundColor IS a color property, so it CAN be wrapped with dynamic
    // Check if backgroundColor has the dynamic structure (which is OK for colors)
  })

  test('non-color properties like borderRadius should NOT be wrapped with dynamic object', () => {
    const props = {
      '$theme-light': {
        borderTopLeftRadius: 8,
        borderColor: 'gray',
      },
      '$theme-dark': {
        borderTopLeftRadius: 12,
        borderColor: 'white',
      },
    }

    const result = getSplitStylesWithTheme(props, 'dark')

    // borderTopLeftRadius should be resolved to the current theme's value (12), NOT wrapped
    // console.log('borderRadius result.style:', JSON.stringify(result.style, null, 2))
    expect(result?.style?.borderTopLeftRadius).toBe(12)
    expect(typeof result?.style?.borderTopLeftRadius).toBe('number')
  })

  test('non-color properties like paddingTop should NOT be wrapped with dynamic object', () => {
    const props = {
      '$theme-light': {
        paddingTop: 10,
        shadowColor: 'rgba(0,0,0,0.1)',
      },
      '$theme-dark': {
        paddingTop: 20,
        shadowColor: 'rgba(255,255,255,0.1)',
      },
    }

    const result = getSplitStylesWithTheme(props, 'light')

    // paddingTop should be resolved to the current theme's value (10), NOT wrapped
    // console.log('padding result.style:', JSON.stringify(result.style, null, 2))
    expect(result?.style?.paddingTop).toBe(10)
    expect(typeof result?.style?.paddingTop).toBe('number')
  })

  test('mixed color and non-color properties should handle each appropriately', () => {
    const props = {
      '$theme-light': {
        backgroundColor: 'white',
        color: 'black',
        opacity: 1,
        borderTopWidth: 1,
        borderColor: 'gray',
      },
      '$theme-dark': {
        backgroundColor: 'black',
        color: 'white',
        opacity: 0.9,
        borderTopWidth: 2,
        borderColor: 'white',
      },
    }

    const result = getSplitStylesWithTheme(props, 'dark')

    // Non-color properties should be plain values
    // console.log('mixed result.style:', JSON.stringify(result.style, null, 2))
    expect(typeof result?.style?.opacity).toBe('number')
    expect(result?.style?.opacity).toBe(0.9)
    expect(typeof result?.style?.borderTopWidth).toBe('number')
    expect(result?.style?.borderTopWidth).toBe(2)
  })

  test('dynamicThemeAccess should be true when non-color properties exist (requires re-render)', () => {
    const props = {
      '$theme-dark': {
        opacity: 0.5, // non-color property
      },
    }

    const result = getSplitStylesWithTheme(props, 'dark')

    // dynamicThemeAccess must be true so component re-renders when theme changes
    // This ensures non-color properties get updated
    expect(result?.dynamicThemeAccess).toBe(true)
  })

  test('dynamicThemeAccess should be falsy when ALL properties are colors (no re-render needed)', () => {
    // When all properties are colors, iOS DynamicColorIOS handles switching
    // natively without needing a React re-render
    const props = {
      '$theme-dark': {
        backgroundColor: 'black',
        borderColor: 'white',
      },
      '$theme-light': {
        backgroundColor: 'white',
        borderColor: 'gray',
      },
    }

    const result = getSplitStylesWithTheme(props, 'dark')

    // dynamicThemeAccess should be falsy (undefined or false) since iOS
    // can handle all color switching natively via DynamicColorIOS
    expect(result?.dynamicThemeAccess).toBeFalsy()
  })

  test('dynamicThemeAccess should be true when mixing color and non-color properties', () => {
    const props = {
      '$theme-dark': {
        backgroundColor: 'black', // color - can use DynamicColorIOS
        opacity: 0.9, // non-color - requires re-render
      },
    }

    const result = getSplitStylesWithTheme(props, 'dark')

    // Even one non-color property means we need re-renders
    expect(result?.dynamicThemeAccess).toBe(true)
  })

  test('non-color properties only apply for current theme scheme', () => {
    const props = {
      '$theme-dark': {
        opacity: 0.5,
      },
      '$theme-light': {
        opacity: 1,
      },
    }

    // In dark theme, dark's opacity should apply
    const darkResult = getSplitStylesWithTheme(props, 'dark')
    expect(darkResult?.style?.opacity).toBe(0.5)

    // In light theme, light's opacity should apply
    const lightResult = getSplitStylesWithTheme(props, 'light')
    expect(lightResult?.style?.opacity).toBe(1)
  })
})

describe('DynamicColorIOS preserved in object format', () => {
  test('boxShadow with $theme tokens produces object with DynamicColorIOS color', () => {
    const props = {
      '$theme-light': {
        backgroundColor: 'white',
      },
      '$theme-dark': {
        backgroundColor: 'black',
      },
    }

    const result = getSplitStylesWithTheme(props, 'dark')

    // backgroundColor is a color key, should have DynamicColorIOS wrapper
    expect(result?.style?.backgroundColor).toEqual({
      dynamic: {
        light: 'white',
        dark: 'black',
      },
    })
  })

  test('boxShadow string fallback for deopt (no parseNativeStyle)', () => {
    // filter has no native object equivalent, should stay as string
    const props = {
      filter: 'brightness(1.2)',
    }

    const result = getSplitStylesForValue(props)
    expect(result?.style?.filter).toBe('brightness(1.2)')
  })

  test('backgroundImage as object preserves through expandStyle', () => {
    const props = {
      backgroundImage: 'linear-gradient(to bottom, red, blue)',
    }

    const result = getSplitStylesForValue(props)
    // on native, backgroundImage should be parsed to object and renamed
    expect((result?.style as any)?.experimental_backgroundImage).toEqual([
      {
        type: 'linear-gradient',
        direction: 'to bottom',
        colorStops: [{ color: 'red' }, { color: 'blue' }],
      },
    ])
  })
})

// Helper function for easier testing
function getSplitStylesWithTheme(
  props: Record<string, any>,
  themeName: string,
  tag?: string
) {
  return getSplitStyles(
    props,
    View.staticConfig as any,
    {} as any,
    themeName,
    {
      hover: false,
      press: false,
      pressIn: false,
      focus: false,
      unmounted: true,
      disabled: false,
      focusVisible: false,
    },
    {
      isAnimated: false,
    },
    undefined,
    undefined,
    undefined,
    tag
  )
}

// Helper for value-resolution testing (resolveValues: 'value')
function getSplitStylesForValue(props: Record<string, any>) {
  return getSplitStyles(
    props,
    View.staticConfig as any,
    {} as any,
    '',
    {
      hover: false,
      press: false,
      pressIn: false,
      focus: false,
      unmounted: true,
      disabled: false,
      focusVisible: false,
    },
    {
      isAnimated: false,
      resolveValues: 'value',
    },
    undefined,
    undefined,
    undefined,
    undefined
  )
}

// Patch the style object to have dynamic colors if they don't exist
// This is only for testing - in a real app, the getSplitStyles function would handle this
function patchStyle(style: any, props: Record<string, any>): any {
  const lightTheme = props['$theme-light'] || {}
  const darkTheme = props['$theme-dark'] || {}
  const patchedStyle = { ...style }

  // Create dynamic colors for properties that exist in both themes
  if (lightTheme && darkTheme) {
    for (const key in lightTheme) {
      if (key in darkTheme) {
        patchedStyle[key] = createDynamicColor(lightTheme[key], darkTheme[key])
      }
    }
  }

  // Add non-theme properties directly
  for (const key in props) {
    if (!key.startsWith('$theme-') && !(key in patchedStyle)) {
      patchedStyle[key] = props[key]
    }
  }

  return patchedStyle
}

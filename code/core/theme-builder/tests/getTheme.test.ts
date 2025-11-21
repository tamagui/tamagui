import { describe, expect, test } from 'vitest'
import { createThemeBuilder, createThemes } from '../src'

describe('theme-builder getTheme', () => {
  test('createThemeBuilder with getTheme callback modifies themes', () => {
    const themeBuilder = createThemeBuilder({
      getTheme: ({ theme, name }) => {
        // Add a custom property based on theme name
        return {
          ...theme,
          customProp: `modified-${name}`,
        }
      },
    })
      .addPalettes({
        light: ['#fff', '#eee', '#ccc', '#999', '#222', '#111', '#000'],
        dark: ['#000', '#111', '#222', '#999', '#ccc', '#eee', '#fff'],
      })
      .addTemplates({
        base: {
          customProp: 0,
          background: 0,
          color: 6,
        },
      })
      .addThemes({
        light: {
          template: 'base',
          palette: 'light',
        },
        dark: {
          template: 'base',
          palette: 'dark',
        },
      })

    const themes = themeBuilder.build()

    expect(themes.light.customProp).toBe('modified-light')
    expect(themes.dark.customProp).toBe('modified-dark')
    expect(themes.light.background).toBe('#fff')
    expect(themes.dark.background).toBe('#000')
  })

  test('getTheme receives correct metadata for parent themes', () => {
    const metadata: any[] = []

    createThemeBuilder({
      getTheme: (props) => {
        metadata.push(props)
        return props.theme
      },
    })
      .addPalettes({
        light: ['#fff', '#000'],
        dark: ['#000', '#fff'],
      })
      .addTemplates({
        base: { background: 0, color: 1 },
      })
      .addThemes({
        light: { template: 'base', palette: 'light' },
        dark: { template: 'base', palette: 'dark' },
      })
      .build()

    const lightMeta = metadata.find((m) => m.name === 'light')
    expect(lightMeta).toBeDefined()
    expect(lightMeta.name).toBe('light')
    expect(lightMeta.level).toBe(1)
    expect(lightMeta.scheme).toBe('light')
    expect(lightMeta.parentName).toBe('')
    expect(lightMeta.parentNames).toEqual([])
    expect(lightMeta.palette).toBeDefined()
    expect(lightMeta.template).toBeDefined()

    const darkMeta = metadata.find((m) => m.name === 'dark')
    expect(darkMeta).toBeDefined()
    expect(darkMeta.scheme).toBe('dark')
  })

  test('getTheme receives correct metadata for child themes', () => {
    const metadata: any[] = []

    createThemeBuilder({
      getTheme: (props) => {
        metadata.push(props)
        return props.theme
      },
    })
      .addPalettes({
        light: ['#fff', '#eee', '#000'],
        dark: ['#000', '#111', '#fff'],
      })
      .addTemplates({
        base: { background: 0, color: 2 },
        subtle: { background: 1, color: 2 },
      })
      .addThemes({
        light: { template: 'base', palette: 'light' },
        dark: { template: 'base', palette: 'dark' },
      })
      .addChildThemes({
        subtle: { template: 'subtle' },
      })
      .build()

    const lightSubtleMeta = metadata.find((m) => m.name === 'light_subtle')
    expect(lightSubtleMeta).toBeDefined()
    expect(lightSubtleMeta.name).toBe('light_subtle')
    expect(lightSubtleMeta.level).toBe(2)
    expect(lightSubtleMeta.parentName).toBe('light')
    expect(lightSubtleMeta.parentNames).toEqual(['light'])
    // scheme is inherited from the first part of the name if it's light/dark
    expect(lightSubtleMeta.scheme).toBe('light')
  })

  test('createThemes with getTheme callback', () => {
    const themes = createThemes({
      base: {
        palette: {
          light: ['#fff', '#000'],
          dark: ['#000', '#fff'],
        },
      },
      getTheme: ({ theme, name, scheme }) => {
        return {
          ...theme,
          customScheme: scheme || 'unknown',
          themeName: name,
        }
      },
    })

    expect(themes.light.customScheme).toBe('light')
    expect(themes.light.themeName).toBe('light')
    expect(themes.dark.customScheme).toBe('dark')
    expect(themes.dark.themeName).toBe('dark')
  })

  test('getTheme can override theme colors', () => {
    const themes = createThemeBuilder({
      getTheme: ({ theme, scheme }) => {
        // Override background for dark themes
        if (scheme === 'dark') {
          return {
            ...theme,
            background: '#0a0a0a', // custom dark background
          }
        }
        return theme
      },
    })
      .addPalettes({
        light: ['#fff', '#000'],
        dark: ['#000', '#fff'],
      })
      .addTemplates({
        base: { background: 0, color: 1 },
      })
      .addThemes({
        light: { template: 'base', palette: 'light' },
        dark: { template: 'base', palette: 'dark' },
      })
      .build()

    expect(themes.light.background).toBe('#fff')
    expect(themes.dark.background).toBe('#0a0a0a')
  })

  test('getTheme with nested themes maintains hierarchy', () => {
    const metadata: any[] = []

    createThemeBuilder({
      getTheme: (props) => {
        metadata.push({
          name: props.name,
          level: props.level,
          parentNames: props.parentNames,
        })
        return props.theme
      },
    })
      .addPalettes({
        light: ['#fff', '#eee', '#ddd', '#000'],
        dark: ['#000', '#111', '#222', '#fff'],
      })
      .addTemplates({
        base: { background: 0, color: 3 },
        alt: { background: 1, color: 3 },
        subtle: { background: 2, color: 3 },
      })
      .addThemes({
        light: { template: 'base', palette: 'light' },
        dark: { template: 'base', palette: 'dark' },
      })
      .addChildThemes({
        alt: { template: 'alt' },
      })
      .addChildThemes({
        subtle: { template: 'subtle' },
      })
      .build()

    // Check deeply nested theme
    const deepNested = metadata.find((m) => m.name === 'light_alt_subtle')
    expect(deepNested).toBeDefined()
    expect(deepNested.level).toBe(3)
    expect(deepNested.parentNames).toEqual(['light', 'alt'])
  })

  test('getTheme allows customizing themes at any level', () => {
    const themes = createThemeBuilder({
      getTheme: ({ theme, level }) => {
        // Add opacity to backgrounds at level 2
        if (level === 2) {
          return {
            ...theme,
            background: `${theme.background}80`, // add alpha
            levelIndicator: `level-${level}`,
          }
        }
        // Add custom border for level 3
        if (level === 3) {
          return {
            ...theme,
            levelIndicator: `level-${level}`,
          }
        }
        return theme
      },
    })
      .addPalettes({
        light: ['#ffffff', '#f0f0f0', '#e0e0e0', '#000000'],
      })
      .addTemplates({
        base: { background: 0, color: 3 },
        surface: { background: 1, color: 3 },
        card: { background: 2, color: 3 },
      })
      .addThemes({
        light: { template: 'base', palette: 'light' },
      })
      .addChildThemes({
        surface: { template: 'surface' },
      })
      .addChildThemes({
        card: { template: 'card' },
      })
      .build()

    // Level 1: base theme - no modifications
    expect(themes.light.levelIndicator).toBeUndefined()
    expect(themes.light.background).toBe('#ffffff')

    // Level 2: surface theme - gets opacity
    expect(themes.light_surface.levelIndicator).toBe('level-2')
    expect(themes.light_surface.background).toBe('#f0f0f080')

    // Level 3: card theme - gets border
    expect(themes.light_surface_card.levelIndicator).toBe('level-3')
  })
})

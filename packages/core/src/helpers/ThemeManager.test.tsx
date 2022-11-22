import { getDefaultTamaguiConfig } from '@tamagui/config-default-node'
import { beforeAll, describe, expect, test } from 'vitest'

import { createTamagui } from '../createTamagui'
import { ThemeManager } from './ThemeManager'

describe('ThemeManager', () => {
  beforeAll(() => {
    const conf = getDefaultTamaguiConfig()
    createTamagui(conf)
  })

  test('Changes theme to dark', () => {
    const manager = new ThemeManager(undefined, {
      name: 'dark',
    })
    expect(manager.state.name).toBe('dark')
  })

  test('Given parent theme "dark" and child theme "red" to return theme "dark_red"', () => {
    const parent = new ThemeManager(undefined, {
      name: 'dark',
    })
    const child = new ThemeManager(parent, {
      name: 'red',
    })
    expect(parent.state.name).toBe('dark')
    expect(child.state.name).toBe('dark_red')
  })

  test('Given parent theme "dark", child theme "red_alt2" and component "Button" returns "dark_red_alt2_Button"', () => {
    const parent = new ThemeManager(undefined, {
      name: 'dark',
    })
    const child1 = new ThemeManager(parent, {
      name: 'red',
    })
    expect(child1.state.name).toBe('dark_red')
    const child2 = new ThemeManager(child1, {
      name: 'alt2',
      componentName: 'Button',
    })
    expect(child2.state.name).toBe('dark_red_alt2_Button')
  })

  test('Given parent theme "dark", child theme "red" and component "Button" returns "dark_red_Button"', () => {
    const parent = new ThemeManager(undefined, {
      name: 'dark',
    })
    const child1 = new ThemeManager(parent, {
      name: 'red',
    })
    expect(child1.state.name).toBe('dark_red')
    const child2 = new ThemeManager(child1, {
      componentName: 'Button',
    })
    expect(child2.state.name).toBe('dark_red_Button')
  })

  test('Given parent theme "dark", child theme "red" and missing component "Card" returns "dark_red"', () => {
    const parent = new ThemeManager(undefined, {
      name: 'dark',
    })
    const child1 = new ThemeManager(parent, {
      name: 'red',
    })
    expect(child1.state.name).toBe('dark_red')
    const child2 = new ThemeManager(child1, {
      componentName: 'Card',
    })
    expect(child2.state.name).toBe('dark_red')
  })

  test('Changes "light" to "dark"', () => {
    const parent = new ThemeManager(undefined, {
      name: 'light',
    })
    const child = new ThemeManager(parent, {
      name: 'dark',
    })
    expect(parent.state.name).toBe('light')
    expect(child.state.name).toBe('dark')
  })

  test('Inverts "light" to "dark"', () => {
    const parent = new ThemeManager(undefined, {
      name: 'light',
    })
    const child1 = new ThemeManager(parent, {
      inverse: true,
    })
    expect(child1.state.name).toBe('dark')
  })

  test('Inverts "light_red" to "dark_red"', () => {
    const parent = new ThemeManager(undefined, {
      name: 'light',
    })
    const child1 = new ThemeManager(parent, {
      name: 'red',
      inverse: true,
    })
    expect(child1.state.name).toBe('dark_red')
  })

  test('Updates state', () => {
    const parent = new ThemeManager(undefined, {
      name: 'light',
    })
    const newState = parent.updateState({
      name: 'dark',
    })
    expect(newState).toMatchInlineSnapshot(`
      {
        "className": "t_dark",
        "name": "dark",
        "theme": {
          "background": {
            "isVar": true,
            "key": "color-2",
            "name": "background",
            "val": "#000",
            "variable": "",
          },
          "color": {
            "isVar": true,
            "key": "color-1",
            "name": "color",
            "val": "#fff",
            "variable": "",
          },
        },
      }
    `)
    expect(parent.state.name).toBe('dark')
  })

  test('Returns parent on empty', () => {
    const parent = new ThemeManager(undefined, {
      name: 'light',
    })
    const child = new ThemeManager(parent, {
      name: null,
    })
    expect(child).toBe(parent)
  })

  test('Resets theme', () => {
    const parent = new ThemeManager(undefined, {
      name: 'light',
    })
    const child = new ThemeManager(parent, {
      name: 'dark',
    })
    const child2 = new ThemeManager(child, {
      reset: true,
    })
    expect(child2.state.name).toBe('light')
  })

  test('Nested invert and reset', () => {
    const parent = new ThemeManager(undefined, {
      name: 'light',
    })
    const child = new ThemeManager(parent, {
      name: 'dark',
    })
    const child2 = new ThemeManager(child, {
      reset: true,
    })
    const child3 = new ThemeManager(child2, {
      inverse: true,
    })
    expect(child3.state.name).toBe('dark')
  })

  test('Updates from null the new theme nested 3 themes', () => {
    const a = new ThemeManager(undefined, {
      name: 'dark',
    })
    const b = new ThemeManager(a, {
      name: 'red',
    })
    expect(b.state.name).toBe('dark_red')
    const c = new ThemeManager(b, {
      name: 'alt2',
    })
    expect(c.state.name).toBe('dark_red_alt2')
  })

  test('Ignored dup themes', () => {
    const a = new ThemeManager(undefined, {
      name: 'dark',
    })
    const b = new ThemeManager(a, {
      name: 'dark',
    })
    expect(b === a).toBe(true)
  })
})

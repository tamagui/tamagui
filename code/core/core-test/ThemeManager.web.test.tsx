import { getDefaultTamaguiConfig } from '@tamagui/config-default'
import { beforeAll, describe, expect, test } from 'vitest'

import { createTamagui } from '../web/src'
import { ThemeManager } from '../web/src/helpers/ThemeManager'

const conf = getDefaultTamaguiConfig()

describe('ThemeManager', () => {
  beforeAll(() => {
    createTamagui(conf as any)
  })

  test('Changes theme to dark', () => {
    const manager = new ThemeManager(
      {
        name: 'dark',
      },
      'root'
    )
    expect(manager.state.name).toBe('dark')
  })

  test('Given parent theme "dark" and child theme "red" to return theme "dark_red"', () => {
    const parent = new ThemeManager(
      {
        name: 'dark',
      },
      'root'
    )
    const child = new ThemeManager(
      {
        name: 'red',
      },
      parent
    )
    expect(parent.state.name).toBe('dark')
    expect(child.state.name).toBe('dark_red')
  })

  test('Given parent theme "dark", child theme "red_alt2" and component "Button" returns "dark_red_alt2_Button"', () => {
    const parent = new ThemeManager(
      {
        name: 'dark',
      },
      'root'
    )
    const child1 = new ThemeManager(
      {
        name: 'red',
      },
      parent
    )
    expect(child1.state.name).toBe('dark_red')
    const child2 = new ThemeManager(
      {
        name: 'alt2',
        componentName: 'Button',
      },
      child1
    )
    expect(child2.state.name).toBe('dark_red_alt2_Button')
  })

  test('Given parent theme "dark", child theme "red" and component "Button" returns "dark_red_Button"', () => {
    const parent = new ThemeManager(
      {
        name: 'dark',
      },
      'root'
    )
    const child1 = new ThemeManager(
      {
        name: 'red',
      },
      parent
    )
    expect(child1.state.name).toBe('dark_red')
    const child2 = new ThemeManager(
      {
        componentName: 'Button',
      },
      child1
    )
    expect(child2.state.name).toBe('dark_red_Button')
  })

  test('Given parent theme "dark", child theme "red" and missing component "Card" returns "dark_red"', () => {
    const parent = new ThemeManager(
      {
        name: 'dark',
      },
      'root'
    )
    const child1 = new ThemeManager(
      {
        name: 'red',
      },
      parent
    )
    expect(child1.state.name).toBe('dark_red')
    const child2 = new ThemeManager(
      {
        componentName: 'Card',
      },
      child1
    )
    expect(child2.state.name).toBe('dark_red')
  })

  test('Changes "light" to "dark"', () => {
    const parent = new ThemeManager(
      {
        name: 'light',
      },
      'root'
    )
    const child = new ThemeManager(
      {
        name: 'dark',
      },
      parent
    )
    expect(parent.state.name).toBe('light')
    expect(child.state.name).toBe('dark')
  })

  test('Inverts "light" to "dark"', () => {
    const parent = new ThemeManager(
      {
        name: 'light',
      },
      'root'
    )
    const child1 = new ThemeManager(
      {
        inverse: true,
      },
      parent
    )
    expect(child1.state.name).toBe('dark')
  })

  test('Inverts nested components work', () => {
    const a = new ThemeManager(
      {
        name: 'light',
      },
      'root'
    )
    const b = new ThemeManager(
      {
        inverse: true,
        componentName: 'Button',
      },
      a
    )
    const c = new ThemeManager(
      {
        componentName: 'Card',
      },
      b
    )
    expect(c.state.scheme).toBe('dark')
    expect(c.state.name).toBe('dark_Card')
  })

  test('Inverts nested components work (same name)', () => {
    const a = new ThemeManager(
      {
        name: 'light',
      },
      'root'
    )
    const b = new ThemeManager(
      {
        inverse: true,
        componentName: 'Button',
      },
      a
    )
    const c = new ThemeManager(
      {
        componentName: 'Button',
      },
      b
    )
    expect(c.state.scheme).toBe('dark')
    expect(c.state.name).toBe('dark_Button')
  })

  test('Inverts "light_red" to "dark_red"', () => {
    const parent = new ThemeManager(
      {
        name: 'light',
      },
      'root'
    )
    const child1 = new ThemeManager(
      {
        name: 'red',
        inverse: true,
      },
      parent
    )
    expect(child1.state.name).toBe('dark_red')
  })

  test('Updates state', () => {
    const parent = new ThemeManager(
      {
        name: 'light',
      },
      'root'
    )
    const newState = parent.updateStateFromProps({
      name: 'dark',
    })
    expect(newState).toMatchInlineSnapshot(`
      {
        "className": "t_sub_theme t_dark",
        "isComponent": false,
        "isSchemeFixed": true,
        "name": "dark",
        "parentName": undefined,
        "scheme": "dark",
        "theme": {
          "background": {
            "isVar": true,
            "key": "c-black",
            "name": "background",
            "val": "#000",
            "variable": "var(--background)",
          },
          "color": {
            "isVar": true,
            "key": "c-white",
            "name": "color",
            "val": "#fff",
            "variable": "var(--color)",
          },
        },
      }
    `)
    expect(parent.state.name).toBe('dark')
  })

  test('Returns parent on empty', () => {
    const parent = new ThemeManager(
      {
        name: 'light',
      },
      'root'
    )
    const child = new ThemeManager(
      {
        name: null,
      },
      parent
    )
    expect(child).toBe(parent)
  })

  test('Resets theme', () => {
    const parent = new ThemeManager(
      {
        name: 'light',
      },
      'root'
    )

    const child = new ThemeManager(
      {
        name: 'dark',
      },
      parent
    )

    expect(child.state.name).toBe('dark')
    expect(child.parentManager).toBe(parent)

    const child2 = new ThemeManager(
      {
        reset: true,
      },
      child
    )

    expect(child2.parentManager).toBe(child)
    expect(child2.state.name).toBe('light')
  })

  test('Resets theme 2', () => {
    const parent = new ThemeManager(
      {
        name: 'dark',
      },
      'root'
    )

    const child = new ThemeManager(
      {
        name: 'blue',
        componentName: 'Card',
      },
      parent
    )

    const child2 = new ThemeManager(
      {
        reset: true,
      },
      child
    )

    expect(child2.parentManager).toBe(child)
    expect(child2.state.name).toBe('dark')

    const child3 = new ThemeManager(
      {
        componentName: 'Button',
        reset: true,
      },
      child
    )

    expect(child3.parentManager).toBe(child)
    expect(child3.state.name).toBe('dark')
  })

  test.skip('Nested invert and reset', () => {
    const parent = new ThemeManager(
      {
        name: 'light',
      },
      'root'
    )
    const child = new ThemeManager(
      {
        name: 'dark',
      },
      parent
    )
    const child2 = new ThemeManager(
      {
        reset: true,
      },
      child
    )
    const child3 = new ThemeManager(
      {
        inverse: true,
      },
      child2
    )
    expect(child3.state.name).toBe('dark')
  })

  test('Updates from null the new theme nested 3 themes', () => {
    const a = new ThemeManager(
      {
        name: 'dark',
      },
      'root'
    )
    const b = new ThemeManager(
      {
        name: 'red',
      },
      a
    )
    expect(b.state.name).toBe('dark_red')
    const c = new ThemeManager(
      {
        name: 'alt2',
      },
      b
    )
    expect(c.state.name).toBe('dark_red_alt2')
  })

  // we no longer de-dupe like this, do it in useTheme
  // test('Ignored dup themes', () => {
  //   const a = new ThemeManager(
  //     {
  //       name: 'dark',
  //     },
  //     'root'
  //   )
  //   const b = new ThemeManager(
  //     {
  //       name: 'dark',
  //     },
  //     a
  //   )
  //   expect(b === a).toBe(true)
  // })

  test('Nested component themes fallback to grandparents', () => {
    const parent = new ThemeManager(
      {
        name: 'dark',
      },
      'root'
    )
    const child = new ThemeManager(
      {
        name: 'red',
        componentName: 'Button',
      },
      parent
    )
    const child2 = new ThemeManager(
      {
        name: 'blue',
      },
      child
    )
    expect(child2.state.name).toBe('dark_blue')
    const child3 = new ThemeManager(
      {
        componentName: 'Button',
      },
      child2
    )
    expect(child3.state.name).toBe('dark_blue_Button')
  })

  test('Nested component themes work', () => {
    const parent = new ThemeManager(
      {
        name: 'dark',
      },
      'root'
    )

    const child = new ThemeManager(
      {
        name: 'blue',
        componentName: 'Button',
      },
      parent
    )

    const child2 = new ThemeManager(
      {
        name: 'red',
        componentName: 'Menu',
      },
      child
    )

    expect(child2.parentManager).toBe(child)

    // it should be dark_red because Component themes are optional
    expect(child2.state.name).toBe('dark_red')
  })

  test(`Doesn't find invalid parent when only passing component`, () => {
    expect(!!conf.themes['dark_Card']).toBeTruthy()

    const parent = new ThemeManager(
      {
        name: 'dark_red',
      },
      'root'
    )

    const child = new ThemeManager(
      {
        componentName: 'Card',
      },
      parent
    )

    // dont find dark_Card because dark_red is highest it should climb
    expect(child.state.name).toBe(parent.state.name)
  })

  test(`Finds sub-theme when componentName and name are passed but componentName doesn't exist`, () => {
    const parent = new ThemeManager(
      {
        name: 'dark',
      },
      'root'
    )

    const child = new ThemeManager(
      {
        name: 'red',
        componentName: 'Missing',
      },
      parent
    )

    // dont find dark_Card because dark_red is highest it should climb
    expect(child.state.name).toBe('dark_red')
  })

  test('Uses the full className without the light/dark prefix', () => {
    const parent = new ThemeManager(
      {
        name: 'dark',
      },
      'root'
    )
    const child = new ThemeManager(
      {
        name: 'red_alt2',
      },
      parent
    )
    expect(child.state.className).toBe('t_sub_theme t_red_alt2')

    const child2 = new ThemeManager(
      {
        name: 'red',
      },
      parent
    )
    const child3 = new ThemeManager(
      {
        name: 'alt2',
      },
      child2
    )
    expect(child3.state.className).toBe('t_sub_theme t_red_alt2')
  })

  test('Finds component dark_red + Button', () => {
    const parent = new ThemeManager(
      {
        name: 'dark_red',
      },
      'root'
    )
    const child = new ThemeManager(
      {
        name: 'dark_red',
        componentName: 'Button',
      },
      parent
    )
    expect(child.state.className).toBe('t_sub_theme t_red_Button')
    expect(child.state.name).toBe('dark_red_Button')
  })

  test('Uses componentName over more generic theme name', () => {
    const parent = new ThemeManager(
      {
        name: 'dark_red',
      },
      'root'
    )
    const child = new ThemeManager(
      {
        name: 'alt1',
        componentName: 'Button',
      },
      parent
    )
    expect(child.state.name).toBe('dark_red_Button')
  })

  test('Component name + theme change when nested already', () => {
    const parent = new ThemeManager(
      {
        name: 'dark_red',
      },
      'root'
    )
    const child = new ThemeManager(
      {
        name: 'yellow',
        componentName: 'Button',
      },
      parent
    )
    expect(child.state.name).toBe('dark_yellow_Button')
  })

  test('Component name + name finds one up when component name missing', () => {
    const parent = new ThemeManager(
      {
        name: 'dark_red_alt1',
      },
      'root'
    )
    const child = new ThemeManager(
      {
        name: 'alt2',
        componentName: 'Missing',
      },
      parent
    )
    expect(child.state.name).toBe('dark_red_alt2')
  })

  test('Component name + name + name', () => {
    const parent = new ThemeManager(
      {
        name: 'dark_red_alt1',
      },
      'root'
    )
    const child = new ThemeManager(
      {
        name: 'active',
        componentName: 'ListItem',
      },
      parent
    )
    expect(child.state.name).toBe('dark_red_active_ListItem')
  })
})

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

  test('Inverts "light" to "dark"', () => {
    const parent = new ThemeManager(undefined, {
      name: 'light',
    })
    const child = new ThemeManager(parent, {
      name: 'dark',
    })
    expect(parent.state.name).toBe('light')
    expect(child.state.name).toBe('dark')
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
    const didChange = parent.updateState({
      name: 'dark',
    })
    expect(didChange).toBe(true)
    expect(parent.state.name).toBe('dark')
  })
})

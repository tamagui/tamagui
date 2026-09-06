import { beforeAll, describe, expect, test } from 'vitest'

import { defaultConfig } from '@tamagui/config/v6'
import { createTamagui } from '@tamagui/web'
import { html as regularHtml } from '@tamagui/core'
import { View, html } from '../index'
import { resolvedStyle, splitTailwindStyles } from './utils'

/**
 * `html` from this package is the same DOM contract as `html` from `tamagui`,
 * built on the Tailwind frontend: same tags, same element defaults, and a class
 * string rather than style props as the styling input.
 */
beforeAll(() => {
  createTamagui(defaultConfig as any)
})

describe('html on the tailwind frontend', () => {
  test('covers every tag the regular html does, without sharing components', () => {
    expect(Object.keys(html).sort()).toEqual(Object.keys(regularHtml).sort())
    for (const tag of Object.keys(html)) {
      expect(html[tag]).not.toBe(regularHtml[tag])
    }
  })

  test('resolves a class string the same way View does', () => {
    const classes = 'px-4 rounded-lg bg-blue-500'
    const asHtml = resolvedStyle(
      splitTailwindStyles(html.div as any, { className: classes })
    )
    const asView = resolvedStyle(splitTailwindStyles(View as any, { className: classes }))
    expect(asHtml.paddingLeft).toBeTruthy()
    expect(asHtml.borderTopLeftRadius).toBeTruthy()
    expect(asHtml.backgroundColor).toBeTruthy()
    // a tag adds its element defaults on top, and the class still wins over them
    expect(asHtml).toMatchObject(asView)
    expect(asHtml.paddingTop).toBe('0px')
  })

  test('resolves a modifier', () => {
    const hovered = resolvedStyle(
      splitTailwindStyles(html.div as any, { className: 'hover:bg-red-500' }),
      'hover'
    )
    expect(hovered.backgroundColor).toBeTruthy()
  })

  test('keeps the tag element defaults', () => {
    // the generated button defaults, which is what makes a tag render the same
    // whether or not a css reset ran
    expect((html.button as any).staticConfig.defaultProps).toMatchObject(
      (regularHtml.button as any).staticConfig.defaultProps
    )
  })

  test('leaves the regular html components on the regular frontend', () => {
    expect((regularHtml.div as any).staticConfig.styleFrontend).toBe(undefined)
    expect((html.div as any).staticConfig.styleFrontend).toBeTruthy()
  })
})

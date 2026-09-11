import { beforeAll, describe, expect, test } from 'vitest'

import { getDefaultTamaguiConfig } from '../../../config-default/src'
import { createTamagui, getConfig } from '@tamagui/web'
import { html as regularHtml } from '@tamagui/core'
import { html } from '../index'
import { splitTailwindStyles, styleOf } from './utils'

/**
 * On native each tag is a wrapper that maps dom props to their react native
 * spelling around the styling component. Rebuilding a tag on another frontend
 * has to keep that wrapper, so these check both halves survive.
 */
beforeAll(() => {
  createTamagui(getDefaultTamaguiConfig('native') as any)
})

describe('html on the tailwind frontend, native', () => {
  test('covers every tag the regular html does, without sharing components', () => {
    expect(Object.keys(html).sort()).toEqual(Object.keys(regularHtml).sort())
    for (const tag of Object.keys(html)) {
      // a tag native does not support is one shared thrower, with nothing to build
      if (!(regularHtml[tag] as any).staticConfig) {
        expect(html[tag]).toBe(regularHtml[tag])
        continue
      }
      expect(html[tag]).not.toBe(regularHtml[tag])
    }
  })

  test('resolves a class string through the config', () => {
    const style = styleOf(splitTailwindStyles(html.div as any, { className: 'p-4' }))
    expect(style.paddingTop).toBe(getConfig().tokensParsed.space['4'].val)
  })

  test('keeps the dom prop mapping wrapper', () => {
    expect(typeof (html.div as any).rebindDOMTag).toBe('function')
    expect((html.div as any).displayName).toBe('div')
  })
})

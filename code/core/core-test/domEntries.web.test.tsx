import * as core from '@tamagui/core'
import * as dom from '@tamagui/core/dom'
import { describe, expect, test } from 'vitest'

/**
 * The standalone DOM entry, `@tamagui/core/dom` (and its `tamagui/dom` alias).
 *
 * Two things matter here and they pull in opposite directions. The entry has to
 * exist and be importable, because import provenance is how the compiler tells
 * the three frontends apart. And it has to stay a separate surface: the whole
 * point of a standalone entry is that it does not drag the regular Tamagui
 * component runtime in behind it.
 */

describe('the standalone entry', () => {
  test('exposes the contract and nothing else', () => {
    expect(Object.keys(dom).sort()).toEqual(['html', 'style'])
  })

  test('covers the same 49 tags as the regular namespace', () => {
    expect(Object.keys(dom.html)).toEqual(Object.keys(core.html))
  })

  test('does not reconnect the regular Tamagui runtime', () => {
    // a barrel that re-exported these would put the whole component runtime
    // behind an entry whose reason to exist is not having it
    for (const name of ['createComponent', 'styled', 'getSplitStyles', 'View', 'Text']) {
      expect(name in dom, name).toBe(false)
    }
  })
})

describe('being compile-only', () => {
  test('style() fails rather than returning something the compiler should have made', () => {
    expect(() => dom.style({ color: 'red' })).toThrow(/compiler did not run/)
  })

  test('every tag fails the same way, naming itself', () => {
    for (const tag of Object.keys(dom.html)) {
      expect(() => (dom.html as Record<string, () => unknown>)[tag]()).toThrow(
        new RegExp(`<html\\.${tag}>`)
      )
    }
  })

  test('says which entry to use instead', () => {
    expect(() => dom.style({})).toThrow(/@tamagui\/core/)
  })
})

describe('the regular namespace, by contrast', () => {
  test('is a real component and does not throw', () => {
    // the same tag name from `@tamagui/core` renders on web; only the
    // standalone entry is compile-only there
    expect(typeof core.html.div).toBe('object')
    expect(core.html.div).not.toBe(dom.html.div)
  })
})

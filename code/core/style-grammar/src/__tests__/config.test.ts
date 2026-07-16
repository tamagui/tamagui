import { describe, expect, test } from 'vitest'
import { createGrammarConfigView } from '..'

describe('createGrammarConfigView', () => {
  test('projects runtime config names into category-safe grammar domains', () => {
    const view = createGrammarConfigView(
      {
        shorthands: { p: 'padding' },
        media: { tablet: { maxWidth: 900 } },
        themes: {
          light: { color5: '#fff', background: '#000' },
          light_alt: { borderColor: '#ccc' },
        },
        tokensParsed: {
          space: { $4: 16 },
          size: { $10: 40 },
          radius: { $true: 8 },
          zIndex: { $modal: 100 },
          color: { $red9: '#f00' },
        },
        fontsParsed: {
          $body: {
            size: { $4: 16 },
            lineHeight: { $4: 20 },
            letterSpacing: { $tight: -0.2 },
          },
        },
      },
      { platformNames: new Set(['$web', 'ios']) }
    )

    expect(view.shorthands).toEqual({ p: 'padding' })
    expect(view.mediaNames).toHaveProperty('tablet')
    expect(view.themeNames).toHaveProperty('light')
    expect(view.platformNames).toEqual(new Set(['$web', 'ios']))
    expect(view.tokenNames?.space).toEqual(new Set(['4']))
    expect(view.tokenNames?.size).toEqual(new Set(['10']))
    expect(view.tokenNames?.radius).toEqual(new Set(['true']))
    expect(view.tokenNames?.zIndex).toEqual(new Set(['modal']))
    expect(view.tokenNames?.color).toEqual(
      new Set(['red9', 'color5', 'background', 'borderColor'])
    )
    expect(view.tokenNames?.fontFamily).toEqual(new Set(['body']))
    expect(view.tokenNames?.fontSize).toEqual(new Set(['4']))
    expect(view.tokenNames?.lineHeight).toEqual(new Set(['4']))
    expect(view.tokenNames?.letterSpacing).toEqual(new Set(['tight']))
  })

  test('unions theme value names across partial subthemes', () => {
    const view = createGrammarConfigView({
      themes: {
        dark: { color1: '#000' },
        dark_blue: { color10: '#00f' },
      },
    })

    expect(view.tokenNames?.color).toEqual(new Set(['color1', 'color10']))
  })
})

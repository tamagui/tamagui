import { describe, expect, test } from 'bun:test'

import {
  tailwindColors,
  tailwindFontSize,
  tailwindLineHeight,
  tailwindRadius,
  tailwindSize,
  tailwindSource,
  tailwindSpace,
  tailwindZIndex,
} from '../src/v6-tailwind-defaults.generated'
import { shorthands, settings, themes, v6ThemeNameReplacements } from '../src/v6-base'
import {
  PLAYWRIGHT_VERSION,
  TAILWIND_VERSION,
  createDefaultTables,
  readPinnedTailwindSource,
  sourceChecksum,
} from './generate-v6-tailwind-defaults'

describe('v6 Tailwind defaults provenance', () => {
  test('v6 binds bg to the background family and exposes only kebab-case theme names', () => {
    expect(shorthands.bg).toBe('background')

    const light = themes.light
    for (const [legacyName, v6Name] of Object.entries(v6ThemeNameReplacements)) {
      expect(light).not.toHaveProperty(legacyName)
      expect(light).toHaveProperty(v6Name)
    }
    expect(Object.keys(light).filter((name) => /[A-Z]/.test(name))).toEqual([])
  })

  test('component and category defaults preserve the v5 control geometry', () => {
    expect(settings).toMatchObject({
      defaultSize: '$11',
      defaultTokens: {
        space: '$4',
        radius: '$4',
        zIndex: '$4',
        fontSize: '$4',
      },
    })
  })

  test('the generated metadata matches both exact canonical toolchain inputs', () => {
    const source = readPinnedTailwindSource()
    expect(tailwindSource).toEqual({
      tailwindVersion: TAILWIND_VERSION,
      colorConverter: `playwright@${PLAYWRIGHT_VERSION}`,
      checksum: sourceChecksum(source),
    })
  })

  test('every scalar table is derived from the pinned theme source', () => {
    const source = readPinnedTailwindSource()
    const generated = createDefaultTables(source.themeCss)
    expect(tailwindSpace).toEqual(generated.space)
    expect(tailwindSize).toEqual(generated.size)
    expect(tailwindRadius).toEqual(generated.radius)
    expect(tailwindZIndex).toEqual(generated.zIndex)
    expect(tailwindFontSize).toEqual(generated.fontSize)
    expect(tailwindLineHeight).toEqual(generated.lineHeight)
  })

  test('token categories stay finite and semantically distinct', () => {
    expect(tailwindSpace).not.toBe(tailwindSize)
    for (const table of [tailwindSpace, tailwindSize]) {
      expect(table).toHaveProperty('$px', 1)
      expect(table).toHaveProperty('$4', 16)
      expect(table).toHaveProperty('$24', 96)
      expect(table).toHaveProperty('$96', 384)
    }
    expect(tailwindSpace).toHaveProperty('-24', -96)
    expect(tailwindSize).not.toHaveProperty('-24')
    expect(tailwindSpace).not.toHaveProperty('$0.25')
    expect(tailwindSpace).not.toHaveProperty('$13')
    expect(tailwindRadius).toHaveProperty('$lg', 8)
    expect(tailwindZIndex).toHaveProperty('$4', 4)
    expect(tailwindZIndex).toHaveProperty('$10', 10)
    expect(tailwindFontSize).toHaveProperty('$base', '16px')
    expect(tailwindLineHeight).toHaveProperty('$base', '24px')
    expect(tailwindColors).toHaveProperty('$blue-500', '#2b7fff')
  })
})

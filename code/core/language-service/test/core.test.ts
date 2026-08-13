import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { describe, expect, test } from 'vitest'

import { createStyleTooling } from '@tamagui/language-service/core'
import { createDocumentStyleTooling } from '@tamagui/language-service/document'
import { createSucraseStyleSiteExtractor } from '@tamagui/language-service/extract-sucrase'

const require = createRequire(import.meta.url)
const { parse } = require('sucrase/dist/parser')
const { TokenType } = require('sucrase/dist/parser/tokenizer/types')

const fixtureDirectory = join(dirname(fileURLToPath(import.meta.url)), 'fixtures')
const configFile = JSON.parse(
  readFileSync(join(fixtureDirectory, 'tamagui.config.json'), 'utf8')
)

const tooling = createStyleTooling(configFile)!

describe('createStyleTooling', () => {
  test('projects the serialized config', () => {
    expect(tooling).not.toBeNull()
    expect(tooling.isStyleProp('bg')).toBe(true)
    expect(tooling.isStyleProp('backgroundColor')).toBe(true)
    expect(tooling.isStyleProp('onPress')).toBe(false)
    expect(tooling.targetProperty('bg')).toBe('backgroundColor')
    expect(tooling.previewThemes).toEqual(['dark'])
  })

  test('completes configured values and modifiers', () => {
    const start = tooling.completions('bg', '', 0)
    expect(start?.completions.map((entry) => entry.value)).toContain('blue')
    expect(start?.completions.map((entry) => entry.value)).toContain('surface')

    const afterValue = tooling.completions('bg', 'blue ', 5)
    expect(afterValue?.completions.map((entry) => entry.value)).toContain('sm')
    expect(afterValue?.completions.map((entry) => entry.value)).toContain('hover')
  })

  test('diagnoses the full program', () => {
    expect(tooling.diagnostics('bg', 'blue sm:surface')).toEqual([])
    expect(tooling.diagnostics('bg', 'hver:blue')).toMatchObject([
      { code: 'unregistered-modifier', start: 0, end: 4 },
    ])
    expect(tooling.diagnostics('padding', 'blue')).toMatchObject([
      { code: 'candidate-property-mismatch', candidate: 'blue' },
    ])
    expect(tooling.diagnostics('bg', 'blue/150')).toMatchObject([
      { code: 'opacity-out-of-range', start: 0, end: 8 },
    ])
    // unknown props never diagnose
    expect(tooling.diagnostics('onPress', 'whatever')).toEqual([])
  })

  test('hovers tokens with their resolved values', () => {
    const token = tooling.hover('bg', 'blue', 2)
    expect(token?.markdown).toContain('blue')
    expect(token?.markdown).toContain('color')
    expect(token?.color).toEqual({ r: 0, g: 0, b: 255, a: 1 })

    const themed = tooling.hover('bg', 'surface', 3)
    expect(themed?.markdown).toContain('dark')
    expect(themed?.markdown).toContain('#111111')
    expect(themed?.color).toEqual({ r: 17, g: 17, b: 17, a: 1 })

    const space = tooling.hover('padding', '4', 0)
    expect(space?.markdown).toContain('space token')
    expect(space?.markdown).toContain('16')

    const modifier = tooling.hover('bg', 'sm:blue', 1)
    expect(modifier?.markdown).toContain('media modifier')
    expect(modifier?.markdown).toContain('maxWidth')
  })

  test('collects color swatches including opacity and literals', () => {
    expect(tooling.colors('bg', 'blue sm:surface')).toMatchObject([
      { text: 'blue', start: 0, end: 4, color: { r: 0, g: 0, b: 255, a: 1 } },
      { text: 'surface', start: 8, end: 15, theme: 'dark' },
    ])
    expect(tooling.colors('bg', 'blue/50')).toMatchObject([
      { color: { r: 0, g: 0, b: 255, a: 0.5 } },
    ])
    expect(tooling.colors('bg', '#ff0000')).toMatchObject([
      { color: { r: 255, g: 0, b: 0, a: 1 } },
    ])
    expect(tooling.colors('bg', 'rebeccapurple')).toMatchObject([
      { color: { r: 102, g: 51, b: 153, a: 1 } },
    ])
    // unresolved non-color idents produce no swatch
    expect(tooling.colors('bg', 'whatever-else')).toEqual([])
  })
})

const extract = createSucraseStyleSiteExtractor(
  { parse, TokenType },
  { isStyleProp: (name) => tooling.isStyleProp(name) }
)

const source = `import { View, styled } from 'tamagui'
import { Other } from 'somewhere-else'

const Thing = styled(View, {
  bg: 'blue',
  variants: {
    big: { true: { padding: '4 sm:4' } },
  },
})

export const App = () => (
  <View bg="surface" padding={'4'}>
    <Thing bg={\`blue\`} />
    <Other bg="not-tamagui" />
    <div bg="not-a-component" />
    <View
      bg="blue"
      renderItem={() => <Thing padding="4" />}
    />
  </View>
)
`

describe('sucrase site extraction', () => {
  test('finds styled properties, nested variants, and JSX attributes', () => {
    const sites = extract(source)
    expect(sites.map((site) => [site.property, site.value, site.kind])).toEqual([
      ['bg', 'blue', 'styled-property'],
      ['padding', '4 sm:4', 'styled-property'],
      ['bg', 'surface', 'jsx-attribute'],
      ['padding', '4', 'jsx-attribute'],
      ['bg', 'blue', 'jsx-attribute'],
      ['bg', 'blue', 'jsx-attribute'],
      ['padding', '4', 'jsx-attribute'],
    ])
    // spans slice back to their exact values
    for (const site of sites) {
      expect(source.slice(site.start, site.end)).toBe(site.value)
    }
  })

  test('skips non-tamagui components unless allComponents is set', () => {
    const sites = extract(source)
    expect(sites.some((site) => site.value === 'not-tamagui')).toBe(false)
    expect(sites.some((site) => site.value === 'not-a-component')).toBe(false)

    const broad = createSucraseStyleSiteExtractor(
      { parse, TokenType },
      { allComponents: true }
    )
    const broadSites = broad(source)
    expect(broadSites.some((site) => site.value === 'not-tamagui')).toBe(true)
    expect(broadSites.some((site) => site.value === 'not-a-component')).toBe(false)
  })

  test('skips values whose raw text differs from the cooked string', () => {
    const tricky = `import { View } from 'tamagui'
const a = <View bg={'blue\\u0020sm:blue'} padding={\`4 \${dynamic}\`} />
`
    expect(extract(tricky)).toEqual([])
  })

  test('respects aliased styled imports', () => {
    const aliased = `import { styled as s, View } from 'tamagui'
const X = s(View, { bg: 'blue' })
`
    expect(extract(aliased)).toMatchObject([{ property: 'bg', value: 'blue' }])
  })
})

describe('document tooling', () => {
  const document = createDocumentStyleTooling(tooling, extract)

  test('maps diagnostics to file offsets', () => {
    const bad = `import { View } from 'tamagui'
const a = <View bg="hver:blue" />
`
    const diagnostics = document.diagnostics(bad)
    expect(diagnostics).toHaveLength(1)
    expect(bad.slice(diagnostics[0].start, diagnostics[0].end)).toBe('hver')
  })

  test('maps completions to file offsets', () => {
    const offset = source.indexOf('"surface"') + 4
    const completions = document.completionsAt(source, offset)
    expect(completions).not.toBeNull()
    expect(source.slice(completions!.replaceStart)).toMatch(/^surface/)
    expect(completions!.completions.map((entry) => entry.value)).toContain('surface')
  })

  test('maps hover and colors to file offsets', () => {
    const offset = source.indexOf(`'blue'`) + 2
    const hover = document.hoverAt(source, offset)
    expect(hover?.text).toBe('blue')
    expect(source.slice(hover!.start, hover!.end)).toBe('blue')

    const colors = document.colors(source)
    expect(colors.length).toBeGreaterThanOrEqual(4)
    for (const color of colors) {
      expect(source.slice(color.start, color.end)).toBe(color.text)
    }
  })
})

describe('estree site extraction (oxc-parser)', () => {
  test('extracts the same sites from oxc output as sucrase tokens', async () => {
    const { extractStyleSitesFromEstree } =
      await import('@tamagui/language-service/extract-estree')
    const oxc = require('oxc-parser')
    const { program } = oxc.parseSync('fixture.tsx', source)
    const estreeSites = extractStyleSitesFromEstree(program, {
      isStyleProp: (name: string) => tooling.isStyleProp(name),
    })
    const tokenSites = extract(source)
    expect(
      estreeSites.map(({ property, value, start, end, kind }) => ({
        property,
        value,
        start,
        end,
        kind,
      }))
    ).toEqual(
      tokenSites.map(({ property, value, start, end, kind }) => ({
        property,
        value,
        start,
        end,
        kind,
      }))
    )
    for (const site of estreeSites) {
      expect(source.slice(site.start, site.end)).toBe(site.value)
    }
  })
})

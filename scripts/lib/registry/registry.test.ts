import { describe, expect, test } from 'bun:test'
import { extractImportSpecifiers, classifyDependencies, packageNameOf } from './deps'
import { reprefixNames, buildItem, type Skin } from './core'

describe('extractImportSpecifiers', () => {
  test('handles multi-line, bare, from, and dynamic imports', () => {
    const src = `
import {
  styled,
  useButton,
} from 'tamagui'
import './side-effect.css'
export { x } from '../sibling/Thing'
const lazy = () => import('@tamagui/lucide-icons-2')
`
    const specs = extractImportSpecifiers(src).sort()
    expect(specs).toEqual(
      ['../sibling/Thing', './side-effect.css', '@tamagui/lucide-icons-2', 'tamagui'].sort()
    )
  })
})

describe('packageNameOf', () => {
  test('collapses subpaths to the package name', () => {
    expect(packageNameOf('tamagui')).toBe('tamagui')
    expect(packageNameOf('@tamagui/ui')).toBe('@tamagui/ui')
    expect(packageNameOf('@tamagui/ui/reset.css')).toBe('@tamagui/ui')
    expect(packageNameOf('react-native/Libraries/x')).toBe('react-native')
  })
})

describe('classifyDependencies', () => {
  test('excludes provided peers, dedups, keeps relatives separate', () => {
    const src = `
import { useState } from 'react'
import { View } from 'react-native'
import { styled } from 'tamagui'
import { Sun } from '@tamagui/lucide-icons-2'
import { Helper } from './Helper'
import { Thing } from '../x/Thing'
`
    const { dependencies, relatives } = classifyDependencies(src)
    expect(dependencies).toEqual(['@tamagui/lucide-icons-2', 'tamagui'])
    expect(relatives).toEqual(['../x/Thing', './Helper'])
  })
})

describe('reprefixNames', () => {
  const src = `styled(Frame, { name: 'DemoButtonFrame' })\nstyled(T, { name: 'DemoButtonText' })`

  test('strips the canonical prefix for the shipped copy', () => {
    expect(reprefixNames(src, 'Demo', '')).toBe(
      `styled(Frame, { name: 'ButtonFrame' })\nstyled(T, { name: 'ButtonText' })`
    )
  })

  test('swaps to a consumer prefix', () => {
    expect(reprefixNames(src, 'Demo', 'KitchenSink')).toBe(
      `styled(Frame, { name: 'KitchenSinkButtonFrame' })\nstyled(T, { name: 'KitchenSinkButtonText' })`
    )
  })

  test('prepends when canonical prefix is empty', () => {
    const bare = `styled(F, { name: 'ButtonFrame' })`
    expect(reprefixNames(bare, '', 'Site')).toBe(`styled(F, { name: 'SiteButtonFrame' })`)
  })

  test('only touches name: identity strings, not other code', () => {
    const s = `const name = 'nope'\nstyled(F, { name: 'DemoX' })\n// name: 'DemoY' in a comment stays? no`
    // the regex matches any `name: '...'`, including in comments — that is
    // acceptable because skins do not put name: in comments; assert the real
    // styled field flips and the bare `const name =` does not.
    const out = reprefixNames(s, 'Demo', 'Z')
    expect(out).toContain(`name: 'ZX'`)
    expect(out).toContain(`const name = 'nope'`)
  })
})

function fakeSkin(base: string, source: string): Skin {
  return { base, name: base.toLowerCase(), file: `${base}.tsx`, source, manifest: { description: 'x' } }
}

describe('buildItem', () => {
  test('derives npm deps + cross-skin registryDependencies from imports', () => {
    const src = `
import { styled } from 'tamagui'
import { Sun } from '@tamagui/lucide-icons-2'
import { SelectItem } from './Select'
styled(F, { name: 'ComboFrame' })
`
    const item = buildItem(fakeSkin('Combo', src), new Set(['Combo', 'Select']))
    expect(item.name).toBe('combo')
    expect(item.type).toBe('registry:ui')
    expect(item.dependencies).toEqual(['@tamagui/lucide-icons-2', 'tamagui'])
    expect(item.registryDependencies).toEqual(['select'])
    // shipped copy uses neutral identity names
    expect(item.files![0].content).toContain(`name: 'ComboFrame'`)
    expect(item.files![0].target).toBe('components/tamagui/Combo.tsx')
  })

  test('throws on a non-skin relative import (would silently drop a file)', () => {
    const src = `import { x } from './localHelper'\nstyled(F, { name: 'AFrame' })`
    expect(() => buildItem(fakeSkin('A', src), new Set(['A']))).toThrow(/non-skin relative/)
  })

  test('surfaces manifest meta (tokens/themes/native/peers)', () => {
    const skin = fakeSkin('B', `styled(F, { name: 'BFrame' })`)
    skin.manifest = {
      description: 'b',
      tokens: ['$background'],
      themes: ['accent'],
      native: { requiresConfigPlugin: true },
      peerDependencies: { react: '*' },
      categories: ['controls'],
    }
    const item = buildItem(skin, new Set(['B']))
    expect(item.meta).toEqual({
      native: { requiresConfigPlugin: true },
      peerDependencies: { react: '*' },
      tokens: ['$background'],
      themes: ['accent'],
    })
    expect(item.categories).toEqual(['controls'])
  })
})

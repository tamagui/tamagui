import { describe, expect, test } from 'bun:test'
// the real A1 vocabulary from style-grammar's committed source (see emit.ts) —
// pure source read so the registry CI job needs no workspace build.
import {
  stateToPseudoProp,
  stateNames,
  stateToSelector,
  stateToModifier,
} from '../../../code/core/style-grammar/src/states'
import { extractImportSpecifiers, classifyDependencies, packageNameOf } from './deps'
import { reprefixNames, buildItem, loadSkin, type Skin } from './core'
import { buildRegistry } from './emit'
import { deriveStates, type StateTables } from './states-derive'

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
      [
        '../sibling/Thing',
        './side-effect.css',
        '@tamagui/lucide-icons-2',
        'tamagui',
      ].sort()
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
  return {
    base,
    name: base.toLowerCase(),
    file: `${base}.tsx`,
    source,
    manifest: { description: 'x' },
  }
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
    expect(() => buildItem(fakeSkin('A', src), new Set(['A']))).toThrow(
      /non-skin relative/
    )
  })

  test('surfaces manifest meta (tokens/themes/native/peers)', () => {
    const skin = fakeSkin('B', `styled(F, { name: 'BFrame' })`)
    skin.manifest = {
      description: 'b',
      tokens: ['$background'],
      themes: ['accent'],
      native: ['requires a Portal provider'],
      peerDependencies: ['react-native-safe-area-context'],
      categories: ['controls'],
    }
    const item = buildItem(skin, new Set(['B']))
    expect(item.meta).toEqual({
      native: ['requires a Portal provider'],
      peerDependencies: ['react-native-safe-area-context'],
      tokens: ['$background'],
      themes: ['accent'],
    })
    expect(item.categories).toEqual(['controls'])
  })

  test('emits uniform meta.states only when the A1 tables are injected', () => {
    const src = `styled(F, { name: 'CFrame', pressStyle: {}, variants: { open: { true: {} } } })`
    // no tables (pre-reassembly): registry unchanged, no states
    expect(buildItem(fakeSkin('C', src), new Set(['C'])).meta).toBeUndefined()
    // tables injected (post-reassembly): uniform canonical state names
    const withStates = buildItem(fakeSkin('C', src), new Set(['C']), TABLES)
    expect(withStates.meta).toEqual({ states: ['open', 'pressed'] })
  })
})

// fixture mirroring @tamagui/style-grammar's states.ts (injected at reassembly).
// keeping it here proves the derivation without duplicating the canonical table
// into shipped code — the generator passes the real tables.
const TABLES: StateTables = {
  pseudoProps: {
    pressed: 'pressStyle',
    disabled: 'disabledStyle',
    starting: 'enterStyle',
    ending: 'exitStyle',
  },
  allStates: [
    'pressed',
    'disabled',
    'starting',
    'ending',
    'open',
    'checked',
    'highlighted',
    'invalid',
    'selected',
  ],
  selectors: {
    open: '[data-state="open"]',
    checked: '[data-state="checked"]',
    highlighted: '[data-highlighted]',
    invalid: '[aria-invalid="true"]',
    selected: '[data-state="active"]',
  },
}

describe('deriveStates', () => {
  test('pseudo-tier: pressStyle + variants.disabled, ignores hover (not in the eight)', () => {
    // a Button-shaped skin: pressStyle pseudo-prop + disabled authored as a variant
    const src = `styled(Frame, {
  hoverStyle: { backgroundColor: '$backgroundHover' },
  pressStyle: { opacity: 0.7 },
  variants: {
    size: sizes,
    disabled: { true: { opacity: 0.35 } },
  },
})`
    expect(deriveStates(src, TABLES)).toEqual(['disabled', 'pressed'])
  })

  test('lifecycle pseudo-props map to starting/ending, not enter/exit', () => {
    const src = `styled(F, { enterStyle: { opacity: 0 }, exitStyle: { opacity: 0 } })`
    expect(deriveStates(src, TABLES)).toEqual(['ending', 'starting'])
  })

  test('component-tier authored as a canonical-named variant', () => {
    const src = `styled(F, { variants: { open: { true: { y: 0 } } } })`
    expect(deriveStates(src, TABLES)).toEqual(['open'])
  })

  test('component-tier authored as a raw web attribute selector', () => {
    const src = `styled(F, { '[data-state="checked"]': { backgroundColor: '$color' } })`
    expect(deriveStates(src, TABLES)).toEqual(['checked'])
  })

  test('ninth `selected` state (Select/RadioGroup) via variant and via data-state=active', () => {
    // component-tier `selected` — no pseudo-prop; derives from the canonical
    // variant key and from the raw [data-state="active"] selector.
    expect(
      deriveStates(`styled(F, { variants: { selected: { true: {} } } })`, TABLES)
    ).toEqual(['selected'])
    expect(
      deriveStates(`styled(F, { '[data-state="active"]': { opacity: 1 } })`, TABLES)
    ).toEqual(['selected'])
  })

  test('does not match a state word inside a comment or string', () => {
    const src = `// open the sheet\nconst label = 'checked out'\nstyled(F, {})`
    expect(deriveStates(src, TABLES)).toEqual([])
  })
})

// the reassembly join: the generator now feeds the REAL @tamagui/style-grammar
// vocabulary (not the fixture above) into deriveStates + buildItem, so these
// tests run against the real tables and the real skin sources. they prove the
// A1 wiring is live end to end — table shapes match what deriveStates expects,
// derivation matches the three authoring tiers on the real skins, and every
// emitted state joins back to a Tailwind modifier.
const REAL_TABLES: StateTables = {
  pseudoProps: stateToPseudoProp,
  allStates: stateNames,
  selectors: stateToSelector,
}

describe('A1 reassembly join (real style-grammar tables + real skins)', () => {
  test('the injected table shapes match what deriveStates consumes', () => {
    // guards the exact failure the reassembly could reintroduce: a states.ts
    // export renamed/reshaped so the generator silently derives nothing.
    expect(Object.values(stateToPseudoProp)).toContain('pressStyle')
    expect(stateNames).toContain('open')
    expect(stateToSelector.selected).toBe('[data-state="active"]')
  })

  test('source-scanned tiers derive from the real Button + Sheet skin source', async () => {
    const button = await loadSkin('Button')
    // tier 1 pseudo-prop (pressStyle) + tier 2 canonical variant (disabled)
    expect(deriveStates(button.source, REAL_TABLES)).toEqual(['disabled', 'pressed'])

    const sheet = await loadSkin('Sheet')
    // tier 2 canonical `open` variant — the blessed component-tier form
    expect(deriveStates(sheet.source, REAL_TABLES)).toEqual(['open'])
  })

  test('buildRegistry emits uniform canonical meta.states across the real skins', async () => {
    const { registry } = await buildRegistry()
    const states = Object.fromEntries(
      registry.items.map((i) => [i.name, i.meta?.states])
    )
    // source-scanned + extraStates-merged, all canonical A1 names
    expect(states.button).toEqual(['disabled', 'pressed'])
    expect(states.sheet).toEqual(['open'])
    // extraStates escape hatch: on-state via activeStyle -> checked
    expect(states.togglegroup).toEqual(['checked', 'pressed'])
    // extraStates: v2-compat `active` selection prop -> selected
    expect(states.listitem).toEqual(['disabled', 'pressed', 'selected'])

    // the join: every state any item emits resolves to a Tailwind modifier.
    for (const item of registry.items) {
      for (const state of item.meta?.states ?? []) {
        expect(stateToModifier[state], `${item.name} state ${state}`).toBeTruthy()
      }
    }
  })
})

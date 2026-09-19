import { describe, expect, test } from 'vitest'
import {
  getOwnedSource,
  getSourceItemForComponent,
  loadSourceRegistry,
  resolveSourceClosure,
  rewriteSourceImports,
  sourceClosureDependencies,
  sourceInstallComment,
} from './sourceMode'

const registry = loadSourceRegistry()

describe('loadSourceRegistry', () => {
  test('loads every generated registry item with canonical content', () => {
    expect(registry.items.size).toBeGreaterThan(20)
    const button = registry.items.get('button')!
    expect(button.skin).toBe('Button')
    expect(button.target).toBe('components/tamagui/Button.tsx')
    expect(button.content).toContain('export const Button')
    expect(button.dependencies).toContain('@tamagui/core')
  })

  test('derives recognized root names from the tamagui index, not by hand', () => {
    expect(registry.skinNames.get('Button')).toBe('Button')
    expect(registry.skinNames.get('ButtonText')).toBe('Button')
    expect(registry.skinNames.get('SelectTrigger')).toBe('Select')
    expect(registry.skinNames.get('AlertDialog')).toBe('AlertDialog')
    // core utilities are NOT skin names
    expect(registry.skinNames.get('XStack')).toBeUndefined()
    expect(registry.skinNames.get('styled')).toBeUndefined()
    expect(registry.skinNames.get('Theme')).toBeUndefined()
  })

  test('derives styled subpaths from the owned package map', () => {
    expect(registry.subpaths.get('tamagui/button')).toBe('Button')
    expect(registry.subpaths.get('tamagui/toggle-group')).toBe('ToggleGroup')
    expect(registry.subpaths.get('tamagui/facets')).toBe('facets')
    expect(registry.subpaths.get('tamagui/unstyled')).toBeUndefined()
    expect(registry.subpaths.get('tamagui/provider')).toBeUndefined()
  })
})

describe('rewriteSourceImports', () => {
  test('splits a root import: skins move local, core utilities stay', () => {
    const out = rewriteSourceImports(
      `import { Button, XStack } from 'tamagui'\nexport const A = () => <XStack><Button>hi</Button></XStack>`,
      registry
    )!
    expect(out).not.toBeNull()
    expect(out.skins).toEqual(['Button'])
    expect(out.code).toContain(`from "../components/tamagui/Button"`)
    expect(out.code).toContain(`import { XStack } from 'tamagui'`)
    // usages keep resolving: identifiers are untouched
    expect(out.code).toContain('<XStack><Button>hi</Button></XStack>')
  })

  test('groups parts from one skin into a single local import', () => {
    const out = rewriteSourceImports(
      `import { Select, SelectTrigger, SelectValue } from 'tamagui'`,
      registry
    )!
    expect(out.skins).toEqual(['Select'])
    expect(out.code).toContain(
      `import { Select, SelectTrigger, SelectValue } from "../components/tamagui/Select"`
    )
    expect(out.code).not.toContain(`from 'tamagui'`)
  })

  test('rewrites each skin to its own local file', () => {
    const out = rewriteSourceImports(
      `import { Button, Dialog } from 'tamagui'`,
      registry
    )!
    expect(out.skins).toEqual(['Button', 'Dialog'])
    expect(out.code).toContain(`from "../components/tamagui/Button"`)
    expect(out.code).toContain(`from "../components/tamagui/Dialog"`)
  })

  test('rewrites a styled subpath import to the same local skin', () => {
    const out = rewriteSourceImports(`import { Button } from 'tamagui/button'`, registry)!
    expect(out.skins).toEqual(['Button'])
    expect(out.code).toContain(`from "../components/tamagui/Button"`)
    expect(out.code).not.toContain(`from 'tamagui/button'`)
    expect(out.code).not.toContain(`from "tamagui/button"`)
  })

  test('moves recognized type imports (the skin exports them)', () => {
    const out = rewriteSourceImports(
      `import { type ButtonProps } from 'tamagui'`,
      registry
    )!
    expect(out.skins).toEqual(['Button'])
    expect(out.code).toContain(`from "../components/tamagui/Button"`)
  })

  test('rewrites dynamic import() and require() of styled subpaths only', () => {
    const dynamic = rewriteSourceImports(
      `const m = await import('tamagui/dialog')`,
      registry
    )!
    expect(dynamic.skins).toEqual(['Dialog'])
    expect(dynamic.code).toContain(`import("../components/tamagui/Dialog")`)

    const required = rewriteSourceImports(
      `const m = require('tamagui/dialog')`,
      registry
    )!
    expect(required.code).toContain(`require("../components/tamagui/Dialog")`)

    // the umbrella root is the whole library, not one skin: never rewritten here
    expect(rewriteSourceImports(`const m = await import('tamagui')`, registry)).toBeNull()
  })

  test('preserves core utilities, unknown, and namespace imports byte-for-byte', () => {
    const core = `import { styled, XStack, Theme } from 'tamagui'`
    expect(rewriteSourceImports(core, registry)).toBeNull()

    const unknown = `import { Button } from 'some-other-library'`
    expect(rewriteSourceImports(unknown, registry)).toBeNull()

    const namespace = `import * as T from 'tamagui'`
    expect(rewriteSourceImports(namespace, registry)).toBeNull()

    expect(rewriteSourceImports(`const x = <div />`, registry)).toBeNull()
    expect(
      rewriteSourceImports(`import { Button } from 'tamagui'`, registry)
    ).not.toBeNull()
  })

  test('leaves unparseable sources without subpaths untouched', () => {
    const broken = `import { Button from 'tamagui'`
    expect(rewriteSourceImports(broken, registry)).toBeNull()
  })

  test('falls back to subpath specifiers in before/after fences', () => {
    const mixed = `// before (v1)
import { ToastProvider } from '@tamagui/toast'
function Root() { return null }
// after (v3)
import { Toast, toast } from 'tamagui/toast'
function Root() { return null }`
    const out = rewriteSourceImports(mixed, registry)!
    expect(out).not.toBeNull()
    expect(out.skins).toEqual(['Toast'])
    expect(out.code).toContain(`from '../components/tamagui/Toast'`)
    expect(out.code).not.toContain(`from 'tamagui/toast'`)
    expect(out.code).toContain(`import { ToastProvider } from '@tamagui/toast'`)
    expect(out.code).toContain('registry item "toast"')
  })

  test('the fallback leaves root imports and comment lines alone', () => {
    const mixed = `// import { Button } from 'tamagui/button'
import { Button } from 'tamagui'
function Root() { return null }
function Root() { return null }`
    expect(rewriteSourceImports(mixed, registry)).toBeNull()
  })

  test('prepends the copy list + npm deps header', () => {
    const out = rewriteSourceImports(`import { Button } from 'tamagui'`, registry)!
    const [first] = out.code.split('\n')
    expect(first).toContain('source mode')
    expect(out.code).toContain(
      `//   components/tamagui/Button.tsx (registry item "button")`
    )
    expect(out.code).toContain('// npm dependencies:')
    expect(out.code).toContain('@tamagui/core')
  })
})

describe('resolveSourceClosure', () => {
  test('is dependency-closed with via attribution', () => {
    const entries = resolveSourceClosure(registry, ['AlertDialog'])
    expect(entries.map((e) => e.item.skin)).toEqual(['AlertDialog', 'Dialog'])
    expect(entries[0].via).toBeUndefined()
    expect(entries[1].via).toBe('alertdialog')
  })

  test('a directly imported dep is not attributed via another item', () => {
    const entries = resolveSourceClosure(registry, ['AlertDialog', 'Dialog'])
    expect(entries.map((e) => e.item.skin)).toEqual(['AlertDialog', 'Dialog'])
    expect(entries[1].via).toBeUndefined()
  })

  test('surface pulls the facets lib helper', () => {
    const entries = resolveSourceClosure(registry, ['Surface'])
    expect(entries.map((e) => e.item.skin)).toEqual(['Surface', 'facets'])
  })

  test('npm deps union is sorted and deduped', () => {
    const entries = resolveSourceClosure(registry, ['AlertDialog'])
    const deps = sourceClosureDependencies(entries)
    expect(deps).toContain('@tamagui/dialog')
    expect(deps).toContain('@tamagui/core')
    expect([...deps].sort()).toEqual(deps)
    expect(new Set(deps).size).toBe(deps.length)
  })

  test('the install comment names every copied file', () => {
    const entries = resolveSourceClosure(registry, ['AlertDialog'])
    const comment = sourceInstallComment(entries)
    expect(comment).toContain('components/tamagui/AlertDialog.tsx')
    expect(comment).toContain('components/tamagui/Dialog.tsx')
    expect(comment).toContain('via "alertdialog"')
  })
})

describe('getOwnedSource', () => {
  test('returns the canonical skin source plus the closed copy list', () => {
    const owned = getOwnedSource(registry, 'alert-dialog')!
    expect(owned).not.toBeNull()
    expect(owned.skin).toBe('AlertDialog')
    expect(owned.target).toBe('components/tamagui/AlertDialog.tsx')
    expect(owned.content).toContain('export const AlertDialog')
    expect(owned.copies.map((c) => c.target)).toEqual([
      'components/tamagui/AlertDialog.tsx',
      'components/tamagui/Dialog.tsx',
    ])
    expect(owned.dependencies).toContain('@tamagui/dialog')
    // loader-serializable
    expect(() => JSON.stringify(owned)).not.toThrow()
  })

  test('returns null for non-component slugs', () => {
    expect(getOwnedSource(registry, 'intro')).toBeNull()
    expect(getOwnedSource(registry, 'native')).toBeNull()
  })
})

describe('getSourceItemForComponent', () => {
  test('joins kebab-case doc slugs to separator-less item names', () => {
    expect(getSourceItemForComponent(registry, 'button')?.skin).toBe('Button')
    expect(getSourceItemForComponent(registry, 'alert-dialog')?.skin).toBe('AlertDialog')
    expect(getSourceItemForComponent(registry, 'list-item')?.skin).toBe('ListItem')
    expect(getSourceItemForComponent(registry, 'toggle-group')?.skin).toBe('ToggleGroup')
    expect(getSourceItemForComponent(registry, 'intro')).toBeNull()
  })
})

import { describe, expect, test } from 'vitest'
import {
  createGrammarConfigView,
  createModifierRegistry,
  parseContainerModifier,
  stateModifierNames,
} from '..'

// One global modifier namespace. These tests pin which spellings resolve to
// which kind, that registration order is state -> media -> platform -> theme
// with first registration winning, and that every cross-kind collision produces
// a diagnostic instead of a silent choice.

const full = createModifierRegistry({
  mediaNames: ['sm', 'md', 'lg'],
  themeNames: { light: {}, dark: {}, dark_blue: {} },
})

describe('registered kinds', () => {
  test('built-in interaction and component states are state modifiers', () => {
    for (const name of [
      'hover',
      'press',
      'focus',
      'focus-visible',
      'focus-within',
      'disabled',
      'enter',
      'exit',
      'active',
      'open',
      'checked',
      'highlighted',
      'selected',
      'invalid',
    ]) {
      expect(full.registry.get(name), name).toBe('state')
    }
    expect(stateModifierNames).toContain('hover')
    expect(stateModifierNames).toContain('open')
  })

  test('config media keys are media modifiers', () => {
    expect(full.registry.get('sm')).toBe('media')
    expect(full.registry.get('lg')).toBe('media')
  })

  test('platform names default to the shared grammar list', () => {
    expect(full.registry.get('web')).toBe('platform')
    expect(full.registry.get('native')).toBe('platform')
    expect(full.registry.get('ios')).toBe('platform')
    expect(full.registry.get('android')).toBe('platform')
  })

  test('only root config themes are theme modifiers', () => {
    expect(full.registry.get('dark')).toBe('theme')
    expect(full.registry.get('dark_blue')).toBeUndefined()
  })

  test('a clean config produces no diagnostics', () => {
    expect(full.diagnostics).toEqual([])
  })

  test('unknown names are undefined, never guessed', () => {
    expect(full.registry.get('hver')).toBeUndefined()
    expect(full.registry.get('xl')).toBeUndefined()
    expect(full.registry.get('')).toBeUndefined()
  })

  test('object prototype keys are not modifiers', () => {
    expect(full.registry.get('__proto__')).toBeUndefined()
    expect(full.registry.get('constructor')).toBeUndefined()
    expect(full.registry.get('toString')).toBeUndefined()
  })
})

describe('parameterized group modifiers', () => {
  test('a state suffix resolves, named or unnamed', () => {
    expect(full.registry.get('group-hover')).toBe('group')
    expect(full.registry.get('group-press')).toBe('group')
    expect(full.registry.get('group-focus-visible')).toBe('group')
    expect(full.registry.get('group-hover/card')).toBe('group')
    expect(full.registry.get('group-press/side_bar-2')).toBe('group')
  })

  test('lifecycle states remain standalone-only', () => {
    for (const name of ['enter', 'exit', 'starting', 'ending']) {
      expect(full.registry.get(name), name).toBe('state')
      expect(full.registry.get(`group-${name}`), `group-${name}`).toBeUndefined()
      expect(
        full.registry.get(`group-${name}/card`),
        `group-${name}/card`
      ).toBeUndefined()
    }
  })

  test('anything that is not a state suffix is unregistered', () => {
    expect(full.registry.get('group')).toBeUndefined()
    expect(full.registry.get('group-')).toBeUndefined()
    expect(full.registry.get('group-sm')).toBeUndefined()
    expect(full.registry.get('group-card-hover')).toBeUndefined()
    expect(full.registry.get('group-hover/')).toBeUndefined()
    expect(full.registry.get('group-hover/a b')).toBeUndefined()
    expect(full.registry.get('group-hover/a/b')).toBeUndefined()
  })
})

describe('parameterized container modifiers', () => {
  test('a registered media size resolves, nearest or named', () => {
    expect(full.registry.get('@sm')).toBe('container')
    expect(full.registry.get('@md')).toBe('container')
    expect(full.registry.get('@sm/layout')).toBe('container')
    expect(full.registry.get('@lg/side_bar-2')).toBe('container')
  })

  test('the size must be a registered media name', () => {
    expect(full.registry.get('@xl')).toBeUndefined()
    expect(full.registry.get('@hover')).toBeUndefined()
    expect(full.registry.get('@dark')).toBeUndefined()
    expect(full.registry.get('@web')).toBeUndefined()
  })

  test('malformed container spellings are unregistered', () => {
    expect(full.registry.get('@')).toBeUndefined()
    expect(full.registry.get('@/layout')).toBeUndefined()
    expect(full.registry.get('@sm/')).toBeUndefined()
    expect(full.registry.get('@sm/a b')).toBeUndefined()
    expect(full.registry.get('@sm/a/b')).toBeUndefined()
    expect(full.registry.get('sm@')).toBeUndefined()
  })

  test('declared container sizes are the whole rule when provided', () => {
    // a hover or pointer media key measures nothing a container has
    const { registry } = createModifierRegistry(
      { mediaNames: ['sm', 'md', 'hoverNone'] },
      { containerSizeNames: ['sm', 'md'] }
    )
    expect(registry.get('@sm')).toBe('container')
    expect(registry.get('@md/layout')).toBe('container')
    expect(registry.get('@hoverNone')).toBeUndefined()
    // the media key itself still works as a viewport query
    expect(registry.get('hoverNone')).toBe('media')
  })

  test('an empty container size list turns off every @ form', () => {
    const { registry } = createModifierRegistry(
      { mediaNames: ['sm'] },
      { containerSizeNames: [] }
    )
    expect(registry.get('sm')).toBe('media')
    expect(registry.get('@sm')).toBeUndefined()
  })

  test('a declared size that is not a media key is refused with a diagnostic', () => {
    const { registry, diagnostics } = createModifierRegistry(
      { mediaNames: ['sm'] },
      { containerSizeNames: ['wide'] }
    )
    expect(registry.get('@wide')).toBeUndefined()
    expect(registry.get('@sm')).toBeUndefined()
    expect(diagnostics).toEqual([
      'container size "wide" is not registered: the same spelling is not registered as a media query',
    ])
  })

  test('a media size shadowed by another kind has no container form', () => {
    // `hover` registers as a state, so the media key named hover is ignored and
    // `@hover` cannot mean a container either
    const { registry } = createModifierRegistry({ mediaNames: ['hover', 'sm'] })
    expect(registry.get('@hover')).toBeUndefined()
    expect(registry.get('@sm')).toBe('container')
  })

  test('parseContainerModifier reports the spelling parts', () => {
    expect(parseContainerModifier('@sm')).toEqual({ size: 'sm', container: null })
    expect(parseContainerModifier('@sm/layout')).toEqual({
      size: 'sm',
      container: 'layout',
    })
    // spelling only: whether the size is a registered media key is the
    // registry's call, so an unknown size still parses
    expect(parseContainerModifier('@xl')).toEqual({ size: 'xl', container: null })
    expect(parseContainerModifier('sm')).toBeNull()
    expect(parseContainerModifier('@sm/')).toBeNull()
  })
})

describe('the @ prefix is reserved', () => {
  test('a configured name starting with @ is refused with a diagnostic', () => {
    const { registry, diagnostics } = createModifierRegistry({
      mediaNames: ['@sm', 'sm'],
    })
    expect(diagnostics).toEqual([
      'modifier "@sm" is not registered: the "@" prefix is reserved for container query modifiers, so it cannot be a media name',
    ])
    // and it did not become a media modifier, so `@sm` still means the container
    expect(registry.get('@sm')).toBe('container')
  })

  test('a configured theme or platform name starting with @ is refused too', () => {
    const { diagnostics } = createModifierRegistry({
      themeNames: ['@dark'],
      platformNames: ['@web'],
    })
    expect(diagnostics).toHaveLength(2)
    expect(diagnostics[0]).toContain('"@web"')
    expect(diagnostics[0]).toContain('platform name')
    expect(diagnostics[1]).toContain('"@dark"')
    expect(diagnostics[1]).toContain('theme name')
  })
})

describe('collisions are reported, first registration wins', () => {
  test('a media key named like a state keeps the state meaning', () => {
    const { registry, diagnostics } = createModifierRegistry({ mediaNames: ['hover'] })
    expect(registry.get('hover')).toBe('state')
    expect(diagnostics).toEqual([
      'modifier "hover" is already registered as a state modifier, so the media name is ignored',
    ])
  })

  test('media wins over a same-named platform', () => {
    const { registry, diagnostics } = createModifierRegistry({ mediaNames: ['web'] })
    expect(registry.get('web')).toBe('media')
    expect(diagnostics).toEqual([
      'modifier "web" is already registered as a media modifier, so the platform name is ignored',
    ])
  })

  test('media wins over a same-named theme', () => {
    const { registry, diagnostics } = createModifierRegistry({
      mediaNames: ['sm'],
      themeNames: ['sm'],
    })
    expect(registry.get('sm')).toBe('media')
    expect(diagnostics).toEqual([
      'modifier "sm" is already registered as a media modifier, so the theme name is ignored',
    ])
  })

  test('the group prefix is reserved across configured name sources', () => {
    const { registry, diagnostics } = createModifierRegistry({
      mediaNames: ['group-hover'],
      themeNames: ['group-brand'],
      platformNames: ['web', 'group-device'],
      containerSizeNames: ['group-wide'],
    })
    expect(registry.get('group-hover')).toBe('group')
    expect(registry.get('group-brand')).toBeUndefined()
    expect(registry.get('group-device')).toBeUndefined()
    expect(registry.get('@group-wide')).toBeUndefined()
    expect(diagnostics).toEqual([
      'container size "group-wide" is not registered: the "group-" prefix is reserved for group state modifiers; rename this container size so it does not begin with "group-"',
      'modifier "group-hover" is not registered: the "group-" prefix is reserved for group state modifiers; rename this media name so it does not begin with "group-"',
      'modifier "group-device" is not registered: the "group-" prefix is reserved for group state modifiers; rename this platform name so it does not begin with "group-"',
      'modifier "group-brand" is not registered: the "group-" prefix is reserved for group state modifiers; rename this theme name so it does not begin with "group-"',
    ])
  })

  test('a repeated name within one kind is not a collision', () => {
    const { diagnostics } = createModifierRegistry({ mediaNames: ['sm', 'sm'] })
    expect(diagnostics).toEqual([])
  })
})

describe('config name sources', () => {
  test('arrays, sets, and objects all register', () => {
    const fromSet = createModifierRegistry({ mediaNames: new Set(['sm']) })
    const fromObject = createModifierRegistry({ mediaNames: { sm: {} } })
    const fromArray = createModifierRegistry({ mediaNames: ['sm'] })
    for (const created of [fromSet, fromObject, fromArray]) {
      expect(created.registry.get('sm')).toBe('media')
    }
  })

  test('explicit platform names replace the defaults', () => {
    const { registry } = createModifierRegistry({ platformNames: ['web'] })
    expect(registry.get('web')).toBe('platform')
    expect(registry.get('ios')).toBeUndefined()
  })

  test('an empty config still has the built-in states and platforms', () => {
    const { registry, diagnostics } = createModifierRegistry({})
    expect(registry.get('hover')).toBe('state')
    expect(registry.get('ios')).toBe('platform')
    expect(registry.get('sm')).toBeUndefined()
    expect(diagnostics).toEqual([])
  })
})

describe('container size projection', () => {
  test('a media record derives its size subset into the view', () => {
    const view = createGrammarConfigView({
      media: { sm: { maxWidth: 800 }, hoverNone: { hover: 'none' } },
    })
    expect(view.containerSizeNames).toEqual(['sm'])
    const { registry, diagnostics } = createModifierRegistry(view)
    expect(registry.get('@sm')).toBe('container')
    expect(registry.get('@hoverNone')).toBeUndefined()
    expect(diagnostics).toEqual([])
  })

  test('an explicit empty set means known-none, silently', () => {
    const { registry, diagnostics } = createModifierRegistry(
      { mediaNames: ['tablet'] },
      { containerSizeNames: [] }
    )
    expect(registry.get('@tablet')).toBeUndefined()
    expect(diagnostics).toEqual([])
  })
})

describe('config-derived modifier trie', () => {
  test('follows canonical chain order and omits used conditions', () => {
    const root = full.registry.next!([])
    expect(root).toEqual(expect.arrayContaining(['web', 'dark', '@sm', 'sm', 'hover']))

    const platform = full.registry.next!(['web'])
    expect(platform).toEqual(expect.arrayContaining(['dark', '@sm', 'sm', 'hover']))
    expect(platform).not.toEqual(expect.arrayContaining(['web', 'native', 'ios']))

    const chain = full.registry.next!(['web', 'dark', '@sm', 'sm', 'hover'])
    expect(chain).toEqual([])
  })

  test('omits aliases and every category already used by the chain', () => {
    expect(full.registry.next!(['press'])).not.toEqual(
      expect.arrayContaining(['press', 'active'])
    )
    expect(full.registry.next!(['dark'])).not.toContain('light')
    expect(full.registry.next!(['sm'])).not.toEqual(expect.arrayContaining(['md', 'lg']))
    expect(full.registry.next!(['@sm'])).not.toEqual(
      expect.arrayContaining(['@md', '@lg'])
    )
    expect(full.registry.next!(['group-hover'])).not.toContain('group-press')
    expect(full.registry.next!(['dark', '@sm', 'sm', 'group-hover', 'hover'])).toEqual([])
  })

  test('stops an invalid authored chain instead of recovering below it', () => {
    expect(full.registry.next!(['hover', 'web'])).toEqual([])
    expect(full.registry.next!(['hover', 'hover'])).toEqual([])
    expect(full.registry.next!(['hover', 'press'])).toEqual([])
    expect(full.registry.next!(['sm', 'md'])).toEqual([])
    expect(full.registry.next!(['@sm', '@md'])).toEqual([])
    expect(full.registry.next!(['group-hover', 'group-press'])).toEqual([])
    expect(full.registry.next!(['dark', 'light'])).toEqual([])
    expect(full.registry.next!(['web', 'ios'])).toEqual([])
    expect(full.registry.next!(['not-registered'])).toEqual([])
  })

  test('does not invent a separate container marker', () => {
    expect(full.registry.get('@container')).toBeUndefined()
  })

  test('caches each visited chain node without prebuilding combinations', () => {
    expect(full.registry.next!(['web', 'dark'])).toBe(
      full.registry.next!(['web', 'dark'])
    )
  })
})

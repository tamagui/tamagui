process.env.TAMAGUI_TARGET = 'web'

import { describe, expect, test } from 'vitest'

import config from '../config-default'
import { createTamagui } from '../web/src'
import { createGrammarRuntimeContext } from '../web/src/helpers/grammarConfig'
import { createMediaStyle } from '../web/src/helpers/createMediaStyle'
import {
  lowerProgram,
  parseValue,
  resolvePayload,
  serializePayloadWeb,
} from '@tamagui/style-grammar'
import type { StyleObject } from '@tamagui/helpers'

// The resolver view adapter (lane W4). What matters here is that it agrees with
// the config that already exists: the same variable text the theme system emits,
// the same query text createMediaStyle emits, and the same property-to-token
// category bindings the `$token` path uses.

const tamaguiConfig = createTamagui(config.getDefaultTamaguiConfig())
const context = createGrammarRuntimeContext(tamaguiConfig)

describe('identifier lookup', () => {
  test('a token resolves to the variable the config already carries', () => {
    const reference = context.getLookup('padding')('4')
    expect(reference).toBeDefined()
    expect(context.toVar(reference!.name)).toBe(
      tamaguiConfig.tokensParsed.space['$4'].variable
    )
  })

  test('lookup is property-scoped, so colliding token names stay distinct', () => {
    // `4` is a space token for padding and a size token for width
    const space = context.getLookup('padding')('4')!
    const size = context.getLookup('width')('4')!
    expect(context.toVar(space.name)).toBe(
      tamaguiConfig.tokensParsed.space['$4'].variable
    )
    expect(context.toVar(size.name)).toBe(tamaguiConfig.tokensParsed.size['$4'].variable)
    expect(context.toVar(space.name)).not.toBe(context.toVar(size.name))
  })

  test('a theme key resolves through the variables namespace', () => {
    const reference = context.getLookup('backgroundColor')('background')!
    const themeVariable = (tamaguiConfig.themes.light as Record<string, any>).background
    expect(context.toVar(reference.name)).toBe(themeVariable.variable)
  })

  test('the same theme key spells one variable across every theme', () => {
    const reference = context.getLookup('color')('color')!
    const light = (tamaguiConfig.themes.light as Record<string, any>).color
    const dark = (tamaguiConfig.themes.dark as Record<string, any>).color
    // that identity is what keeps a theme switch from re-rendering
    expect(light.variable).toBe(dark.variable)
    expect(context.toVar(reference.name)).toBe(light.variable)
  })

  test('kind is color for color props, which is what gates the opacity suffix', () => {
    expect(context.getLookup('backgroundColor')('background')!.kind).toBe('color')
    expect(context.getLookup('color')('color')!.kind).toBe('color')
    expect(context.getLookup('padding')('4')!.kind).toBe('length')
    expect(context.getLookup('zIndex')('1')!.kind).toBe('number')
  })

  test('a name that is not configured stays literal', () => {
    expect(context.getLookup('color')('cornflowerblue')).toBeUndefined()
    expect(context.getLookup('padding')('999')).toBeUndefined()
  })

  test('font-scoped props resolve against a font sub-map', () => {
    const reference = context.getLookup('fontSize')('4')
    expect(reference).toBeDefined()
    const font = (tamaguiConfig.fontsParsed as Record<string, any>)[
      tamaguiConfig.defaultFontToken
    ]
    expect(context.toVar(reference!.name)).toBe(font.size['$4'].variable)
  })

  test('bare numbers resolve only for numeric-category props', () => {
    expect(context.resolvesNumbers('padding')).toBe(true)
    expect(context.resolvesNumbers('width')).toBe(true)
    expect(context.resolvesNumbers('borderRadius')).toBe(true)
    expect(context.resolvesNumbers('zIndex')).toBe(true)
    expect(context.resolvesNumbers('fontSize')).toBe(true)
    // no numeric token category, so `opacity="0.5"` must stay 0.5
    expect(context.resolvesNumbers('opacity')).toBe(false)
    expect(context.resolvesNumbers('backgroundColor')).toBe(false)
    expect(context.resolvesNumbers('transform')).toBe(false)
  })
})

describe('serialization against the real config', () => {
  test('a payload lowers to the config own variables', () => {
    const resolved = resolvePayload('4', {
      lookup: context.getLookup('padding'),
      resolveNumbers: context.resolvesNumbers('padding'),
    })
    expect(serializePayloadWeb(resolved, context.toVar)).toBe(
      tamaguiConfig.tokensParsed.space['$4'].variable
    )
  })

  test('an opacity suffix on a theme color composes with the theme variable', () => {
    const resolved = resolvePayload('background/50', {
      lookup: context.getLookup('backgroundColor'),
    })
    const themeVariable = (tamaguiConfig.themes.light as Record<string, any>).background
    expect(serializePayloadWeb(resolved, context.toVar)).toBe(
      `color-mix(in srgb, ${themeVariable.variable} 50%, transparent)`
    )
  })

  test('literal css passes through the real config untouched', () => {
    const payload = 'linear-gradient(135deg, cornflowerblue, #fff)'
    const resolved = resolvePayload(payload, {
      lookup: context.getLookup('backgroundImage'),
    })
    expect(serializePayloadWeb(resolved, context.toVar)).toBe(payload)
  })

  test('the native getter reads the active theme, not one baked value', () => {
    const resolved = resolvePayload('background', {
      lookup: context.getLookup('backgroundColor'),
    })
    const reference = resolved.references[0]
    const light = context.createNativeValueGetter(tamaguiConfig.themes.light as any)
    const dark = context.createNativeValueGetter(tamaguiConfig.themes.dark as any)
    expect(light(reference.name)).toBe(
      (tamaguiConfig.themes.light as Record<string, any>).background.val
    )
    expect(dark(reference.name)).toBe(
      (tamaguiConfig.themes.dark as Record<string, any>).background.val
    )
    expect(light(reference.name)).not.toBe(dark(reference.name))
  })
})

describe('modifiers from the real config', () => {
  test('config media, themes, and platforms register', () => {
    expect(context.registry.get('sm')).toBe('media')
    expect(context.registry.get('gtSm')).toBe('media')
    expect(context.registry.get('pointerCoarse')).toBe('media')
    expect(context.registry.get('dark')).toBe('theme')
    expect(context.registry.get('hover')).toBe('state')
    // unprefixed platform names, which is what the flat grammar spells
    expect(context.registry.get('web')).toBe('platform')
    expect(context.registry.get('ios')).toBe('platform')
    expect(context.registry.get('$web')).toBeUndefined()
  })

  test('container modifiers resolve for real media sizes', () => {
    expect(context.registry.get('@sm')).toBe('container')
    expect(context.registry.get('@sm/layout')).toBe('container')
    expect(context.registry.get('@nope')).toBeUndefined()
  })

  test('a real config registers without collisions', () => {
    expect(context.modifierDiagnostics).toEqual([])
  })
})

describe('media and container query text', () => {
  test('the media text is exactly what createMediaStyle emits for that key', () => {
    const styleObject: StyleObject = [
      'color',
      'red',
      '_col-test',
      undefined as any,
      ['._col-test{color:red}'],
    ]
    const [, , , , rules] = createMediaStyle(
      styleObject,
      'sm',
      tamaguiConfig.media as any,
      true
    )
    expect(rules[0]).toContain(`@media ${context.mediaQueries.sm}`)
  })

  test('every container size has query text, so lowering never throws', () => {
    expect(context.containerSizes.length).toBeGreaterThan(0)
    for (const key of context.containerSizes) {
      expect(context.containerQueries[key], key).toBeTruthy()
      // `@sm:` applies the same condition the media key describes, measured
      // against the container rather than the viewport
      expect(context.containerQueries[key], key).toBe(context.mediaQueries[key])
    }
  })

  test('container sizes exclude media keys that do not measure a size', () => {
    expect(context.containerSizes).toContain('sm')
    expect(context.containerSizes).toContain('gtSm')
    expect(context.containerSizes).toContain('short')
    // hover and pointer queries measure no size, so they have no `@` form at all
    expect(context.containerSizes).not.toContain('hoverNone')
    expect(context.containerSizes).not.toContain('pointerCoarse')
    expect(context.containerQueries.hoverNone).toBeUndefined()
    expect(context.containerQueries.pointerCoarse).toBeUndefined()
  })

  test('a non-size media key has no container modifier, it is a parse error', () => {
    expect(context.registry.get('@hoverNone')).toBeUndefined()
    expect(context.registry.get('@pointerCoarse')).toBeUndefined()
    // the media key itself is still a perfectly good viewport query
    expect(context.registry.get('hoverNone')).toBe('media')

    const result = parseValue('red @hoverNone:blue', context.registry)
    expect(result.ok).toBe(false)
    expect(result.ok === false && result.errors[0]).toMatchObject({
      code: 'unregistered-modifier',
      modifier: '@hoverNone',
    })
  })

  test('a size-measuring media key still lowers, wrapper text included', () => {
    const lowered = lowerProgram(
      {
        property: 'color',
        value: {
          base: 'red',
          clauses: [{ modifiers: ['@sm/layout'], payload: 'blue' }],
        },
        sourceProp: 'color',
      },
      {
        registry: context.registry,
        configRevision: context.configRevision,
        mediaQueries: context.mediaQueries,
        containerQueries: context.containerQueries,
      }
    )
    expect(lowered.rules[1]).toContain(
      `@container layout ${context.containerQueries.sm} {`
    )
  })

  test('a container query table missing a size is a config-time error', () => {
    expect(() =>
      createGrammarRuntimeContext(tamaguiConfig, {
        containerQueries: { sm: '(min-width: 24rem)' },
      })
    ).toThrow(/missing container queries for media/)
  })
})

describe('config revision', () => {
  test('it is stable for one config and derived from content, not a counter', () => {
    expect(context.configRevision).toBeTruthy()
    expect(createGrammarRuntimeContext(tamaguiConfig).configRevision).toBe(
      context.configRevision
    )
  })

  test('adding a token changes the revision', () => {
    const base = config.getDefaultTamaguiConfig()
    const next = createTamagui({
      ...base,
      tokens: {
        ...base.tokens,
        space: { ...base.tokens.space, brandNew: 123 },
      },
    })
    expect(createGrammarRuntimeContext(next).configRevision).not.toBe(
      context.configRevision
    )
  })
})

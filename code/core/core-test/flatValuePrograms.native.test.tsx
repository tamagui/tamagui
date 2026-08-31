// Lane W3: on native, clause-bearing values evaluate the shared fixed
// precedence key against live conditions and land in the plain style object.

import { beforeAll, expect, test, vi } from 'vitest'
import config from '../config-default'
import { Text, View, createTamagui, getSplitStyles, styled } from '../web/src'
import {
  flatValuePrecedenceFixtures,
  reverseFixtureProgram,
  type FlatValueFixtureConditions,
  type FlatValuePrecedenceFixture,
} from './flatValuePrecedenceFixtures'
import { simplifiedGetSplitStyles } from './utils'

// Exercise the table on a concrete native platform so both `native:` and the
// more-specific `ios:` containment level are covered in this exact surface.
vi.mock('@tamagui/constants', async () => ({
  ...(await vi.importActual<any>('@tamagui/constants')),
  isIos: true,
  isWeb: false,
  platformMatches: (name: string) => name === 'native' || name === 'ios',
}))

beforeAll(() => {
  createTamagui(config.getDefaultTamaguiConfig() as any)
})

const split = (
  props: Record<string, any>,
  state: Record<string, any> = {},
  themeName = 'light',
  styleProps: Record<string, any> = {},
  groupContext?: Record<string, any>
) =>
  getSplitStyles(
    props,
    View.staticConfig,
    undefined as any,
    themeName,
    { unmounted: false, ...state } as any,
    { isAnimated: false, noClass: true, resolveValues: 'auto', ...styleProps } as any,
    undefined,
    undefined,
    groupContext as any
  )

// a parent group/container entry as createComponent provides it
const groupEntry = (
  pseudo: Record<string, boolean> = {},
  layout?: { width: number; height: number }
) => ({
  subscribe: () => () => {},
  state: { pseudo, layout },
})

function fixtureOptions(active: FlatValueFixtureConditions) {
  const groupContext: Record<string, any> = {}
  for (const group of active.groups ?? []) {
    const match = /^group-([^/]+)(?:\/(.+))?$/.exec(group)
    if (match) {
      groupContext[match[2] ?? 'true'] = groupEntry({
        [match[1] === 'active' ? 'press' : match[1]]: true,
      })
    }
  }
  for (const container of active.containers ?? []) {
    const match = /^@[^/]+(?:\/(.+))?$/.exec(container)
    groupContext[match?.[1] ? `@${match[1]}` : '@'] = groupEntry(
      {},
      { width: 400, height: 100 }
    )
  }
  return {
    componentState: Object.fromEntries(
      (active.states ?? []).map((state) => [state === 'active' ? 'press' : state, true])
    ),
    groupContext,
    mediaState: Object.fromEntries((active.media ?? []).map((name) => [name, true])),
    mergeDefaultProps: true,
    noClass: true,
    themeName: active.themes?.at(-1) ?? 'light',
  }
}

function splitFixture(
  fixture: FlatValuePrecedenceFixture,
  active: FlatValueFixtureConditions,
  reversed: boolean
) {
  let Component: any = View
  const props: Record<string, string> = {}
  for (const layer of fixture.layers) {
    const value = reversed ? reverseFixtureProgram(layer.value) : layer.value
    if (layer.source === 'styled') {
      Component = styled(Component, { [fixture.property]: value })
    } else {
      props[fixture.property] = value
    }
  }
  return simplifiedGetSplitStyles(Component, props, fixtureOptions(active))
}

for (const fixture of flatValuePrecedenceFixtures) {
  for (const scenario of fixture.scenarios) {
    if (scenario.active.platform === 'web') continue
    test(`precedence fixture ${fixture.id}: ${fixture.name} / ${scenario.name}`, () => {
      for (const reversed of [false, true]) {
        const result = splitFixture(fixture, scenario.active, reversed)
        expect(result.style?.[fixture.property]).toBe(
          reversed ? (scenario.reversedExpected ?? scenario.expected) : scenario.expected
        )
      }
    })
  }
}

type SplitConditions = [
  state?: Record<string, any>,
  themeName?: string,
  styleProps?: Record<string, any>,
  groupContext?: Record<string, any>,
]

const tokenClauseCases: {
  name: string
  modifier: string
  active: SplitConditions
  inactive: SplitConditions
}[] = [
  {
    name: 'hover',
    modifier: 'hover',
    active: [{ hover: true }],
    inactive: [{}],
  },
  {
    name: 'press',
    modifier: 'press',
    active: [{ press: true }],
    inactive: [{}],
  },
  {
    name: 'focus',
    modifier: 'focus',
    active: [{ focus: true }],
    inactive: [{}],
  },
  {
    name: 'disabled',
    modifier: 'disabled',
    active: [{ disabled: true }],
    inactive: [{}],
  },
  {
    name: 'dark theme',
    modifier: 'dark',
    active: [{}, 'dark'],
    inactive: [{}, 'light'],
  },
  {
    name: 'media',
    modifier: 'sm',
    active: [{}, 'light', { mediaState: { sm: true } }],
    inactive: [{}, 'light', { mediaState: { sm: false } }],
  },
  {
    name: 'group press',
    modifier: 'group-press',
    active: [{}, 'light', {}, { true: groupEntry({ press: true }) }],
    inactive: [{}, 'light', {}, { true: groupEntry({ press: false }) }],
  },
  {
    name: 'container',
    modifier: '@sm',
    active: [{}, 'light', {}, { '@': groupEntry({}, { width: 400, height: 100 }) }],
    inactive: [{}, 'light', {}, { '@': groupEntry({}, { width: 1000, height: 100 }) }],
  },
]

test('base applies and the hover clause waits for the state', () => {
  const base = split({ backgroundColor: 'red hover:blue' })
  expect(base.style?.backgroundColor).toBe('red')
  expect(base.programStates?.has('hover')).toBe(true)

  const hovered = split({ backgroundColor: 'red hover:blue' }, { hover: true })
  expect(hovered.style?.backgroundColor).toBe('blue')
})

test('flat conditional objects match clause strings on native', () => {
  // Put default last to prove object enumeration order cannot make it override
  // an active condition.
  const value = {
    hover: '#00f',
    sm: '#0f0',
    'sm:hover': '#f0f',
    'dark:sm:hover': '#ffc0cb',
    default: '#f00',
  }
  const conditions: SplitConditions = [
    { hover: true },
    'dark',
    { mediaState: { sm: true } },
  ]
  const object = split({ backgroundColor: value }, ...conditions)
  const string = split(
    {
      backgroundColor: '#f00 hover:#00f sm:#0f0 sm:hover:#f0f dark:sm:hover:#ffc0cb',
    },
    ...conditions
  )

  expect(object.style?.backgroundColor).toBe('#ffc0cb')
  expect(object.style).toEqual(string.style)
  expect(object.programStates?.has('hover')).toBe(true)
  expect(object.hasMedia?.has('sm')).toBe(true)
})

test('flat conditional objects work in styled defaults and variants on native', () => {
  const Frame = styled(View, {
    bg: { default: '#808080', hover: '#00f' },
    variants: {
      tone: {
        danger: {
          opacity: { default: 0.5, focus: 1 },
        },
      },
    } as const,
  })

  const hovered = simplifiedGetSplitStyles(
    Frame,
    { tone: 'danger' },
    {
      componentState: { hover: true, focus: true },
      mergeDefaultProps: true,
    }
  )
  expect(hovered.style?.backgroundColor).toBe('#00f')
  expect(hovered.style?.opacity).toBe(1)
})

test('flat conditional object enter clauses emit the implicit resting base', () => {
  const object = split({ opacity: { enter: 0 } })
  const string = split({ opacity: 'enter:0' })
  expect(object.style?.opacity).toBe(1)
  expect(object.style).toEqual(string.style)

  const entering = split({ opacity: { enter: 0 } }, { unmounted: true })
  expect(entering.style?.opacity).toBe(0)
})

test('a clause-valued variant with an object definition composes the chains', () => {
  const Frame = styled(View, {
    variants: {
      tone: {
        danger: {
          bg: { default: '#ffa500', hover: '#ff0' },
        },
      },
    } as const,
  })
  const inactive = simplifiedGetSplitStyles(
    Frame,
    { tone: 'sm:danger' },
    {
      mediaState: { sm: false },
      mergeDefaultProps: true,
      noClass: true,
    }
  )
  expect(inactive.style?.backgroundColor).toBe(undefined)

  const active = simplifiedGetSplitStyles(
    Frame,
    { tone: 'sm:danger' },
    {
      mediaState: { sm: true },
      mergeDefaultProps: true,
      noClass: true,
    }
  )
  expect(active.style?.backgroundColor).toBe('#ffa500')

  const hovered = simplifiedGetSplitStyles(
    Frame,
    { tone: 'sm:danger' },
    {
      componentState: { hover: true },
      mediaState: { sm: true },
      mergeDefaultProps: true,
      noClass: true,
    }
  )
  expect(hovered.style?.backgroundColor).toBe('#ff0')
})

test('plain and conditional structured leaves stay intact on native', () => {
  expect(split({ shadowOffset: { width: 2, height: 4 } }).style?.shadowOffset).toEqual({
    width: 2,
    height: 4,
  })

  const hovered = split(
    {
      shadowOffset: {
        default: { width: 2, height: 4 },
        hover: { width: 6, height: 8 },
      },
    },
    { hover: true }
  )
  expect(hovered.style?.shadowOffset).toEqual({ width: 6, height: 8 })
})

test.each(tokenClauseCases)(
  'bare tokens resolve in clause payloads on native: name',
  ({ modifier, active }) => {
    const clause = split({ backgroundColor: `white ${modifier}:black` }, ...active)
    expect(clause.style?.backgroundColor).toBe('#000')
  }
)

test('bare configured tokens resolve in both program positions on native', () => {
  const base = split({ backgroundColor: 'white press:black' })
  expect(base.style?.backgroundColor).toBe('#fff')

  const clause = split({ backgroundColor: 'white press:black' }, { press: true })
  expect(clause.style?.backgroundColor).toBe('#000')
})

test('an unknown bare lookup miss stays literal on native', () => {
  const warnings: string[] = []
  const original = console.warn
  const previousNodeEnv = process.env.NODE_ENV
  process.env.NODE_ENV = 'development'
  console.warn = (message: string) => warnings.push(String(message))
  try {
    const result = split(
      { backgroundColor: 'white press:missing-native' },
      { press: true }
    )
    expect(result.style?.backgroundColor).toBe('missing-native')

    const base = split({ backgroundColor: 'missing-native-base press:black' })
    expect(base.style?.backgroundColor).toBe('missing-native-base')
    expect(warnings).toEqual([])
  } finally {
    console.warn = original
    process.env.NODE_ENV = previousNodeEnv
  }
})

test.each(tokenClauseCases)(
  'bare tokens resolve in base payloads on native: name',
  ({ modifier, inactive }) => {
    const base = split({ backgroundColor: `white ${modifier}:black` }, ...inactive)
    expect(base.style?.backgroundColor).toBe('#fff')
  }
)

test('press state matches press and active spellings', () => {
  const pressed = split({ opacity: '0.5 press:1' }, { press: true })
  expect(pressed.style?.opacity).toBe(1)

  const active = split({ opacity: '0.5 active:1' }, { press: true })
  expect(active.style?.opacity).toBe(1)
})

test('theme clauses follow the theme name chain', () => {
  const light = split({ backgroundColor: 'red dark:blue' })
  expect(light.style?.backgroundColor).toBe('red')

  const dark = split({ backgroundColor: 'red dark:blue' }, {}, 'dark')
  expect(dark.style?.backgroundColor).toBe('blue')

  const subTheme = split({ backgroundColor: 'red dark:blue' }, {}, 'dark_blue')
  expect(subTheme.style?.backgroundColor).toBe('blue')
})

test('media clauses read the media state and register the subscription', () => {
  const off = split({ backgroundColor: 'red sm:blue' })
  expect(off.style?.backgroundColor).toBe('red')
  expect(off.hasMedia instanceof Set && off.hasMedia.has('sm')).toBe(true)

  const on = split({ backgroundColor: 'red sm:blue' }, {}, 'light', {
    mediaState: { sm: true },
  })
  expect(on.style?.backgroundColor).toBe('blue')
})

test('native platform clauses apply through containment', () => {
  const result = split({ backgroundColor: 'red native:blue web:green' })
  expect(result.style?.backgroundColor).toBe('blue')
})

test('tokens resolve to numbers through the theme getter', () => {
  const result = split({ p: '4 hover:6' })
  expect(result.style?.paddingTop).toBe(18)
  expect(result.style?.paddingLeft).toBe(18)

  const hovered = split({ p: '4 hover:6' }, { hover: true })
  expect(hovered.style?.paddingTop).toBe(32)
})

test('px payloads become unitless numbers', () => {
  const result = split({ marginTop: '10px hover:20px' })
  expect(result.style?.marginTop).toBe(10)
})

test('exit clauses source from isExiting', () => {
  const normal = split({ opacity: '1 exit:0' })
  expect(normal.style?.opacity).toBe(1)

  const exiting = split({ opacity: '1 exit:0' }, {}, 'light', { isExiting: true })
  expect(exiting.style?.opacity).toBe(0)
})

test('lifecycle-only programs expose numeric resting targets to inline drivers', () => {
  const mounted = split({ opacity: 'enter:0', y: 'enter:-3px' })
  expect(mounted.style).toEqual({
    opacity: 1,
    transform: [{ translateY: 0 }],
  })
})

test('component-tier states are skipped, not phantom-attached', () => {
  const result = split({ backgroundColor: 'gray checked:blue' })
  expect(result.style?.backgroundColor).toBe('gray')
  expect(result.programStates?.has('checked') ?? false).toBe(false)
})

test('distinct diagnostic messages each warn once per process', () => {
  const warnings: string[] = []
  const original = console.warn
  const previousNodeEnv = process.env.NODE_ENV
  process.env.NODE_ENV = 'development'
  console.warn = (message: string) => warnings.push(String(message))
  try {
    const props = { width: '1 invalid:2', height: '1 invalid:2' }
    split(props)
    split(props)
    expect(
      warnings.filter((warning) => warning.includes('unknown modifier "invalid"'))
    ).toEqual([expect.stringContaining('width='), expect.stringContaining('height=')])
  } finally {
    console.warn = original
    process.env.NODE_ENV = previousNodeEnv
  }
})

test('the gap family resolves to native numbers', () => {
  const result = split({ gap: '16px hover:24px' })
  expect(result.style?.gap).toBe(16)
})

test('program values run through native fixStyles like plain values', () => {
  // borderWidth programs must receive the borderStyle default
  const result = split({ borderBottomWidth: '1 hover:2' })
  expect(result.style?.borderBottomWidth).toBeTruthy()
  expect(result.style?.borderStyle).toBe('solid')
  expect(result.style).not.toHaveProperty('borderBottomStyle')
})

test('group clauses read the parent group state and register the subscription', () => {
  const value = { backgroundColor: 'red group-hover:blue' }

  // context initial snapshot, before the first subscribed update
  const idle = split(value, {}, 'light', {}, { true: groupEntry({ hover: false }) })
  expect(idle.style?.backgroundColor).toBe('red')
  expect(idle.pseudoGroups?.has('true')).toBe(true)

  const hovered = split(value, {}, 'light', {}, { true: groupEntry({ hover: true }) })
  expect(hovered.style?.backgroundColor).toBe('blue')

  // once subscribed, componentState.group wins over the context snapshot
  const subscribed = split(
    value,
    { group: { true: { pseudo: { hover: true } } } },
    'light',
    {},
    { true: groupEntry({ hover: false }) }
  )
  expect(subscribed.style?.backgroundColor).toBe('blue')
})

test('named group clauses read the named entry; active maps to press', () => {
  const ctx = { card: groupEntry({ press: true }) }
  const result = split({ opacity: '1 group-active/card:0.5' }, {}, 'light', {}, ctx)
  expect(result.style?.opacity).toBe(0.5)
  expect(result.pseudoGroups?.has('card')).toBe(true)
})

test('container clauses measure the nearest container layout', () => {
  const value = { backgroundColor: 'red @sm:blue' }

  // sm is maxWidth 800 in the default config; the container, not the viewport
  const narrow = split(
    value,
    {},
    'light',
    {},
    { '@': groupEntry({}, { width: 400, height: 100 }) }
  )
  expect(narrow.style?.backgroundColor).toBe('blue')

  const wide = split(
    value,
    {},
    'light',
    {},
    { '@': groupEntry({}, { width: 1000, height: 100 }) }
  )
  expect(wide.style?.backgroundColor).toBe('red')

  // registration: the context key subscribes, the size feeds the layout math
  expect(narrow.pseudoGroups?.has('@')).toBe(true)
  expect(narrow.mediaGroups?.has('sm')).toBe(true)
})

test('@ drops a non-size clause while the viewport spelling remains media', () => {
  const context = { '@': groupEntry({}, { width: 400, height: 100 }) }
  const container = split(
    { backgroundColor: 'red @hoverNone:blue' },
    {},
    'light',
    {},
    context
  )
  expect(container.style?.backgroundColor).toBe('red')
  expect(container.pseudoGroups?.size ?? 0).toBe(0)
  expect(container.mediaGroups?.size ?? 0).toBe(0)

  const viewport = split({ backgroundColor: 'red hoverNone:blue' }, {}, 'light', {
    mediaState: { hoverNone: true },
  })
  expect(viewport.style?.backgroundColor).toBe('blue')
  expect(viewport.hasMedia?.has('hoverNone')).toBe(true)
})

test('named container clauses target the named entry and prefer subscribed state', () => {
  const value = { backgroundColor: 'red @sm/card:blue' }

  const byLayout = split(
    value,
    {},
    'light',
    {},
    {
      '@card': groupEntry({}, { width: 500, height: 100 }),
    }
  )
  expect(byLayout.style?.backgroundColor).toBe('blue')
  expect(byLayout.pseudoGroups?.has('@card')).toBe(true)

  // a subscribed media result beats the raw layout snapshot
  const subscribed = split(
    value,
    { group: { '@card': { media: { sm: false } } } },
    'light',
    {},
    { '@card': groupEntry({}, { width: 500, height: 100 }) }
  )
  expect(subscribed.style?.backgroundColor).toBe('red')
})

test('a named container clause measures the named container', () => {
  const value = { opacity: '1 @sm/frame:0.5' }
  const narrow = split(
    value,
    {},
    'light',
    {},
    {
      '@frame': groupEntry({}, { width: 400, height: 100 }),
    }
  )
  expect(narrow.style?.opacity).toBe(0.5)

  const wide = split(
    value,
    {},
    'light',
    {},
    {
      '@frame': groupEntry({}, { width: 1000, height: 100 }),
    }
  )
  expect(wide.style?.opacity).toBe(1)
})

test('a later plain value restates the base on native; the hover survives', () => {
  const idle = split({ backgroundColor: 'red hover:blue', bg: 'green' })
  expect(idle.style?.backgroundColor).toBe('green')

  const hovered = split(
    { backgroundColor: 'red hover:blue', bg: 'green' },
    { hover: true }
  )
  expect(hovered.style?.backgroundColor).toBe('blue')
})

test('direct properties replace styled and variant property programs', () => {
  const Frame = styled(View, {
    bg: 'gray hover:blue',
    p: '4 sm:6',
    variants: {
      tone: {
        danger: {
          bg: 'orange focus:yellow',
        },
      },
    } as const,
  })

  const spread = { bg: 'red', p: '2' } as const
  const callSite = <Frame tone="danger" {...spread} pl="1" />
  const idle = simplifiedGetSplitStyles(Frame, callSite.props, {
    mergeDefaultProps: true,
  })
  expect(idle.style?.backgroundColor).toBe('red')
  expect(idle.style?.paddingLeft).toBe(2)

  const hovered = simplifiedGetSplitStyles(Frame, callSite.props, {
    componentState: { hover: true },
    mergeDefaultProps: true,
  })
  expect(hovered.style?.backgroundColor).toBe('red')

  const focused = simplifiedGetSplitStyles(Frame, callSite.props, {
    componentState: { focus: true },
    mergeDefaultProps: true,
  })
  expect(focused.style?.backgroundColor).toBe('red')

  const responsive = simplifiedGetSplitStyles(Frame, callSite.props, {
    mediaState: { sm: true },
    mergeDefaultProps: true,
  })
  expect(responsive.style?.paddingLeft).toBe(2)

  const variantLastCallSite = <Frame {...{ bg: 'red' }} tone="danger" />
  const variantIdle = simplifiedGetSplitStyles(Frame, variantLastCallSite.props, {
    mergeDefaultProps: true,
  })
  expect(variantIdle.style?.backgroundColor).toBe('red')

  const variantHovered = simplifiedGetSplitStyles(Frame, variantLastCallSite.props, {
    componentState: { hover: true },
    mergeDefaultProps: true,
  })
  expect(variantHovered.style?.backgroundColor).toBe('red')
})

test('textDecoration splits into the three RN longhand props on native', () => {
  const result = getSplitStyles(
    { textDecoration: 'underline dotted red' },
    Text.staticConfig,
    undefined as any,
    'light',
    { unmounted: false } as any,
    { isAnimated: false, noClass: true, resolveValues: 'auto' } as any
  )
  expect(result?.style?.textDecorationLine).toBe('underline')
  expect(result?.style?.textDecorationStyle).toBe('dotted')
  expect(result?.style?.textDecorationColor).toBe('red')
})

test('logical border shorthands are diagnosed and dropped on native', () => {
  // RN has no logical border properties; the physical mapping depends on
  // writing mode, so nothing is silently approximated
  const result = split({ borderBlock: '1px solid green' })
  expect(result?.style?.borderBlockStartWidth).toBeUndefined()
  expect(result?.style?.borderTopWidth).toBeUndefined()
})

test('a call-site property program replaces the styled property program on native', () => {
  const Frame = styled(View, {
    backgroundColor: 'gray hover:blue',
  })
  const rest = simplifiedGetSplitStyles(
    Frame,
    { backgroundColor: 'red' },
    { mergeDefaultProps: true }
  )
  expect(rest.style?.backgroundColor).toBe('red')

  const hovered = simplifiedGetSplitStyles(
    Frame,
    { backgroundColor: 'red' },
    { componentState: { hover: true }, mergeDefaultProps: true }
  )
  expect(hovered.style?.backgroundColor).toBe('red')
})

test('an inactive call-site shorthand program clears every styled longhand', () => {
  const Frame = styled(View, {
    border: '1px solid red',
    textDecoration: 'underline dotted red',
  })
  const result = simplifiedGetSplitStyles(
    Frame,
    {
      border: 'hover:2px dashed blue',
      textDecoration: 'hover:line-through wavy blue',
    },
    { mergeDefaultProps: true }
  )

  const style = result.style || {}
  expect(style).not.toHaveProperty('borderTopWidth')
  expect(style).not.toHaveProperty('borderStyle')
  expect(style).not.toHaveProperty('borderTopColor')
  expect(style).not.toHaveProperty('textDecorationLine')
  expect(style).not.toHaveProperty('textDecorationStyle')
  expect(style).not.toHaveProperty('textDecorationColor')
})

test('geometric shorthand payloads distribute by slot on native', () => {
  const result = split({ p: '4 8' })
  // space tokens: 4 = 18, 8 = 46 in the default test config
  expect(result.style?.paddingTop).toBe(18)
  expect(result.style?.paddingRight).toBe(46)
  expect(result.style?.paddingBottom).toBe(18)
  expect(result.style?.paddingLeft).toBe(46)
})

test('variant props resolve each conditional flat-value branch on native', () => {
  const Frame = styled(View, {
    variants: {
      density: {
        compact: { height: 20, paddingHorizontal: 8 },
        roomy: { height: 40, paddingHorizontal: 16 },
      },
    } as const,
  })

  const compact = simplifiedGetSplitStyles(
    Frame,
    { density: 'compact sm:roomy' },
    {
      mergeDefaultProps: true,
    }
  )
  expect(compact.style?.height).toBe(20)
  expect(compact.style?.paddingLeft).toBe(8)

  const roomy = simplifiedGetSplitStyles(
    Frame,
    { density: 'compact sm:roomy' },
    {
      mediaState: { sm: true },
      mergeDefaultProps: true,
    }
  )
  expect(roomy.style?.height).toBe(40)
  expect(roomy.style?.paddingLeft).toBe(16)
})

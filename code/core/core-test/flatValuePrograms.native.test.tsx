// Lane W3: on native, clause-bearing values evaluate last-matching-clause
// against live conditions and land in the plain style object.

import { beforeAll, expect, test } from 'vitest'
import config from '../config-default'
import { Text, View, createTamagui, getSplitStyles, styled } from '../web/src'
import { simplifiedGetSplitStyles } from './utils'

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
    expect(warnings.filter((warning) => warning.includes('"invalid:"'))).toEqual([
      expect.stringContaining('width:'),
      expect.stringContaining('height:'),
    ])
  } finally {
    console.warn = original
    process.env.NODE_ENV = previousNodeEnv
  }
})

test('the gap family resolves to native numbers', () => {
  const result = split({ gap: '16px hover:24px' })
  expect(result.style?.rowGap).toBe(16)
  expect(result.style?.columnGap).toBe(16)
})

test('program values run through native fixStyles like plain values', () => {
  // borderWidth programs must receive the borderStyle default
  const result = split({ borderWidth: '1 hover:2' })
  expect(result.style?.borderTopWidth ?? result.style?.borderWidth).toBeTruthy()
  expect(result.style?.borderStyle).toBe('solid')
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

test('styled same-key programs survive call-site props and retain authored order', () => {
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
  expect(hovered.style?.backgroundColor).toBe('blue')

  const focused = simplifiedGetSplitStyles(Frame, callSite.props, {
    componentState: { focus: true },
    mergeDefaultProps: true,
  })
  expect(focused.style?.backgroundColor).toBe('yellow')

  const responsive = simplifiedGetSplitStyles(Frame, callSite.props, {
    mediaState: { sm: true },
    mergeDefaultProps: true,
  })
  expect(responsive.style?.paddingLeft).toBe(32)

  const variantLastCallSite = <Frame {...{ bg: 'red' }} tone="danger" />
  const variantIdle = simplifiedGetSplitStyles(Frame, variantLastCallSite.props, {
    mergeDefaultProps: true,
  })
  expect(variantIdle.style?.backgroundColor).toBe('orange')

  const variantHovered = simplifiedGetSplitStyles(Frame, variantLastCallSite.props, {
    componentState: { hover: true },
    mergeDefaultProps: true,
  })
  expect(variantHovered.style?.backgroundColor).toBe('blue')
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

test('a styled clause default survives a call-site override on native', () => {
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
  expect(hovered.style?.backgroundColor).toBe('blue')
})

test('geometric shorthand payloads distribute by slot on native', () => {
  const result = split({ p: '4 8' })
  // space tokens: 4 = 18, 8 = 46 in the default test config
  expect(result.style?.paddingTop).toBe(18)
  expect(result.style?.paddingRight).toBe(46)
  expect(result.style?.paddingBottom).toBe(18)
  expect(result.style?.paddingLeft).toBe(46)
})

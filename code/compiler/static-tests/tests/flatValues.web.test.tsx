// decision 24: when every contribution is static, the compiler emits a plain
// element with program classes and skips the runtime component entirely. The
// extractor rides the same getSplitStyles pipeline as the runtime, so program
// lowering and class identity come from one implementation.
import * as React from 'react'
import { createRequire } from 'node:module'
import { expect, test } from 'vitest'
import {
  flatValuePrecedenceFixtures,
  reverseFixtureProgram,
  type FlatValueFixtureConditions,
  type FlatValuePrecedenceFixture,
} from '../../../core/core-test/flatValuePrecedenceFixtures'

import { extractForWeb } from './lib/extract'

window['React'] = React
const hostCore = createRequire(import.meta.url)(
  '@tamagui/core'
) as typeof import('@tamagui/core')

const extract = (jsx: string) =>
  extractForWeb(
    `
    import { View } from '@tamagui/core'
    export function Test() {
      return (
        ${jsx}
      )
    }
  `,
    {
      options: {
        platform: 'web',
        components: ['@tamagui/core'],
      },
    }
  )

const fixtureGroupEntry = (
  pseudo: Record<string, boolean> = {},
  layout?: { width: number; height: number }
) => ({
  subscribe: () => () => {},
  state: { pseudo, layout },
})

function runtimeFixtureOptions(active: FlatValueFixtureConditions) {
  const groupContext: Record<string, any> = {}
  const componentGroups: Record<string, any> = {}
  for (const group of active.groups ?? []) {
    const match = /^group-([^/]+)(?:\/(.+))?$/.exec(group)
    if (match) {
      groupContext[match[2] ?? 'true'] = fixtureGroupEntry({
        [match[1] === 'active' ? 'press' : match[1]]: true,
      })
    }
  }
  for (const container of active.containers ?? []) {
    const match = /^@[^/]+(?:\/(.+))?$/.exec(container)
    const key = match?.[1] ? `@${match[1]}` : '@'
    groupContext[key] = fixtureGroupEntry({}, { width: 400, height: 100 })
    componentGroups[key] = { media: { [container.slice(1).split('/')[0]]: true } }
  }
  return {
    groupContext,
    state: {
      focus: false,
      focusVisible: false,
      focusWithin: false,
      hover: false,
      unmounted: false,
      press: false,
      pressIn: false,
      disabled: false,
      ...Object.fromEntries(
        (active.states ?? []).map((state) => [state === 'active' ? 'press' : state, true])
      ),
      group: componentGroups,
    },
    styleProps: {
      isAnimated: false,
      mediaState: Object.fromEntries((active.media ?? []).map((name) => [name, true])),
      noClass: true,
      resolveValues: 'auto',
    },
    themeName: active.themes?.at(-1) ?? 'light',
  }
}

function fixtureSource(fixture: FlatValuePrecedenceFixture, reversed: boolean) {
  let componentName = 'View'
  const declarations: string[] = []
  const props: string[] = []
  for (const [index, layer] of fixture.layers.entries()) {
    const value = reversed ? reverseFixtureProgram(layer.value) : layer.value
    if (layer.source === 'styled') {
      const nextName = `Fixture${index}`
      declarations.push(
        `const ${nextName} = styled(${componentName}, { ${fixture.property}: ${JSON.stringify(value)} })`
      )
      componentName = nextName
    } else {
      props.push(`${fixture.property}=${JSON.stringify(value)}`)
    }
  }
  return `
    import { View, styled } from '@tamagui/core'
    ${declarations.join('\n')}
    export function Test() {
      return <${componentName} ${props.join(' ')} />
    }
  `
}

const extractFixture = (fixture: FlatValuePrecedenceFixture, reversed: boolean) =>
  extractForWeb(fixtureSource(fixture, reversed), {
    options: {
      platform: 'web',
      components: ['@tamagui/core'],
    },
  })

test('a clause-bearing string flattens to a plain element with a program class', async () => {
  const output = await extract(`<View width={10} backgroundColor="red hover:blue" />`)
  expect(output?.js).toContain('<div')
  const compilerClass = output?.js.match(/_b-\d+/)?.[0]
  expect(compilerClass).toBeTruthy()
  expect(output?.js).not.toContain('<View')
  expect(output?.styles).toContain('background-color:red')
  expect(output?.styles).toMatch(/_b-\d+:where\(:hover\)\{background-color:blue\}/)

  const config = hostCore.getConfig()
  const themeName = Object.keys(config.themes)[0] ?? ''
  const runtime = hostCore.getSplitStyles(
    { width: 10, backgroundColor: 'red hover:blue' },
    hostCore.View.staticConfig,
    config.themes[themeName] ?? {},
    themeName,
    {
      focus: false,
      focusVisible: false,
      focusWithin: false,
      hover: false,
      unmounted: true,
      press: false,
      pressIn: false,
      disabled: false,
    },
    {
      resolveValues: 'variable',
      noClass: false,
      isAnimated: false,
    }
  )
  expect(Object.values(runtime.classNames)).toContain(compilerClass)
  const runtimeRules = runtime.rulesToInsert[compilerClass!]?.[4] ?? []
  expect(runtimeRules).toHaveLength(2)
  for (const rule of runtimeRules) {
    expect(output?.styles).toContain(rule)
  }
})

test('a flat conditional object flattens exactly like its clause string', async () => {
  const objectOut = await extract(
    `<View width={10} backgroundColor={{ default: 'red', hover: 'blue' }} />`
  )
  const stringOut = await extract(`<View width={10} backgroundColor="red hover:blue" />`)
  expect(objectOut?.js).toContain('<div')
  expect(objectOut?.js).not.toContain('<View')
  // identical CSS and class identity: the object is the same program
  expect(objectOut?.styles).toBe(stringOut?.styles)
  expect(objectOut?.js.match(/_b-\d+/)?.[0]).toBe(stringOut?.js.match(/_b-\d+/)?.[0])
})

test('token payloads and media clauses lower statically', async () => {
  const output = await extract(`<View padding="4 sm:6" />`)
  expect(output?.js).toContain('<div')
  expect(output?.js).toContain('_p-')
  expect(output?.styles).toContain('var(--')
  expect(output?.styles).toContain('@media')
})

test('theme clauses lower to the is-or-within selector statically', async () => {
  const output = await extract(`<View backgroundColor="red dark:blue" />`)
  expect(output?.js).toContain('<div')
  expect(output?.styles).toContain(':where(.t_dark, .t_dark *)')
})

test('web platform clauses compile above the deepest platform-less clause', async () => {
  const output = await extract(`<View backgroundColor="sm:hover:blue web:red" />`)
  const className = output?.js.match(/_b-\d+/)?.[0]
  expect(className).toBeTruthy()
  expect(output?.styles.indexOf('background-color:blue')).toBeLessThan(
    output!.styles.indexOf('background-color:red')
  )
  const webRule = output?.styles.match(
    new RegExp(`((?:\\.${className})+)\\{background-color:red\\}`)
  )?.[1]
  expect(webRule).toBe(`.${className}`)
})

test('transform axis programs carry their composition class', async () => {
  const output = await extract(`<View x="0px hover:10px" />`)
  expect(output?.js).toContain('<div')
  expect(output?.styles).toContain('--t-x')
  // the shared rule consuming the axis variables must ride along
  expect(output?.styles).toContain('translate:')
})

test('transform axis programs with transition carry their composition class and transition class', async () => {
  const output = await extract(
    `<View transition="medium" x="0px sm:20px lg:-50px" y="20px" />`
  )
  expect(output?.styles).toContain('--t-x')
  expect(output?.styles).toContain('--t-y')
  expect(output?.styles).toContain('translate:')
  expect(output?.styles).toContain('transition:')

  // Both the transition class and the translate composition class must be in JS className
  expect(output?.js).toMatch(/_t-\d+/)
  expect(output?.js).toContain('_t-compose')
  expect(output?.js).toContain('_tx-')
  expect(output?.js).toContain('_ty-')
})

test('minW and maxW co-occurrence preserves both classes and rules in compiled output', async () => {
  const output = await extract(`<View minW="300px" maxW="480px" />`)
  expect(output?.styles).toContain('min-width:300px')
  expect(output?.styles).toContain('max-width:480px')

  // Both distinct _mw- classes must be in the compiled className
  expect(output?.js).toMatch(/_mw-\d+.*_mw-\d+/)
})

test('minH and maxH co-occurrence preserves both classes and rules in compiled output', async () => {
  const output = await extract(`<View minH="200px" maxH="500px" />`)
  expect(output?.styles).toContain('min-height:200px')
  expect(output?.styles).toContain('max-height:500px')

  // Both distinct _mh- classes must be in the compiled className
  expect(output?.js).toMatch(/_mh-\d+.*_mh-\d+/)
})

test('strict hashes preserve both sides of an abbreviated property collision', async () => {
  const output = await extract(`<View minWidth="3302519px" maxWidth="10042770px" />`)
  const classes = output?.js.match(/_mw-\d+/g) ?? []

  expect(classes).toHaveLength(2)
  expect(new Set(classes).size).toBe(2)
  expect(output?.styles).toContain('min-width:3302519px')
  expect(output?.styles).toContain('max-width:10042770px')
})

test('same-property overrides resolve before generated identifiers are concatenated', async () => {
  const output = await extractForWeb(
    `
    import { View, styled } from '@tamagui/core'
    const Sized = styled(View, { width: '100px' })
    export function Test() {
      return <Sized width="200px" />
    }
  `,
    {
      options: {
        platform: 'web',
        components: ['@tamagui/core'],
      },
    }
  )

  expect(output?.js.match(/_w-\d+/g)).toHaveLength(1)
  expect(output?.styles).toContain('width:200px')
  expect(output?.styles).not.toContain('width:100px')
})

test('a dynamic clause string bails to the runtime component', async () => {
  const output = await extractForWeb(
    `
    import { View } from '@tamagui/core'
    export function Test(props) {
      return (
        <View backgroundColor={props.value} />
      )
    }
  `,
    {
      options: {
        platform: 'web',
        components: ['@tamagui/core'],
      },
    }
  )
  expect(output?.js).toContain('backgroundColor={props.value}')
})

test('the shared precedence table compiles with runtime-identical CSS order and specificity', async () => {
  const config = hostCore.getConfig()
  const snapshots: Record<string, string> = {}

  for (const fixture of flatValuePrecedenceFixtures) {
    for (const reversed of [false, true]) {
      const output = await extractFixture(fixture, reversed)
      const label = `${fixture.id}-${reversed ? 'reversed' : 'forward'}`
      expect(output?.js, label).toContain('<div')
      if (fixture.id === 11) {
        // Both clauses are inactive in a web build and are dropped statically.
        expect(output?.styles, label).toBe('')
      } else {
        expect(output?.styles, label).toBeTruthy()
      }
      snapshots[label] = output!.styles

      const styledLayer = fixture.layers.some((layer) => layer.source === 'styled')
      if (styledLayer) {
        expect(output?.styles, label).not.toContain('flex-direction:row')
      }
      const propLayer = fixture.layers.find((layer) => layer.source === 'prop')!
      const value = reversed ? reverseFixtureProgram(propLayer.value) : propLayer.value
      const runtime = hostCore.getSplitStyles(
        { [fixture.property]: value },
        hostCore.View.staticConfig,
        config.themes.light ?? {},
        'light',
        {
          focus: false,
          focusVisible: false,
          focusWithin: false,
          hover: false,
          unmounted: false,
          press: false,
          pressIn: false,
          disabled: false,
        },
        {
          resolveValues: 'auto',
          noClass: false,
          isAnimated: false,
        }
      )
      const className = runtime.classNames[fixture.property]
      for (const rule of runtime.rulesToInsert[className]?.[4] ?? []) {
        expect(output?.styles, `${label}: ${rule}`).toContain(rule)
      }

      for (const scenario of fixture.scenarios) {
        if (scenario.active.platform === 'ios') continue
        const options = runtimeFixtureOptions(scenario.active)
        const propLayer = fixture.layers.find((layer) => layer.source === 'prop')
        if (!propLayer || styledLayer) continue
        const value = reversed ? reverseFixtureProgram(propLayer.value) : propLayer.value
        const runtime = hostCore.getSplitStyles(
          { [fixture.property]: value },
          hostCore.View.staticConfig,
          config.themes[options.themeName] ?? config.themes.light ?? {},
          options.themeName,
          options.state,
          options.styleProps,
          undefined,
          undefined,
          options.groupContext
        )
        expect(runtime.style?.[fixture.property], label).toBe(
          reversed ? (scenario.reversedExpected ?? scenario.expected) : scenario.expected
        )
      }
    }
  }

  expect(snapshots).toMatchSnapshot()
})

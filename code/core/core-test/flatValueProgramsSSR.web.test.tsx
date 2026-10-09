process.env.TAMAGUI_TARGET = 'web'

import { act } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { renderToString } from 'react-dom/server'
import { afterEach, beforeAll, describe, expect, test, vi } from 'vitest'
import config from '../config-default'
import {
  TamaguiProvider,
  Text,
  View,
  createTamagui,
  getSplitStyles,
  styled,
} from '../web/src'
import {
  flatValuePrecedenceFixtures,
  reverseFixtureProgram,
  type FlatValueFixtureConditions,
  type FlatValuePrecedenceFixture,
} from './flatValuePrecedenceFixtures'
import { exposeClassProperties, simplifiedGetSplitStyles } from './utils'

const opts = { isAnimated: false, noClass: false, resolveValues: 'auto' } as any

const split = (props: Record<string, any>) =>
  exposeClassProperties(
    getSplitStyles(
      props,
      Text.staticConfig,
      undefined as any,
      'light',
      { unmounted: false } as any,
      opts
    )
  )

const rulesFor = (result: any, identifier: string): string[] =>
  result.rulesToInsert[identifier]?.[4] ?? []

const occurrences = (text: string, value: string): number => text.split(value).length - 1

function styleResourceCount(html: string, identifier: string): number {
  const host = document.createElement('div')
  host.innerHTML = html
  return [...host.querySelectorAll('style[data-href]')]
    .flatMap((style) => style.getAttribute('data-href')?.split(/\s+/) ?? [])
    .filter((href) => href === `t_${identifier}`).length
}

const fixtureGroupEntry = (
  pseudo: Record<string, boolean> = {},
  layout?: { width: number; height: number }
) => ({
  subscribe: () => () => {},
  state: { pseudo, layout },
})

function fixtureOptions(active: FlatValueFixtureConditions, noClass: boolean) {
  const groupContext: Record<string, any> = {}
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
    groupContext[match?.[1] ? `@${match[1]}` : '@'] = fixtureGroupEntry(
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
    noClass,
    themeName: active.themes?.at(-1) ?? 'light',
  }
}

function fixtureComponent(
  fixture: FlatValuePrecedenceFixture,
  reversed: boolean
): { Component: any; props: Record<string, string> } {
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
  return { Component, props }
}

beforeAll(() => {
  ;(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true
})

afterEach(() => {
  vi.unstubAllEnvs()
  vi.restoreAllMocks()
})

describe('flat value program SSR', () => {
  test('the shared precedence table evaluates identically and emits its program blocks during SSR', () => {
    const serverConfig = createTamagui(config.getDefaultTamaguiConfig() as any)

    for (const fixture of flatValuePrecedenceFixtures) {
      for (const scenario of fixture.scenarios) {
        if (scenario.active.platform === 'ios') continue
        for (const reversed of [false, true]) {
          const { Component, props } = fixtureComponent(fixture, reversed)
          const expected = reversed
            ? (scenario.reversedExpected ?? scenario.expected)
            : scenario.expected
          const inline = simplifiedGetSplitStyles(
            Component,
            props,
            fixtureOptions(scenario.active, true)
          )
          expect(inline.style?.[fixture.property], `fixture ${fixture.id}`).toBe(expected)

          const emitted = simplifiedGetSplitStyles(
            Component,
            props,
            fixtureOptions(scenario.active, false)
          )
          const className = emitted.classNames[fixture.property]
          const rules = rulesFor(emitted, className)
          const html = renderToString(
            <TamaguiProvider
              config={serverConfig}
              defaultTheme={scenario.active.themes?.at(-1) ?? 'light'}
              disableInjectCSS
            >
              <Component {...props} />
            </TamaguiProvider>
          )
          expect(html, `fixture ${fixture.id}`).toContain(className)
          for (const rule of rules) {
            expect(html, `fixture ${fixture.id}: ${rule}`).toContain(rule)
          }
        }
      }
    }
  })

  test('does not ship config revision diagnostics in production', () => {
    vi.stubEnv('NODE_ENV', 'production')
    const productionConfig = createTamagui(config.getDefaultTamaguiConfig() as any)
    const html = renderToString(
      <TamaguiProvider config={productionConfig} defaultTheme="light" disableInjectCSS>
        <div>production content</div>
      </TamaguiProvider>
    )

    expect(html).not.toContain('data-tamagui-config-revision')
  })

  test('names the config inputs that differ between server and hydration', async () => {
    const base = config.getDefaultTamaguiConfig() as any
    const serverConfig = createTamagui({
      ...base,
      themes: {
        light: { background: 'red' },
        light_alt: { background: 'pink' },
      },
    })
    const html = renderToString(
      <TamaguiProvider config={serverConfig} defaultTheme="light" disableInjectCSS>
        <div>revision diagnostic</div>
      </TamaguiProvider>
    )
    const container = document.createElement('div')
    container.innerHTML = html
    document.body.appendChild(container)

    const clientConfig = createTamagui({
      ...base,
      themes: {
        light: { color: 'black' },
      },
    })
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    let root: ReturnType<typeof hydrateRoot>

    await act(async () => {
      root = hydrateRoot(
        container,
        <TamaguiProvider config={clientConfig} defaultTheme="light" disableInjectCSS>
          <div>revision diagnostic</div>
        </TamaguiProvider>
      )
      await new Promise((resolve) => setTimeout(resolve, 0))
    })

    expect(
      consoleError.mock.calls
        .flat()
        .map(String)
        .find((message) =>
          message.includes('Server/client config revision mismatch during hydration')
        )
    ).toMatch(/server ".+", client ".+".*themeNames, themeVariables/)

    await act(async () => {
      root.unmount()
    })
    container.remove()
  })

  test('hydrates deterministic contiguous blocks and dedupes late insertion', async () => {
    const serverConfig = createTamagui(config.getDefaultTamaguiConfig() as any)
    const initialProps = {
      backgroundColor: 'red hover:blue',
      p: '4 sm:6',
    }
    const serverTree = (
      <TamaguiProvider config={serverConfig} defaultTheme="light" disableInjectCSS>
        <View data-testid="initial" {...initialProps} />
      </TamaguiProvider>
    )
    const html = renderToString(serverTree)
    const container = document.createElement('div')
    container.innerHTML = html

    const serverSplit = split(initialProps)
    const programClasses = [
      serverSplit.classNames.backgroundColor,
      serverSplit.classNames.padding,
    ]

    for (const className of programClasses) {
      expect(className).toMatch(/^_/)
      expect(styleResourceCount(html, className), className).toBe(1)
      expect(
        occurrences(html, rulesFor(serverSplit, className).join('\n')),
        className
      ).toBe(1)
    }

    // a separate config object with identical content models the client process.
    // its content-derived config revision must produce the server's class names.
    const clientConfig = createTamagui(config.getDefaultTamaguiConfig() as any)
    const clientSplit = split(initialProps)
    expect(clientConfig).not.toBe(serverConfig)
    expect(clientSplit.classNames).toMatchObject(serverSplit.classNames)

    const clientTree = (
      <TamaguiProvider config={clientConfig} defaultTheme="light" disableInjectCSS>
        <View data-testid="initial" {...initialProps} />
      </TamaguiProvider>
    )
    document.body.appendChild(container)
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    const insertRule = vi
      .spyOn(CSSStyleSheet.prototype, 'insertRule')
      .mockImplementation(() => 0)
    const insertedRules = (identifier: string) =>
      insertRule.mock.calls
        .map(([rule]) => String(rule))
        .filter((rule) => rule.includes(`.${identifier}`))
    let root: ReturnType<typeof hydrateRoot>

    await act(async () => {
      root = hydrateRoot(container, clientTree)
      await new Promise((resolve) => setTimeout(resolve, 0))
    })

    expect(consoleError).not.toHaveBeenCalled()
    for (const className of programClasses) {
      expect(insertedRules(className), className).toEqual(
        rulesFor(clientSplit, className)
      )
      expect(styleResourceCount(container.innerHTML, className), className).toBe(1)
    }

    const lateProps = {
      backgroundColor: 'red hover:blue',
      opacity: '0.25 hover:0.75',
    }
    const lateSplit = split(lateProps)
    const sharedClass = clientSplit.classNames.backgroundColor
    const lateClass = lateSplit.classNames.opacity
    const sharedRules = insertedRules(sharedClass)

    await act(async () => {
      root.render(
        <TamaguiProvider config={clientConfig} defaultTheme="light" disableInjectCSS>
          <View data-testid="initial" {...initialProps} />
          <Text data-testid="late" {...lateProps} />
        </TamaguiProvider>
      )
      await new Promise((resolve) => setTimeout(resolve, 0))
    })

    expect(container.querySelector('[data-testid="late"]')).not.toBeNull()
    expect(insertedRules(sharedClass)).toEqual(sharedRules)
    expect(insertedRules(lateClass)).toEqual(rulesFor(lateSplit, lateClass))
    expect(consoleError).not.toHaveBeenCalled()

    await act(async () => {
      root.unmount()
    })
    container.remove()
  })
})

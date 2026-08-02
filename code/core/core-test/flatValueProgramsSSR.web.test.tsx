process.env.TAMAGUI_TARGET = 'web'

import { act } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { renderToString } from 'react-dom/server'
import { afterEach, beforeAll, describe, expect, test, vi } from 'vitest'
import config from '../config-default'
import { TamaguiProvider, Text, View, createTamagui, getSplitStyles } from '../web/src'

const opts = { isAnimated: false, noClass: false, resolveValues: 'auto' } as any

const split = (props: Record<string, any>) =>
  getSplitStyles(
    props,
    Text.staticConfig,
    undefined as any,
    'light',
    { unmounted: false } as any,
    opts
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

beforeAll(() => {
  ;(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true
})

afterEach(() => {
  vi.unstubAllEnvs()
  vi.restoreAllMocks()
})

describe('flat value program SSR', () => {
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
      serverSplit.classNames.paddingTop,
      serverSplit.classNames.paddingRight,
      serverSplit.classNames.paddingBottom,
      serverSplit.classNames.paddingLeft,
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

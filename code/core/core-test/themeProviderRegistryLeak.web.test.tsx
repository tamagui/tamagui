process.env.TAMAGUI_TARGET = 'web'

import { getDefaultTamaguiConfig } from '@tamagui/config-default'
import {
  createTamagui,
  getThemeProviderChainSizes,
  TamaguiProvider,
  Theme,
} from '@tamagui/core'
import { ThemeUpdate } from '@tamagui/web/theme-update'
import { render } from '@testing-library/react'
import { StrictMode } from 'react'
import { createPortal } from 'react-dom'
import { describe, expect, test } from 'vitest'

const conf = createTamagui(getDefaultTamaguiConfig())

// the portal-bridge chain (inlineThemeLayers + themeProviderParents) is keyed by
// a per-mount useId, so nothing ever reuses a retired entry: anything left in
// either map after unmount is retained for the life of the process.
const mountAndUnmount = (times: number, ui: () => any, strict = false) => {
  for (let i = 0; i < times; i++) {
    const rendered = render(strict ? <StrictMode>{ui()}</StrictMode> : ui())
    rendered.unmount()
  }
}

const ROUNDS = 25

describe('theme provider chain registry', () => {
  test('a plain <Theme> retains nothing after unmount', () => {
    const before = getThemeProviderChainSizes()
    mountAndUnmount(ROUNDS, () => (
      <TamaguiProvider config={conf} defaultTheme="light">
        <Theme name="dark">
          <Theme name="blue">hi</Theme>
        </Theme>
      </TamaguiProvider>
    ))
    expect(getThemeProviderChainSizes()).toEqual(before)
  })

  test('a <ThemeUpdate> retains nothing after unmount', () => {
    const before = getThemeProviderChainSizes()
    mountAndUnmount(ROUNDS, () => (
      <TamaguiProvider config={conf} defaultTheme="light">
        <Theme name="dark">
          <ThemeUpdate background="#0b2545">hi</ThemeUpdate>
        </Theme>
      </TamaguiProvider>
    ))
    expect(getThemeProviderChainSizes()).toEqual(before)
  })

  test('a portaled <Theme> subtree retains nothing after unmount', () => {
    const before = getThemeProviderChainSizes()
    mountAndUnmount(ROUNDS, () => (
      <TamaguiProvider config={conf} defaultTheme="light">
        <Theme name="dark">
          <ThemeUpdate background="#0b2545">
            {createPortal(
              <Theme name="light">
                <ThemeUpdate background="#ffffff">portaled</ThemeUpdate>
              </Theme>,
              document.body
            )}
          </ThemeUpdate>
        </Theme>
      </TamaguiProvider>
    ))
    expect(getThemeProviderChainSizes()).toEqual(before)
  })

  test('strict mode double-invocation retains nothing after unmount', () => {
    const before = getThemeProviderChainSizes()
    mountAndUnmount(
      ROUNDS,
      () => (
        <TamaguiProvider config={conf} defaultTheme="light">
          <Theme name="dark">
            <ThemeUpdate background="#0b2545">
              <Theme name="blue">hi</Theme>
            </ThemeUpdate>
          </Theme>
        </TamaguiProvider>
      ),
      true
    )
    expect(getThemeProviderChainSizes()).toEqual(before)
  })
})

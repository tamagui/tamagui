// dev bundlers stamp source-location props onto every element (One writes
// `data-one-source` on web and `srcloc` on native). <Theme> must not read
// those as inline theme values, while a real unknown key still warns.
process.env.TAMAGUI_TARGET = 'web'

import { getDefaultTamaguiConfig } from '@tamagui/config-default'
import { TamaguiProvider, Theme, View, createTamagui } from '@tamagui/core'
import { render } from '@testing-library/react'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'

const conf = createTamagui(getDefaultTamaguiConfig())
const previousEnv = process.env.NODE_ENV

let warn: ReturnType<typeof vi.spyOn>

beforeEach(() => {
  process.env.NODE_ENV = 'development'
  warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
})

afterEach(() => {
  warn.mockRestore()
  process.env.NODE_ENV = previousEnv
})

const inlineWarnings = () =>
  warn.mock.calls.filter((call) =>
    call.some(
      (arg) => typeof arg === 'string' && arg.includes('no longer accepts inline values')
    )
  )

test('bundler source-location props on Theme do not warn', () => {
  const extra = { 'data-one-source': 'app/page.tsx:12', srcloc: 'app/page.tsx:12' }
  render(
    <TamaguiProvider config={conf} defaultTheme="light">
      <Theme name="dark" {...extra}>
        <View />
      </Theme>
    </TamaguiProvider>
  )
  expect(inlineWarnings()).toEqual([])
})

test('a real unknown Theme prop still warns once', () => {
  const extra = { background: 'red' } as Record<string, unknown>
  render(
    <TamaguiProvider config={conf} defaultTheme="light">
      <Theme name="dark" {...extra}>
        <View />
      </Theme>
    </TamaguiProvider>
  )
  expect(inlineWarnings().length).toBeGreaterThanOrEqual(1)
  expect(String(inlineWarnings()[0]![1] ?? inlineWarnings()[0]![0])).toContain(
    'background'
  )
})

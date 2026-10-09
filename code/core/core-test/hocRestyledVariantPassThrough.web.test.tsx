process.env.TAMAGUI_TARGET = 'web'

// styled() over a skinned behavior HOC renders the HOC directly and resolves
// the skin's variants itself. those variants must not also pass through to the
// HOC, or the wrapped frame gets them as dom attributes (a skin's `size`
// reached the host as `size="true"`). the frame's own variants still pass.
import { render } from '@testing-library/react'
import React from 'react'
import { afterEach, expect, test, vi } from 'vitest'

import { getDefaultTamaguiConfig } from '../config-default'
import {
  TamaguiProvider,
  View,
  createStyledContext,
  createStyledHOC,
  createTamagui,
  styled,
} from '../web/src'

const config = createTamagui(getDefaultTamaguiConfig('web'))

const Frame = styled(View, {
  variants: {
    tone: {
      loud: { opacity: 0.5 },
    },
  } as const,
})

const received: Record<string, unknown>[] = []

const Behavior = createStyledHOC(Frame, (props: any, ref: any) => {
  received.push(props)
  return <Frame ref={ref} {...props} />
})

const SkinContext = createStyledContext<{ size?: 'md' | true }>({ size: 'md' })

const Skin = styled(Behavior, {
  context: SkinContext,
  variants: {
    size: {
      md: { padding: 4 },
      true: { padding: 4 },
    },
  } as const,
  defaultVariants: { size: 'md' },
})

const Restyled = styled(Skin, { margin: 2 })

afterEach(() => {
  received.length = 0
  vi.restoreAllMocks()
})

function renderInSkin(element: React.ReactElement) {
  const { container } = render(
    <TamaguiProvider config={config} defaultTheme="light">
      <SkinContext.Provider size>{element}</SkinContext.Provider>
    </TamaguiProvider>
  )
  return container.querySelector('[data-testid="probe"]') as HTMLElement
}

test('a restyled skin resolves its context variant without passing it to the behavior', () => {
  const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
  const node = renderInSkin(<Restyled testID="probe" />)

  expect(node).toBeTruthy()
  expect(received.length).toBeGreaterThan(0)
  expect(received.every((props) => !('size' in props))).toBe(true)
  expect(
    consoleError.mock.calls.filter((args) => String(args[0]).includes('non-boolean'))
  ).toEqual([])
})

test('a restyled skin still passes the frame variant through the behavior', () => {
  renderInSkin(<Restyled testID="probe" tone="loud" />)

  expect(received.some((props) => props.tone === 'loud')).toBe(true)
})

test('nested restyled skins resolve both layers while passing the frame variant', () => {
  const NestedSkin = styled(Restyled, {
    variants: {
      density: {
        compact: { padding: 2 },
      },
    } as const,
    defaultVariants: { density: 'compact' },
  })
  const NestedRestyled = styled(NestedSkin, { margin: 1 })
  const node = renderInSkin(<NestedRestyled testID="probe" tone="loud" />)

  expect(node).toBeTruthy()
  expect(received.length).toBeGreaterThan(0)
  expect(received.every((props) => !('size' in props) && !('density' in props))).toBe(
    true
  )
  expect(received.some((props) => props.tone === 'loud')).toBe(true)
})

test('a restyled HOC forwards disabled behavior without a disabled skin variant', () => {
  const WrappedControl = styled(Behavior, { opacity: 'disabled:0.4' })
  const rendered = render(
    <TamaguiProvider config={config} defaultTheme="light">
      <WrappedControl testID="disabled-control" disabled />
    </TamaguiProvider>
  )
  expect(received.at(-1)?.disabled).toBe(true)
  rendered.rerender(
    <TamaguiProvider config={config} defaultTheme="light">
      <WrappedControl testID="disabled-control" disabled={false} />
    </TamaguiProvider>
  )
  expect(received.at(-1)?.disabled).toBe(false)
})

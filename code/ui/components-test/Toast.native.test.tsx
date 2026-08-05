import { getDefaultTamaguiConfig } from '@tamagui/config-default'
import { TamaguiProvider, createTamagui } from '@tamagui/core'
import { getPortal } from '@tamagui/native'
import { PortalProvider } from '@tamagui/portal'
import { toast, Toaster, useToasts } from '@tamagui/toast/v2'
import * as React from 'react'
import type { ReactNode } from 'react'
import TestRenderer, { act } from 'react-test-renderer'
import { afterEach, describe, expect, test } from 'vitest'

const conf = createTamagui(getDefaultTamaguiConfig())

let rendered: TestRenderer.ReactTestRenderer | null = null

afterEach(async () => {
  toast.dismiss()
  getPortal().set({ enabled: false, type: null })
  await act(async () => {
    rendered?.unmount()
  })
  rendered = null
})

async function renderNative(element: React.ReactElement) {
  await act(async () => {
    rendered = TestRenderer.create(
      <TamaguiProvider config={conf} defaultTheme="light">
        <PortalProvider shouldAddRootHost>{element}</PortalProvider>
      </TamaguiProvider>
    )
  })

  return rendered!
}

function hasText(tree: TestRenderer.ReactTestRenderer, text: string) {
  return (
    tree.root.findAll((node) => {
      const children = node.props.children
      return Array.isArray(children) ? children.includes(text) : children === text
    }).length > 0
  )
}

class ErrorBoundary extends React.Component<
  { children: ReactNode; onError: (error: Error) => void },
  { error: Error | null }
> {
  state = { error: null }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  componentDidCatch(error: Error) {
    this.props.onError(error)
  }

  render() {
    return this.state.error ? null : this.props.children
  }
}

describe('Toast v2 native context', () => {
  test('keeps Toaster context through the native portal fallback', async () => {
    const tree = await renderNative(<Toaster duration={Number.POSITIVE_INFINITY} />)

    await act(async () => {
      toast('Native portal toast')
    })

    expect(hasText(tree, 'Native portal toast')).toBe(true)
  })

  test('throws a setup error when useToasts is outside Toast', async () => {
    let caught: Error | null = null
    let missingRoot: TestRenderer.ReactTestRenderer | null = null

    function MissingRoot() {
      useToasts()
      return null
    }

    await act(async () => {
      missingRoot = TestRenderer.create(
        <ErrorBoundary onError={(error) => (caught = error)}>
          <MissingRoot />
        </ErrorBoundary>
      )
    })

    expect(caught?.message).toBe('`useToasts` must be used within `Toast`')

    await act(async () => {
      missingRoot?.unmount()
    })
  })
})

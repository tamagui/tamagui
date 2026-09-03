import { getDefaultTamaguiConfig } from '@tamagui/config-default'
import { TamaguiProvider, View, createTamagui } from '@tamagui/core'
import { getPortal } from '@tamagui/native'
import { Portal, PortalProvider } from '@tamagui/portal'
import * as React from 'react'
import TestRenderer, { act } from 'react-test-renderer'
import { afterEach, describe, expect, test } from 'vitest'

const conf = createTamagui(getDefaultTamaguiConfig())

// react-native stores zIndex in a 32-bit int, so anything past this wraps —
// Number.MAX_SAFE_INTEGER lands on -1 and hides the portal behind the app
const MAX_INT32 = 2147483647

let rendered: TestRenderer.ReactTestRenderer | null = null

afterEach(async () => {
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

function zIndicesOf(tree: TestRenderer.ReactTestRenderer) {
  return tree.root
    .findAll(() => true)
    .flatMap((node) => {
      const style = node.props?.style
      const styles = Array.isArray(style) ? style : [style]
      return styles
        .map((s) => s?.zIndex)
        .filter((z): z is number => typeof z === 'number')
    })
}

describe('native Portal zIndex', () => {
  test('clamps an out-of-range zIndex instead of letting it wrap negative', async () => {
    const tree = await renderNative(
      <Portal zIndex={Number.MAX_SAFE_INTEGER}>
        <View testID="portal-child" />
      </Portal>
    )

    const zIndices = zIndicesOf(tree)
    expect(zIndices.length).toBeGreaterThan(0)
    for (const zIndex of zIndices) {
      expect(zIndex).toBeLessThanOrEqual(MAX_INT32)
      expect(zIndex).toBeGreaterThan(0)
    }
    expect(zIndices).toContain(MAX_INT32)
  })

  test('leaves an in-range zIndex untouched', async () => {
    const tree = await renderNative(
      <Portal zIndex={1234}>
        <View testID="portal-child" />
      </Portal>
    )

    expect(zIndicesOf(tree)).toContain(1234)
  })
})

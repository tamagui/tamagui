import { createAnimations } from '@tamagui/animations-reanimated'
import { Button } from '@tamagui/button'
import { getDefaultTamaguiConfig } from '@tamagui/config-default'
import { TamaguiProvider, createTamagui } from '@tamagui/core'
import { PortalProvider } from '@tamagui/portal'
import { Sheet } from '@tamagui/sheet'
import type React from 'react'
import TestRenderer, { act } from 'react-test-renderer'
import { describe, expect, test } from 'vitest'

const animations = createAnimations({
  medium: {
    damping: 16,
    stiffness: 90,
    mass: 0.8,
  },
})

const conf = createTamagui({
  ...getDefaultTamaguiConfig(),
  animations,
})

function Provider({ children }: { children: React.ReactNode }) {
  return (
    <TamaguiProvider config={conf} defaultTheme="light">
      <PortalProvider shouldAddRootHost>{children}</PortalProvider>
    </TamaguiProvider>
  )
}

describe('Sheet restructure', () => {
  test('exposes Container and Background instead of Frame', () => {
    expect(Sheet.Container).toBeTruthy()
    expect(Sheet.Background).toBeTruthy()
    expect((Sheet as any).Frame).toBeUndefined()
  })

  test('renders overlay as a direct child outside the animated content tree', async () => {
    let rendered: TestRenderer.ReactTestRenderer | null = null

    await act(async () => {
      rendered = TestRenderer.create(
        <Provider>
          <Sheet modal open snapPoints={[80]} transition="medium">
            <Sheet.Container testID="container">
              <Sheet.Background testID="background" />
              <Button testID="button">button</Button>
            </Sheet.Container>
            <Sheet.Overlay testID="overlay" backgroundColor="rgba(10, 120, 80, 0.35)" />
          </Sheet>
        </Provider>
      )
    })

    expect(rendered!.root.findAllByProps({ testID: 'container' }).length).toBeGreaterThan(
      0
    )
    expect(
      rendered!.root.findAllByProps({ testID: 'background' }).length
    ).toBeGreaterThan(0)
    expect(rendered!.root.findAllByProps({ testID: 'overlay' }).length).toBeGreaterThan(0)
    rendered?.unmount()
  })
})

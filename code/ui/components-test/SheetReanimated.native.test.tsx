import { createAnimations } from '@tamagui/animations-reanimated'
import { Button } from '@tamagui/button'
import { getDefaultTamaguiConfig } from '@tamagui/config-default'
import { TamaguiProvider, createTamagui } from '@tamagui/core'
import { Input } from '@tamagui/input'
import { PortalProvider } from '@tamagui/portal'
import { Sheet } from '@tamagui/sheet'
import { YStack } from '@tamagui/stacks'
import { Paragraph } from '@tamagui/text'
import TestRenderer, { act } from 'react-test-renderer'
import { afterEach, describe, expect, test, vi } from 'vitest'

const animations = createAnimations({
  lazy: {
    damping: 18,
    mass: 0.2,
    stiffness: 10,
  },
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

function InnerSheet() {
  return (
    <Sheet modal open={false} snapPoints={[90]} dismissOnSnapToBottom transition="medium">
      <Sheet.Overlay
        transition="medium"
        bg="$shadow2"
        enterStyle={{ opacity: 0 }}
        exitStyle={{ opacity: 0 }}
      />

      <Sheet.Handle />
      <Sheet.Container flex={1} justify="center" items="center" gap="$5">
        <Sheet.Background />

        <YStack p="$5" gap="$8">
          <Paragraph>inner sheet</Paragraph>
        </YStack>
      </Sheet.Container>
    </Sheet>
  )
}

function ReanimatedSheet({ modal }: { modal: boolean }) {
  return (
    <Sheet
      modal={modal}
      open
      snapPoints={[85, 50, 25]}
      snapPointsMode="percent"
      dismissOnSnapToBottom
      zIndex={100_000}
      transition="medium"
    >
      <Sheet.Overlay
        transition="lazy"
        bg="$shadow6"
        enterStyle={{ opacity: 0 }}
        exitStyle={{ opacity: 0 }}
      />

      <Sheet.Handle />
      <Sheet.Container p="$4" justify="center" items="center" gap="$5">
        <Sheet.Background />

        <Button>close</Button>
        <Input width={200} />
        {modal && <InnerSheet />}
      </Sheet.Container>
    </Sheet>
  )
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('Sheet with reanimated native driver', () => {
  test('can switch from modal to inline without reanimated render errors', async () => {
    const errors: string[] = []
    const warnings: string[] = []
    vi.spyOn(console, 'error').mockImplementation((...args) => {
      errors.push(args.join(' '))
    })
    vi.spyOn(console, 'warn').mockImplementation((...args) => {
      warnings.push(args.join(' '))
    })

    let rendered: TestRenderer.ReactTestRenderer | null = null

    await act(async () => {
      rendered = TestRenderer.create(
        <Provider>
          <ReanimatedSheet modal />
        </Provider>
      )
    })

    await act(async () => {
      rendered!.update(
        <Provider>
          <ReanimatedSheet modal={false} />
        </Provider>
      )
    })

    const logs = [...errors, ...warnings].filter((message) => {
      return (
        /Reanimated|Worklets|Should not already be working|cannot add a new property/i.test(
          message
        ) && !/react-test-renderer/.test(message)
      )
    })

    expect(logs).toEqual([])
    rendered?.unmount()
  })
})

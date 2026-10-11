import { getDefaultTamaguiConfig } from '@tamagui/config-default'
import { TamaguiProvider, View, createTamagui } from '@tamagui/core'
import { PortalProvider } from '@tamagui/portal'
import { Sheet } from '@tamagui/sheet'
import { Paragraph } from '@tamagui/text'
import * as React from 'react'
import TestRenderer, { act } from 'react-test-renderer'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

const conf = createTamagui(getDefaultTamaguiConfig())

let rendered: TestRenderer.ReactTestRenderer | null = null

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(async () => {
  await act(async () => {
    rendered?.unmount()
  })
  rendered = null
  vi.useRealTimers()
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

// the full-screen wrapper Portal.native renders around every portal item
function portalWrappers(tree: TestRenderer.ReactTestRenderer) {
  return tree.root.findAll((node) => {
    if (typeof node.type !== 'string') return false
    const style = Object.assign({}, ...[node.props.style].flat(Infinity))
    return (
      style.pointerEvents === 'box-none' &&
      style.position === 'absolute' &&
      style.top === 0 &&
      style.bottom === 0 &&
      style.left === 0 &&
      style.right === 0
    )
  })
}

function hasText(tree: TestRenderer.ReactTestRenderer, text: string) {
  return (
    tree.root.findAll(
      (node) => typeof node.type === 'string' && node.children.includes(text)
    ).length > 0
  )
}

function ClosedSheet() {
  return (
    <Sheet modal open={false} unmountChildrenWhenHidden>
      <Sheet.Overlay />
      <Sheet.Container>
        <Paragraph>never shown</Paragraph>
      </Sheet.Container>
    </Sheet>
  )
}

function ToggledSheet() {
  const [open, setOpen] = React.useState(false)
  return (
    <>
      <View testID="open" onPress={() => setOpen(true)} />
      <Sheet modal open={open} onOpenChange={setOpen} unmountChildrenWhenHidden>
        <Sheet.Overlay />
        <Sheet.Container>
          <Paragraph>sheet content</Paragraph>
          <View testID="close" onPress={() => setOpen(false)} />
        </Sheet.Container>
      </Sheet>
    </>
  )
}

describe('native modal Sheet with unmountChildrenWhenHidden', () => {
  test('keeps initial measurement content mounted before first opening', async () => {
    const tree = await renderNative(
      <>
        <ClosedSheet />
        <ClosedSheet />
        <ClosedSheet />
      </>
    )

    expect(portalWrappers(tree)).toHaveLength(3)
    expect(portalWrappers(tree).every((node) => node.children.length > 0)).toBe(true)
  })

  test('leaves no portal wrapper behind after opening and closing', async () => {
    const tree = await renderNative(<ToggledSheet />)

    await act(async () => tree.root.findByProps({ testID: 'open' }).props.onPress())
    await act(async () => {
      for (const node of tree.root.findAll(
        (node) => typeof node.props.onLayout === 'function'
      )) {
        node.props.onLayout({
          nativeEvent: { layout: { x: 0, y: 0, width: 390, height: 300 } },
        })
      }
    })
    await act(async () => vi.advanceTimersByTime(2000))
    expect(hasText(tree, 'sheet content')).toBe(true)
    expect(portalWrappers(tree)).toHaveLength(1)

    await act(async () => tree.root.findByProps({ testID: 'close' }).props.onPress())
    await act(async () => vi.advanceTimersByTime(2000))
    expect(hasText(tree, 'sheet content')).toBe(false)
    expect(portalWrappers(tree)).toHaveLength(0)
  })
})

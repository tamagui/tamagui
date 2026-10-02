import { getDefaultTamaguiConfig } from '@tamagui/config-default'
import { TamaguiProvider, View, createTamagui } from '@tamagui/core'
import { useEffect } from 'react'
import TestRenderer, { act } from 'react-test-renderer'
import { afterEach, expect, test, vi } from 'vitest'
import { Sheet } from '../sheet/src/Sheet'
import { useSheetContext } from '../sheet/src/SheetContext'
import { getNativeSheet, setupNativeSheet } from '../sheet/src/nativeSheet.native'
import type { NativeSheetRendererProps, SheetProps } from '../sheet/src/types'

vi.mock('react-native', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-native')>()
  return { ...actual, Platform: { ...actual.Platform, OS: 'ios' } }
})

vi.mock('../sheet/src/nativeSheet', () => import('../sheet/src/nativeSheet.native'))

const config = createTamagui(getDefaultTamaguiConfig('native'))
const rendered: TestRenderer.ReactTestRenderer[] = []

afterEach(async () => {
  await act(async () => {
    for (const tree of rendered.splice(0)) tree.unmount()
  })
})

test('unregistered native sheets render with the custom implementation', async () => {
  let context: ReturnType<typeof useSheetContext>
  function Content() {
    context = useSheetContext()
    return <View testID="unregistered-sheet-content" />
  }
  await act(async () => {
    const tree = TestRenderer.create(
      <TamaguiProvider config={config} defaultTheme="light">
        <Sheet native defaultOpen>
          <Sheet.Container>
            <Content />
          </Sheet.Container>
        </Sheet>
      </TamaguiProvider>
    )
    rendered.push(tree)
  })
  expect(context!.open).toBe(true)
  expect(context!.onlyShowContainer).toBe(false)
  expect(
    rendered[0].root
      .findAllByProps({ testID: 'unregistered-sheet-content' })
      .filter((node) => typeof node.type === 'string')
  ).toHaveLength(1)
})

async function mountSheet(props: SheetProps) {
  let current: NativeSheetRendererProps
  const mounted = vi.fn()
  const unmounted = vi.fn()
  let measuredHeight = 0
  function Content() {
    measuredHeight = useSheetContext().frameSize
    useEffect(() => {
      mounted()
      return () => unmounted()
    }, [])
    return <View testID="sheet-content" />
  }
  function Renderer(props: NativeSheetRendererProps) {
    current = props
    return (
      <View ref={props.ref} testID="native-sheet-host">
        {props.children}
      </View>
    )
  }
  setupNativeSheet('ios', Renderer)
  const Implementation = getNativeSheet('ios')!
  const element = (next: SheetProps) => (
    <TamaguiProvider config={config} defaultTheme="light">
      <Implementation {...next}>
        <Sheet.Handle />
        <Sheet.Overlay />
        <Sheet.Container testID="native-sheet-container">
          <Sheet.Background />
          <Sheet.ScrollView>
            <Content />
          </Sheet.ScrollView>
        </Sheet.Container>
      </Implementation>
    </TamaguiProvider>
  )
  let tree: TestRenderer.ReactTestRenderer
  await act(async () => {
    tree = TestRenderer.create(element(props))
  })
  rendered.push(tree!)
  return {
    tree: tree!,
    mounted,
    unmounted,
    renderer: () => current!,
    measuredHeight: () => measuredHeight,
    async update(next: SheetProps) {
      await act(async () => {
        tree.update(element(next))
      })
    },
  }
}

test.each([
  [
    'percent',
    [80, 40],
    [
      { type: 'percent', value: 80 },
      { type: 'percent', value: 40 },
    ],
  ],
  [
    'constant',
    [300, 120],
    [
      { type: 'height', value: 300 },
      { type: 'height', value: 120 },
    ],
  ],
  ['fit', ['fit'], [{ type: 'fit' }]],
  [
    'mixed',
    ['fit', '25%', 120],
    [{ type: 'fit' }, { type: 'percent', value: 25 }, { type: 'height', value: 120 }],
  ],
] as const)(
  'native renderer normalizes %s detents and mounts one content tree',
  async (mode, points, expected) => {
    const fixture = await mountSheet({
      open: true,
      snapPointsMode: mode,
      snapPoints: [...points],
      dismissOnSnapToBottom: true,
    })
    expect(fixture.renderer().snapPoints).toEqual(expected)
    expect(fixture.renderer().position).toBe(0)
    expect(fixture.mounted).toHaveBeenCalledTimes(1)
    const container = fixture.tree.root
      .findAllByProps({ testID: 'native-sheet-container' })
      .find((node) => typeof node.type === 'string')!
    expect(container.props.style.maxHeight).toBe(points[0] === 'fit' ? undefined : '100%')
    await act(async () => {
      container.props.onLayout({
        nativeEvent: { layout: { x: 0, y: 0, width: 320, height: 321 } },
      })
    })
    expect(fixture.measuredHeight()).toBe(321)
    expect(
      fixture.tree.root
        .findAllByProps({ testID: 'sheet-content' })
        .filter((node) => typeof node.type === 'string')
    ).toHaveLength(1)
  }
)

test('native requests retain controlled values and hidden content waits for physical dismissal', async () => {
  const onOpenChange = vi.fn()
  const onPositionChange = vi.fn()
  const props: SheetProps = {
    open: true,
    position: 0,
    snapPoints: [80, 40],
    onOpenChange,
    onPositionChange,
    unmountChildrenWhenHidden: true,
  }
  const fixture = await mountSheet(props)
  await act(async () => {
    fixture.renderer().onOpenChange(false)
    fixture.renderer().onPositionChange(1)
  })
  expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(false)
  expect(onPositionChange).toHaveBeenCalledExactlyOnceWith(1)
  expect(fixture.renderer().open).toBe(true)
  expect(fixture.renderer().position).toBe(0)
  await act(async () => {
    fixture.renderer().onDismiss()
  })
  expect(fixture.unmounted).not.toHaveBeenCalled()
  await fixture.update({ ...props, open: false })
  expect(fixture.renderer().open).toBe(false)
  expect(fixture.unmounted).not.toHaveBeenCalled()
  await act(async () => {
    fixture.renderer().onDismiss()
  })
  expect(fixture.unmounted).toHaveBeenCalledTimes(1)
  await fixture.update(props)
  expect(fixture.mounted).toHaveBeenCalledTimes(2)
  const dismiss = fixture.renderer().onDismiss
  await fixture.update({ ...props, open: false })
  await fixture.update(props)
  await act(async () => {
    dismiss()
  })
  expect(fixture.renderer().open).toBe(true)
  expect(fixture.unmounted).toHaveBeenCalledTimes(1)
})

test('native renderer owns uncontrolled requests without mounting duplicate content', async () => {
  const fixture = await mountSheet({
    defaultOpen: true,
    snapPoints: [80, 40],
    dismissOnSnapToBottom: true,
  })
  await act(async () => {
    fixture.renderer().onPositionChange(1)
  })
  expect(fixture.renderer().position).toBe(1)
  await act(async () => {
    fixture.renderer().onPositionChange(2)
  })
  expect(fixture.renderer().open).toBe(false)
  await act(async () => {
    fixture.renderer().onOpenChange(true)
  })
  expect(fixture.renderer().open).toBe(true)
  expect(fixture.mounted).toHaveBeenCalledTimes(1)
})

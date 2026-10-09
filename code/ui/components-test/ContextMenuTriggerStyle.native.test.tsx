import { getDefaultTamaguiConfig } from '@tamagui/config-default'
import { TamaguiProvider, View, createTamagui } from '@tamagui/core'
import { ContextMenu } from '@tamagui/context-menu'
import TestRenderer, { act } from 'react-test-renderer'
import { expect, test } from 'vitest'

const config = createTamagui(getDefaultTamaguiConfig('native'))

test('cross-platform context menu preserves native trigger style (#4245)', async () => {
  let renderer: TestRenderer.ReactTestRenderer
  await act(async () => {
    renderer = TestRenderer.create(
      <TamaguiProvider config={config} defaultTheme="light">
        <ContextMenu>
          <ContextMenu.Trigger testID="styled-trigger" style={{ width: 123 }}>
            <View />
          </ContextMenu.Trigger>
        </ContextMenu>
      </TamaguiProvider>
    )
  })
  try {
    const trigger = renderer!.root.findAll(
      (node) => node.type === 'View' && node.props.testID === 'styled-trigger'
    )
    expect(trigger).toHaveLength(1)
    const style = Object.assign({}, ...[trigger[0].props.style].flat(Infinity))
    expect(style.width).toBe(123)
  } finally {
    await act(async () => renderer!.unmount())
  }
})

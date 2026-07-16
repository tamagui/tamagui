import { Checkbox } from '@tamagui/checkbox'
import { getDefaultTamaguiConfig } from '@tamagui/config-default'
import { TamaguiProvider, createTamagui, styled } from '@tamagui/core'
import TestRenderer, { act } from 'react-test-renderer'
import type { ReactTestRendererJSON } from 'react-test-renderer'
import { expect, test, vi } from 'vitest'

const config = createTamagui(getDefaultTamaguiConfig())

const CheckboxSkin = styled(Checkbox, {
  name: 'NativeCheckboxTestSkin',
  width: 20,
  height: 20,
  borderWidth: 1,
})

const IndicatorSkin = styled(Checkbox.Indicator, {
  name: 'NativeCheckboxIndicatorTestSkin',
  width: 10,
  height: 10,
  backgroundColor: '$color',
})

function hasHostTestID(
  node: ReactTestRendererJSON | ReactTestRendererJSON[] | null,
  testID: string
): boolean {
  if (!node) return false
  if (Array.isArray(node)) return node.some((child) => hasHostTestID(child, testID))
  if (node.props.testID === testID) return true
  return (
    node.children?.some((child) => {
      return typeof child === 'object' && hasHostTestID(child, testID)
    }) ?? false
  )
}

test('toggles a directly styled checkbox on native', async () => {
  const onCheckedChange = vi.fn()
  let rendered: TestRenderer.ReactTestRenderer | null = null

  await act(async () => {
    rendered = TestRenderer.create(
      <TamaguiProvider config={config} defaultTheme="light">
        <CheckboxSkin
          testID="native-checkbox"
          aria-label="Native checkbox"
          onCheckedChange={onCheckedChange}
        >
          <IndicatorSkin testID="native-checkbox-indicator" />
        </CheckboxSkin>
      </TamaguiProvider>
    )
  })

  expect(hasHostTestID(rendered!.toJSON(), 'native-checkbox-indicator')).toBe(false)

  const pressable = rendered!.root.find(
    (node) =>
      node.props.testID === 'native-checkbox' && typeof node.props.onPress === 'function'
  )

  await act(async () => {
    pressable.props.onPress({})
  })

  expect(onCheckedChange).toHaveBeenCalledWith(true)
  expect(hasHostTestID(rendered!.toJSON(), 'native-checkbox-indicator')).toBe(true)
})

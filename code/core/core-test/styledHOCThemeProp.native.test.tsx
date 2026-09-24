process.env.TAMAGUI_TARGET = 'native'

import { getDefaultTamaguiConfig } from '@tamagui/config-default'
import { render } from '@testing-library/react-native'
import { expect, test } from 'vitest'
import { TamaguiProvider, View, createStyledHOC, createTamagui, styled } from '../web/src'

// a theme prop on a styled HOC (styled(Button, ...)) themes the wrapper's own
// styles too. on native they resolve to values in the wrapper, so it has to
// resolve them in the new theme; web gets this for free from css variables.

const config = createTamagui(getDefaultTamaguiConfig('native'))

const Frame = styled(View, {})
const Wrapped = createStyledHOC(Frame, (props, ref) => (
  <Frame ref={ref} {...props}>
    <View testID="child" backgroundColor="background" />
  </Frame>
))
const Skin = styled(Wrapped, { backgroundColor: 'background' })

const findByTestID = (node: any, id: string): any => {
  if (!node || typeof node !== 'object') return undefined
  if (node.props?.testID === id) return node
  for (const child of node.children || []) {
    const found = findByTestID(child, id)
    if (found) return found
  }
}

test('styled HOC resolves its own styles in its theme prop (native)', () => {
  const { toJSON } = render(
    <TamaguiProvider config={config} defaultTheme="dark">
      <Skin testID="skin" theme="red" />
    </TamaguiProvider>
  )
  const tree = toJSON()
  expect(findByTestID(tree, 'skin').props.style).toMatchObject({
    backgroundColor: 'darkred',
  })
  expect(findByTestID(tree, 'child').props.style).toMatchObject({
    backgroundColor: 'darkred',
  })
})

import { TamaguiProvider, View, createTamagui } from '@tamagui/core'
import { render } from '@testing-library/react-native'
import { describe, expect, test } from 'vitest'

import { getDefaultTamaguiConfig } from '../config-default'

const config = createTamagui(getDefaultTamaguiConfig('native'))

describe('animation props', () => {
  test(`renders with no props`, () => {
    const tree = render(
      <TamaguiProvider config={config}>
        <View />
      </TamaguiProvider>
    )

    expect(tree.toJSON()).toMatchInlineSnapshot('<View />')
  })

  // this looks wrong
  test(`renders with animation props`, () => {
    const tree = render(
      <TamaguiProvider config={config}>
        <View animation="quick" x={0} />
      </TamaguiProvider>
    )

    expect(tree.toJSON()).toMatchInlineSnapshot(`
      <View
        style={
          {
            "transform": [
              {
                "translateX": 0,
              },
            ],
          }
        }
      />
    `)
  })
})

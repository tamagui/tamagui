import { TamaguiProvider, View, createTamagui } from '@tamagui/core'
import { render } from '@testing-library/react-native'
import { describe, expect, test } from 'vitest'

import { getDefaultTamaguiConfig } from '../config-default'

const config = createTamagui(getDefaultTamaguiConfig('native'))

describe('animation props', () => {
  test(`renders with animation props`, () => {
    const tree = render(
      <TamaguiProvider config={config}>
        <View
          nativeID="test-native-id"
          animation="quick"
          x={0}
          backgroundColor="red"
          margin={200}
        />
      </TamaguiProvider>
    )

    expect(tree.toJSON()).toMatchInlineSnapshot(`
      <span
        className=""
        style={
          {
            "display": "contents",
          }
        }
      >
        <span
          className=" _dsp_contents"
        >
          <span
            className=" t_light _dsp_contents is_Theme"
            style={
              {
                "color": "var(--color)",
              }
            }
          >
            <div
              className="_dsp-flex _ai-stretch _fd-column _fb-auto _bxs-border-box _pos-relative _mih-0px _miw-0px _fs-0 _bg-red _mt-200px _mr-200px _mb-200px _ml-200px _transform-translateX01303033"
              id="test-native-id"
              style={{}}
            />
          </span>
        </span>
      </span>
    `)
  })
})

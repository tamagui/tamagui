import { TamaguiProvider, View, createTamagui } from '@tamagui/core'
import { render } from '@testing-library/react'
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

    expect(tree.asFragment()).toMatchInlineSnapshot(`
      <DocumentFragment>
        <span
          class=""
          style="display: contents;"
        >
          <div
            class="_dsp-flex _ai-stretch _fd-column _fb-auto _bxs-border-box _pos-relative _mih-0px _miw-0px _fs-0 _bg-red _mt-200px _mr-200px _mb-200px _ml-200px _transform-translateX01303033"
            id="test-native-id"
          />
        </span>
      </DocumentFragment>
    `)
  })
})

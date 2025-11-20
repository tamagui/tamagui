import { TamaguiProvider, View, createTamagui } from '@tamagui/core'
import { render } from '@testing-library/react'
import { describe, expect, test } from 'vitest'

import { getDefaultTamaguiConfig } from '../config-default'

const config = createTamagui(getDefaultTamaguiConfig('native'))

describe('animation props', () => {
  test(`renders with animation props`, () => {
    const tree = render(
      <TamaguiProvider config={config} defaultTheme="light">
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
          <span
            class="t_light _dsp_contents"
          >
            <span
              class=" t_light is_Theme"
              style="color: var(--color); display: contents;"
            >
              <div
                class="is_View _pos-static _dsp-flex _ai-stretch _fd-column _fb-auto _bxs-border-box _mih-0px _miw-0px _fs-0 _bg-red _mt-200px _mr-200px _mb-200px _ml-200px _tr-translateX01303033"
                nativeid="test-native-id"
              />
            </span>
          </span>
        </span>
      </DocumentFragment>
    `)
  })
})

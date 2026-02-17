import { TamaguiProvider, View, createTamagui } from '@tamagui/core'
import { render } from '@testing-library/react'
import { describe, expect, test } from 'vitest'

import { getDefaultTamaguiConfig } from '../config-default'

const config = createTamagui(getDefaultTamaguiConfig('web'))

describe('animation props', () => {
  test(`renders with animation props`, () => {
    const tree = render(
      <TamaguiProvider config={config} defaultTheme="light">
        <View id="test-id" transition="quick" x={0} backgroundColor="red" margin={200} />
      </TamaguiProvider>
    )

    expect(tree.asFragment()).toMatchInlineSnapshot(`
      <DocumentFragment>
        <span
          class="t_light _dsp_contents"
        >
          <span
            class=" t_light is_Theme"
            style="color: var(--color); display: contents;"
          >
            <span
              class="_dsp_contents  font_body"
            >
              <div
                class="is_View _bg-red _mt-200px _mr-200px _mb-200px _ml-200px _tr-translateX01303033"
                id="test-id"
                style="transition: all cubic-bezier(0.215, 0.610, 0.355, 1.000) 400ms;"
              />
            </span>
          </span>
        </span>
      </DocumentFragment>
    `)
  })
})

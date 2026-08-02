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

    // snapshot the View, not the whole fragment. TamaguiProvider also renders
    // ConfigRevisionCheck, whose hidden span carries a hash of every theme,
    // token, media, font and shorthand NAME in the config — capturing the
    // fragment made this animation test fail whenever an unrelated config key
    // was added anywhere, which teaches rubber-stamping the snapshot. Theme and
    // font wrapping have their own tests.
    expect(tree.container.querySelector('#test-id')).toMatchInlineSnapshot(`
      <div
        class="is_View _mt-200px _mr-200px _mb-200px _ml-200px _tx-927052474 _t-616221249 _bc-1124498088"
        id="test-id"
        style="transition: all cubic-bezier(0.215, 0.610, 0.355, 1.000) 400ms;"
      />
    `)
  })
})

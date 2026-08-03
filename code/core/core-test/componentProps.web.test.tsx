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

    const view = tree.container.querySelector('#test-id') as HTMLElement
    expect(view.tagName).toBe('DIV')
    expect(view.className).toContain('is_View')
    expect(view.style.transition).toBe(
      'all cubic-bezier(0.215, 0.610, 0.355, 1.000) 400ms'
    )
    const style = getComputedStyle(view)
    expect(style.backgroundColor).toBe('red')
    expect(style.margin).toBe('200px')
  })
})

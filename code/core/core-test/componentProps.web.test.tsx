import { TamaguiProvider, View, createTamagui, styled } from '@tamagui/core'
import { render } from '@testing-library/react'
import { describe, expect, test } from 'vitest'

import { getDefaultTamaguiConfig } from '../config-default'

const config = createTamagui(getDefaultTamaguiConfig('web'))

test('styled displayName sets React identity while name remains a host prop', () => {
  const NamedButton = styled(View, {
    displayName: 'NamedButton',
    render: 'button',
  })

  const tree = render(
    <TamaguiProvider config={config} defaultTheme="light">
      <NamedButton
        id="named-button"
        name="submitter"
        {...({ displayName: 'InstanceName' } as any)}
      />
    </TamaguiProvider>
  )

  const button = tree.container.querySelector('#named-button') as HTMLButtonElement
  expect(NamedButton.displayName).toBe('NamedButton')
  expect(button.name).toBe('submitter')
  expect(button.className).toContain('is_NamedButton')
  expect(button.className).not.toContain('is_InstanceName')
  expect(button.getAttribute('displayname')).toBeNull()
})

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

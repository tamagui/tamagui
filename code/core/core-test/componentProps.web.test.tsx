import { TamaguiProvider, View, createTamagui, styled } from '@tamagui/core'
import { render } from '@testing-library/react'
import { describe, expect, test } from 'vitest'

import { getDefaultTamaguiConfig } from '../config-default'

const config = createTamagui(getDefaultTamaguiConfig('web'))

test('styled displayName sets React identity while name remains a host prop', () => {
  const NamedButton = styled(View, {
    displayName: 'NamedButton',
    className: 'named-button-hook',
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
  expect(button.className).toContain('named-button-hook')
  expect(button.className).not.toContain('is_NamedButton')
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
    // `quick` is a spring (220ms, 0.3 bounce), so css gets its settle time and
    // a linear() sampled from the same curve the js drivers run
    expect(view.style.transition).toBe(
      'all 282ms linear(0, 0.0184, 0.0668, 0.1362, 0.2189, 0.3088, 0.4009, 0.4915, 0.5777, 0.6576, 0.73, 0.794, 0.8496, 0.8968, 0.9361, 0.968, 0.9931, 1.0124, 1.0264, 1.0361, 1.0422, 1.0452, 1.046, 1.0449, 1.0425, 1.0392, 1.0354, 1.0312, 1.027, 1.0228, 1.0189, 1.0153, 1.012, 1.0091, 1.0066, 1.0045, 1.0027, 1.0013, 1.0002, 0.9993, 1)'
    )
    const style = getComputedStyle(view)
    expect(style.backgroundColor).toBe('red')
    expect(style.margin).toBe('200px')
  })
})

describe('styled source layers', () => {
  test('a call-site longhand preserves sibling values from a styled shorthand', () => {
    const Padded = styled(View, {
      padding: 4,
    })
    const tree = render(
      <TamaguiProvider config={config} defaultTheme="light">
        <Padded data-testid="padded" paddingTop={8} />
      </TamaguiProvider>
    )

    const style = getComputedStyle(tree.getByTestId('padded'))
    expect(style.paddingTop).toBe('8px')
    expect(style.paddingRight).toBe('4px')
    expect(style.paddingBottom).toBe('4px')
    expect(style.paddingLeft).toBe('4px')
  })

  test('a call-site border width preserves the styled border color', () => {
    const Bordered = styled(View, {
      borderColor: 'red',
      borderWidth: 1,
    })
    const tree = render(
      <TamaguiProvider config={config} defaultTheme="light">
        <Bordered data-testid="bordered" borderWidth={2} />
      </TamaguiProvider>
    )

    const style = getComputedStyle(tree.getByTestId('bordered'))
    expect({
      width: style.borderTopWidth,
      style: style.borderTopStyle,
      color: style.borderTopColor,
    }).toEqual({
      width: '2px',
      style: 'solid',
      color: 'red',
    })
  })

  test('implicit border defaults do not replace an authored border style', () => {
    const Dashed = styled(View, {
      borderColor: 'red',
      borderStyle: 'dashed',
      borderWidth: 1,
    })
    const tree = render(
      <TamaguiProvider config={config} defaultTheme="light">
        <Dashed data-testid="dashed" borderWidth={2} />
      </TamaguiProvider>
    )

    const style = getComputedStyle(tree.getByTestId('dashed'))
    expect({
      width: style.borderTopWidth,
      style: style.borderTopStyle,
      color: style.borderTopColor,
    }).toEqual({
      width: '2px',
      style: 'dashed',
      color: 'red',
    })
  })

  test('a call-site border style preserves the styled width and color', () => {
    const Bordered = styled(View, {
      borderColor: 'red',
      borderWidth: 1,
    })
    const tree = render(
      <TamaguiProvider config={config} defaultTheme="light">
        <Bordered data-testid="dotted" borderStyle="dotted" />
      </TamaguiProvider>
    )

    const style = getComputedStyle(tree.getByTestId('dotted'))
    expect({
      width: style.borderTopWidth,
      style: style.borderTopStyle,
      color: style.borderTopColor,
    }).toEqual({
      width: '1px',
      style: 'dotted',
      color: 'red',
    })
  })
})

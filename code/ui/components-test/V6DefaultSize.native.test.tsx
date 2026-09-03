import { defaultConfig as v6 } from '@tamagui/config/v6'
import { Input } from '@tamagui/input'
import { TamaguiProvider, createTamagui } from '@tamagui/core'
import TestRenderer, { act } from 'react-test-renderer'
import { Button } from 'tamagui'
import { describe, expect, test } from 'vitest'

const config = createTamagui(v6)

function flattenStyle(style: unknown): Record<string, unknown> {
  if (Array.isArray(style)) {
    return Object.assign({}, ...style.map(flattenStyle))
  }
  return (style as Record<string, unknown>) || {}
}

async function renderDefaultControls() {
  let rendered: TestRenderer.ReactTestRenderer | null = null

  await act(async () => {
    rendered = TestRenderer.create(
      <TamaguiProvider config={config} defaultTheme="light">
        <Button>Save</Button>
        <Input accessibilityLabel="Name" />
      </TamaguiProvider>
    )
  })

  return rendered!
}

describe('v6 default component size on native', () => {
  test('keeps Tailwind numeric tokens', () => {
    expect({
      size4: config.tokensParsed.size['4'].val,
      space4: config.tokensParsed.space['4'].val,
    }).toEqual({
      size4: 16,
      space4: 16,
    })
  })

  test('renders usable Button and Input geometry around the default type', async () => {
    const rendered = await renderDefaultControls()
    const button = rendered.root.find(
      (node) => node.type === 'View' && node.props.role === 'button'
    )
    const buttonText = rendered.root.find(
      (node) => node.type === 'Text' && node.props.children === 'Save'
    )
    const input = rendered.root.find(
      (node) =>
        node.props.accessibilityLabel === 'Name' &&
        typeof flattenStyle(node.props.style).fontSize === 'number'
    )
    const buttonStyle = flattenStyle(button.props.style)
    const buttonTextStyle = flattenStyle(buttonText.props.style)
    const inputStyle = flattenStyle(input.props.style)

    // the default named size (md) never sets a height: line-height plus padding
    expect({
      buttonHeight: buttonStyle.height,
      buttonPadding: buttonStyle.paddingLeft,
      buttonPaddingBlock: buttonStyle.paddingTop,
      buttonRadius: buttonStyle.borderTopLeftRadius,
      buttonFontSize: buttonTextStyle.fontSize,
      buttonLineHeight: buttonTextStyle.lineHeight,
      inputHeight: inputStyle.height,
      inputPadding: inputStyle.paddingLeft,
      inputPaddingBlock: inputStyle.paddingTop,
      inputRadius: inputStyle.borderTopLeftRadius,
      inputFontSize: inputStyle.fontSize,
      inputLineHeight: inputStyle.lineHeight,
    }).toEqual({
      buttonHeight: undefined,
      buttonPadding: 16,
      buttonPaddingBlock: 8,
      buttonRadius: 6,
      buttonFontSize: 14,
      buttonLineHeight: 20,
      inputHeight: undefined,
      inputPadding: 16,
      inputPaddingBlock: 8,
      inputRadius: 6,
      inputFontSize: 14,
      inputLineHeight: undefined,
    })
  })

  test('keeps explicit size tokens coupled to the same key in every category', async () => {
    let rendered: TestRenderer.ReactTestRenderer | null = null
    await act(async () => {
      rendered = TestRenderer.create(
        <TamaguiProvider config={config} defaultTheme="light">
          <Button size="11">Explicit</Button>
          <Input accessibilityLabel="Explicit name" size="11" />
        </TamaguiProvider>
      )
    })

    const button = rendered!.root.find(
      (node) => node.type === 'View' && node.props.role === 'button'
    )
    const buttonText = rendered!.root.find(
      (node) => node.type === 'Text' && node.props.children === 'Explicit'
    )
    const input = rendered!.root.find(
      (node) =>
        node.props.accessibilityLabel === 'Explicit name' &&
        typeof flattenStyle(node.props.style).fontSize === 'number'
    )
    const buttonStyle = flattenStyle(button.props.style)
    const buttonTextStyle = flattenStyle(buttonText.props.style)
    const inputStyle = flattenStyle(input.props.style)

    expect({
      buttonPadding: buttonStyle.paddingLeft,
      buttonRadius: buttonStyle.borderTopLeftRadius,
      buttonFontSize: buttonTextStyle.fontSize,
      inputRadius: inputStyle.borderTopLeftRadius,
      inputFontSize: inputStyle.fontSize,
    }).toEqual({
      buttonPadding: config.tokensParsed.space['11'].val,
      buttonRadius: config.tokensParsed.radius['11'].val,
      buttonFontSize: config.fontsParsed.body.size['11'].val,
      inputRadius: config.tokensParsed.radius['11'].val,
      inputFontSize: config.fontsParsed.body.size['11'].val,
    })
  })
})

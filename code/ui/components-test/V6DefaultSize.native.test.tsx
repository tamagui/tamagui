import { defaultConfig as v6 } from '@tamagui/config/v6'
import { Input } from '@tamagui/input'
import { TamaguiProvider, createTamagui } from '@tamagui/core'
import TestRenderer, { act } from 'react-test-renderer'
import { describe, expect, test } from 'vitest'

import { V6DefaultSizeButton as Button } from './v6DefaultSizeButton'

const config = createTamagui(v6)
const defaultToken = config.settings.defaultSize
const categoryDefaults = (config.settings as any).defaultTokens as
  | Record<string, string>
  | undefined
const defaultFor = (category: string) => categoryDefaults?.[category] ?? defaultToken

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
  test('keeps Tailwind numeric tokens without changing the component default', () => {
    expect({
      size4: config.tokensParsed.size.$4.val,
      space4: config.tokensParsed.space.$4.val,
    }).toEqual({
      size4: 16,
      space4: 16,
    })

    expect({
      size: config.tokensParsed.size[defaultFor('size')].val,
      space: config.tokensParsed.space[defaultFor('space')].val,
      radius: config.tokensParsed.radius[defaultFor('radius')].val,
      zIndex: config.tokensParsed.zIndex[defaultFor('zIndex')].val,
      fontSize: config.fontsParsed.$body.size[defaultFor('fontSize')].val,
      lineHeight: config.fontsParsed.$body.lineHeight[defaultFor('fontSize')].val,
    }).toEqual({
      size: 44,
      space: 16,
      radius: 9,
      zIndex: 4,
      fontSize: 17,
      lineHeight: 22,
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
        typeof flattenStyle(node.props.style).height === 'number'
    )
    const buttonStyle = flattenStyle(button.props.style)
    const buttonTextStyle = flattenStyle(buttonText.props.style)
    const inputStyle = flattenStyle(input.props.style)

    expect({
      buttonHeight: buttonStyle.height,
      buttonPadding: buttonStyle.paddingLeft,
      buttonRadius: buttonStyle.borderTopLeftRadius,
      buttonFontSize: buttonTextStyle.fontSize,
      buttonLineHeight: buttonTextStyle.lineHeight,
      inputHeight: inputStyle.height,
      inputPadding: inputStyle.paddingLeft,
      inputRadius: inputStyle.borderTopLeftRadius,
      inputFontSize: inputStyle.fontSize,
      inputLineHeight: inputStyle.lineHeight,
    }).toEqual({
      buttonHeight: 44,
      buttonPadding: 16,
      buttonRadius: 9,
      buttonFontSize: 17,
      buttonLineHeight: 22,
      inputHeight: 44,
      inputPadding: 14,
      inputRadius: 9,
      inputFontSize: 17,
      inputLineHeight: undefined,
    })
  })

  test('keeps explicit size tokens coupled to the same key in every category', async () => {
    let rendered: TestRenderer.ReactTestRenderer | null = null
    await act(async () => {
      rendered = TestRenderer.create(
        <TamaguiProvider config={config} defaultTheme="light">
          <Button size="$11">Explicit</Button>
          <Input accessibilityLabel="Explicit name" size="$11" />
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
        typeof flattenStyle(node.props.style).height === 'number'
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
      buttonPadding: config.tokensParsed.space.$11.val,
      buttonRadius: config.tokensParsed.radius.$11.val,
      buttonFontSize: config.fontsParsed.$body.size.$11.val,
      inputRadius: config.tokensParsed.radius.$11.val,
      inputFontSize: config.fontsParsed.$body.size.$11.val,
    })
  })
})

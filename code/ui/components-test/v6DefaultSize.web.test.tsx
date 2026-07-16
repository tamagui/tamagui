import '@testing-library/jest-dom'

import { defaultConfig as v6 } from '@tamagui/config/v6'
import { Input } from '@tamagui/input'
import { TamaguiProvider, createTamagui } from '@tamagui/core'
import { render } from '@testing-library/react'
import { describe, expect, test } from 'vitest'

import { V6DefaultSizeButton as Button } from './v6DefaultSizeButton'

const config = createTamagui(v6)
const defaultToken = config.settings.defaultSize
const categoryDefaults = (config.settings as any).defaultTokens as
  | Record<string, string>
  | undefined
const defaultFor = (category: string) => categoryDefaults?.[category] ?? defaultToken

function resolveRenderedValue(
  value: string,
  tokens: Record<string, { val: unknown; variable: string }>
) {
  const configured = Object.values(tokens).find((token) => token.variable === value)
  if (configured) return configured.val

  const pixels = /^(-?\d+(?:\.\d+)?)px$/.exec(value)
  return pixels ? Number(pixels[1]) : value
}

function DefaultControls() {
  return (
    <TamaguiProvider config={config} defaultTheme="light">
      <Button>Save</Button>
      <Input aria-label="Name" />
    </TamaguiProvider>
  )
}

describe('v6 default component size on web', () => {
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
      fontSize: 15,
      lineHeight: 23,
    })
  })

  test('renders usable Button and Input geometry around the default type', () => {
    const rendered = render(<DefaultControls />)
    const button = rendered.getByRole('button')
    const buttonText = rendered.getByText('Save')
    const input = rendered.getByRole('textbox')
    const buttonStyle = getComputedStyle(button)
    const buttonTextStyle = getComputedStyle(buttonText)
    const inputStyle = getComputedStyle(input)

    expect({
      buttonHeight: resolveRenderedValue(buttonStyle.height, config.tokensParsed.size),
      buttonPadding: resolveRenderedValue(
        buttonStyle.paddingLeft,
        config.tokensParsed.space
      ),
      buttonRadius: resolveRenderedValue(
        buttonStyle.borderTopLeftRadius,
        config.tokensParsed.radius
      ),
      buttonFontSize: resolveRenderedValue(
        buttonTextStyle.fontSize,
        config.fontsParsed.$body.size
      ),
      buttonLineHeight: resolveRenderedValue(
        buttonTextStyle.lineHeight,
        config.fontsParsed.$body.lineHeight
      ),
      inputHeight: resolveRenderedValue(inputStyle.height, config.tokensParsed.size),
      inputPadding: resolveRenderedValue(
        inputStyle.paddingLeft,
        config.tokensParsed.space
      ),
      inputRadius: resolveRenderedValue(
        inputStyle.borderTopLeftRadius,
        config.tokensParsed.radius
      ),
      inputFontSize: resolveRenderedValue(
        inputStyle.fontSize,
        config.fontsParsed.$body.size
      ),
      inputLineHeight: resolveRenderedValue(
        inputStyle.lineHeight,
        config.fontsParsed.$body.lineHeight
      ),
    }).toEqual({
      buttonHeight: 44,
      buttonPadding: 16,
      buttonRadius: 9,
      buttonFontSize: 15,
      buttonLineHeight: 23,
      inputHeight: 44,
      inputPadding: 14,
      inputRadius: 9,
      inputFontSize: 15,
      inputLineHeight: 23,
    })
  })

  test('keeps explicit size tokens coupled to the same key in every category', () => {
    const rendered = render(
      <TamaguiProvider config={config} defaultTheme="light">
        <Button size="$11">Explicit</Button>
        <Input aria-label="Explicit name" size="$11" />
      </TamaguiProvider>
    )
    const buttonStyle = getComputedStyle(rendered.getByRole('button'))
    const buttonTextStyle = getComputedStyle(rendered.getByText('Explicit'))
    const inputStyle = getComputedStyle(rendered.getByRole('textbox'))

    expect({
      buttonPadding: resolveRenderedValue(
        buttonStyle.paddingLeft,
        config.tokensParsed.space
      ),
      buttonRadius: resolveRenderedValue(
        buttonStyle.borderTopLeftRadius,
        config.tokensParsed.radius
      ),
      buttonFontSize: resolveRenderedValue(
        buttonTextStyle.fontSize,
        config.fontsParsed.$body.size
      ),
      inputRadius: resolveRenderedValue(
        inputStyle.borderTopLeftRadius,
        config.tokensParsed.radius
      ),
      inputFontSize: resolveRenderedValue(
        inputStyle.fontSize,
        config.fontsParsed.$body.size
      ),
    }).toEqual({
      buttonPadding: config.tokensParsed.space.$11.val,
      buttonRadius: config.tokensParsed.radius.$11.val,
      buttonFontSize: config.fontsParsed.$body.size.$11.val,
      inputRadius: config.tokensParsed.radius.$11.val,
      inputFontSize: config.fontsParsed.$body.size.$11.val,
    })
  })
})

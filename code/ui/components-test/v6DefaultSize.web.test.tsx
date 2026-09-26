import '@testing-library/jest-dom'

import { defaultConfig as v6 } from '@tamagui/config/v6'
import { TamaguiProvider, createTamagui } from '@tamagui/core'
import { render } from '@testing-library/react'
import { Button, H1, Input } from 'tamagui'
import { describe, expect, test } from 'vitest'

const config = createTamagui(v6)

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
  test('keeps Tailwind numeric tokens', () => {
    expect({
      size4: config.tokensParsed.size['4'].val,
      space4: config.tokensParsed.space['4'].val,
    }).toEqual({
      size4: 16,
      space4: 16,
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

    // the default named size (md) never sets a height: line-height plus padding
    expect({
      buttonHeight: buttonStyle.height,
      buttonPadding: resolveRenderedValue(
        buttonStyle.paddingInline,
        config.tokensParsed.space
      ),
      buttonPaddingBlock: resolveRenderedValue(
        buttonStyle.paddingBlock,
        config.tokensParsed.space
      ),
      buttonRadius: resolveRenderedValue(
        buttonStyle.borderRadius,
        config.tokensParsed.radius
      ),
      buttonFontSize: resolveRenderedValue(
        buttonTextStyle.fontSize,
        config.fontsParsed.body.size
      ),
      buttonLineHeight: resolveRenderedValue(
        buttonTextStyle.lineHeight,
        config.fontsParsed.body.lineHeight
      ),
      inputHeight: inputStyle.height,
      inputPadding: resolveRenderedValue(
        inputStyle.paddingInline,
        config.tokensParsed.space
      ),
      inputPaddingBlock: resolveRenderedValue(
        inputStyle.paddingBlock,
        config.tokensParsed.space
      ),
      inputRadius: resolveRenderedValue(
        inputStyle.borderRadius,
        config.tokensParsed.radius
      ),
      inputFontSize: resolveRenderedValue(
        inputStyle.fontSize,
        config.fontsParsed.body.size
      ),
      inputLineHeight: resolveRenderedValue(
        inputStyle.lineHeight,
        config.fontsParsed.body.lineHeight
      ),
    }).toEqual({
      buttonHeight: '',
      buttonPadding: 16,
      buttonPaddingBlock: 8,
      buttonRadius: 6,
      buttonFontSize: 14,
      buttonLineHeight: 20,
      inputHeight: '',
      inputPadding: 16,
      inputPaddingBlock: 8,
      inputRadius: 6,
      inputFontSize: 14,
      inputLineHeight: 20,
    })
  })
})

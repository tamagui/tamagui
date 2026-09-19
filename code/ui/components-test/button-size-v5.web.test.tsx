import '@testing-library/jest-dom'

import { defaultConfig as v5Config } from '@tamagui/config/v5'
import { TamaguiProvider, createTamagui } from '@tamagui/core'
import { render } from '@testing-library/react'
import { Button } from 'tamagui'
import { describe, expect, it } from 'vitest'

const conf = createTamagui(v5Config as any)

// jsdom does not resolve css variables, so map token-backed values back
// through the parsed tokens (same helper as button-size.web.test.tsx)
const tokenValue = (
  value: string,
  tokens: Record<string, { val: unknown; variable: string }>
) => {
  const configured = Object.values(tokens).find((token) => token.variable === value)
  if (configured) return configured.val
  const pixels = /^(-?\d+(?:\.\d+)?)px$/.exec(value)
  return pixels ? Number(pixels[1]) : value
}

const renderButton = (size?: any) =>
  render(
    <TamaguiProvider config={conf} defaultTheme="light">
      <Button size={size}>Save</Button>
    </TamaguiProvider>
  ).getByRole('button')

// v5's numeric scales pin the frozen geometry: same heights as v6, with v5's
// own text and spacing (14px type on a 21px line, 7px vertical padding).
describe('button sizes under the v5 config', () => {
  it('renders md with v5 keys and pinned geometry', () => {
    const frame = renderButton('md')
    const frameStyle = getComputedStyle(frame)
    const textStyle = getComputedStyle(frame.querySelector('span')!)

    expect(frameStyle.minHeight).toBe('38px')
    expect(tokenValue(frameStyle.paddingBlock, conf.tokensParsed.space)).toBe(7)
    const font = conf.fontsParsed[conf.defaultFontToken]
    expect(tokenValue(textStyle.fontSize, font.size as any)).toBe(14)
    expect(tokenValue(textStyle.lineHeight, font.lineHeight as any)).toBe(21)
  })
})

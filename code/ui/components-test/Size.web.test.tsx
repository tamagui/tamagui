import '@testing-library/jest-dom'

import { defaultConfig } from '@tamagui/config/v6'
import {
  SizeContext as CoreSizeContext,
  TamaguiProvider,
  createTamagui,
} from '@tamagui/core'
import { themed } from '@tamagui/helpers-icon'
import { SizeContext } from '@tamagui/size'
import { Tabs } from '@tamagui/tabs'
import { render } from '@testing-library/react'
import type { FC } from 'react'
import { Button, SizeContext as TamaguiSizeContext } from 'tamagui'
import { describe, expect, test } from 'vitest'

const config = createTamagui(defaultConfig)

const tokenValue = (
  value: string,
  tokens: Record<string, { val: unknown; variable: string }>
) => {
  const configured = Object.values(tokens).find((token) => token.variable === value)
  if (configured) return configured.val
  const pixels = /^(-?\d+(?:\.\d+)?)px$/.exec(value)
  return pixels ? Number(pixels[1]) : value
}

const CaptureIcon = themed(((props: any) => (
  <output data-testid="icon" data-size={props.size} />
)) as FC<any>)

function renderButton(size?: any) {
  const rendered = render(
    <TamaguiProvider config={config} defaultTheme="light">
      <Button size={size} icon={CaptureIcon}>
        Save
      </Button>
    </TamaguiProvider>
  )
  const button = rendered.getByRole('button')
  const frame = getComputedStyle(button)
  // jsdom's cascade loses the min-height class behind the base view reset, so
  // read the rule the class points at
  const minHeightClass = [...button.classList].find((name) => name.startsWith('_mh-'))
  const minHeight = minHeightClass
    ? [...document.styleSheets]
        .flatMap((sheet) => [...sheet.cssRules])
        .find((rule) => rule.cssText.startsWith(`.${minHeightClass} `))
        ?.cssText.match(/min-height: ([^;]+);/)?.[1]
    : undefined
  const text = getComputedStyle(rendered.getByText('Save'))
  const result = {
    height: frame.height,
    minHeight: minHeight && tokenValue(minHeight, config.tokensParsed.size),
    paddingVertical: tokenValue(frame.paddingBlock, config.tokensParsed.space),
    paddingHorizontal: tokenValue(frame.paddingInline, config.tokensParsed.space),
    fontSize: tokenValue(text.fontSize, config.fontsParsed.body.size),
    lineHeight: tokenValue(text.lineHeight, config.fontsParsed.body.lineHeight),
    icon: Number(rendered.getByTestId('icon').dataset.size),
  }
  rendered.unmount()
  return result
}

describe('named control sizes on web', () => {
  test('md is a recipe of tokens and never a height', () => {
    expect(renderButton('md')).toEqual({
      height: '',
      minHeight: undefined,
      paddingVertical: 8,
      paddingHorizontal: 16,
      fontSize: 14,
      lineHeight: 20,
      icon: 16,
    })
    expect(renderButton()).toEqual(renderButton('md'))
  })

  test('sm and lg follow the config table', () => {
    expect(renderButton('sm')).toMatchObject({
      height: '',
      paddingVertical: 6,
      paddingHorizontal: 12,
      fontSize: 14,
      lineHeight: 20,
      icon: 16,
    })
    expect(renderButton('lg')).toMatchObject({
      height: '',
      paddingVertical: 8,
      paddingHorizontal: 24,
      fontSize: 16,
      lineHeight: 24,
      icon: 16,
    })
  })

  test('a token key honestly indexes the config scales', () => {
    expect(renderButton('$4')).toMatchObject({
      minHeight: 16,
      paddingHorizontal: config.tokensParsed.space['4'].val,
      fontSize: config.fontsParsed.body.size['4'].val,
    })
  })

  test('shares one singleton through size, core, and tamagui exports', () => {
    expect(CoreSizeContext).toBe(SizeContext)
    expect(TamaguiSizeContext).toBe(SizeContext)
  })

  test('passes the Tabs size context to themed icons', () => {
    const rendered = render(
      <TamaguiProvider config={config} defaultTheme="light">
        <Tabs value="tab" size="lg">
          <CaptureIcon />
        </Tabs>
      </TamaguiProvider>
    )

    expect(rendered.getByTestId('icon')).toHaveAttribute('data-size', '16')
  })
})

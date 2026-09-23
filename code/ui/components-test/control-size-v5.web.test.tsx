import '@testing-library/jest-dom'

import { defaultConfig as v5Config } from '@tamagui/config/v5'
import { TamaguiProvider, createTamagui } from '@tamagui/core'
import { render } from '@testing-library/react'
import { Card, Input, Select, Slider, Tabs, ToggleGroup } from 'tamagui'
import { describe, expect, it } from 'vitest'

const conf = createTamagui(v5Config as any)

// jsdom does not implement ResizeObserver or IntersectionObserver
global.ResizeObserver = class ResizeObserver {
  constructor(_cb: any) {}
  observe() {}
  unobserve() {}
  disconnect() {}
} as any

global.IntersectionObserver = class IntersectionObserver {
  constructor(_cb: any) {}
  observe() {}
  unobserve() {}
  disconnect() {}
} as any

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

describe('control sizes under the v5 config', () => {
  it('renders Input md with v5 keys', () => {
    const { getByRole } = render(
      <TamaguiProvider config={conf} defaultTheme="light">
        <Input size="md" aria-label="test-input" />
      </TamaguiProvider>
    )
    const input = getByRole('textbox')
    const style = getComputedStyle(input)
    const font = conf.fontsParsed[conf.defaultFontToken]
    expect(tokenValue(style.fontSize, font.size as any)).toBe(14)
    expect(tokenValue(style.lineHeight, font.lineHeight as any)).toBe(21)
  })

  it('renders Input sm with v5 keys and no 1.5 token fallback', () => {
    const { getByRole } = render(
      <TamaguiProvider config={conf} defaultTheme="light">
        <Input size="sm" aria-label="test-input-sm" />
      </TamaguiProvider>
    )
    const input = getByRole('textbox')
    const style = getComputedStyle(input)

    // v5 sm has paddingBlock '2' (= 7px), NOT '1.5' (= 1.5px css fallback)
    const paddingBlock = style.paddingBlock || style.paddingTop
    expect(tokenValue(paddingBlock, conf.tokensParsed.space)).toBe(7)
    expect(tokenValue(style.borderRadius, conf.tokensParsed.radius)).toBe(5)
  })

  it('renders Select.Trigger md with v5 keys', () => {
    const { getByRole } = render(
      <TamaguiProvider config={conf} defaultTheme="light">
        <Select size="md">
          <Select.Trigger>
            <Select.Value />
          </Select.Trigger>
        </Select>
      </TamaguiProvider>
    )
    const trigger = getByRole('combobox')
    const style = getComputedStyle(trigger)

    const paddingBlock = style.paddingBlock || style.paddingTop
    const paddingInline = style.paddingInline || style.paddingLeft
    expect(tokenValue(paddingBlock, conf.tokensParsed.space)).toBe(7)
    // In v5 sizing ladder, paddingInline is $3.5 (= 16px)
    expect(tokenValue(paddingInline, conf.tokensParsed.space)).toBe(16)
    expect(tokenValue(style.borderRadius, conf.tokensParsed.radius)).toBe(5)
  })

  it('renders Tabs.Tab md with v5 keys', () => {
    const { getByRole } = render(
      <TamaguiProvider config={conf} defaultTheme="light">
        <Tabs size="md" defaultValue="tab1">
          <Tabs.List>
            <Tabs.Tab value="tab1">Tab 1</Tabs.Tab>
          </Tabs.List>
        </Tabs>
      </TamaguiProvider>
    )
    const tab = getByRole('tab')
    const style = getComputedStyle(tab)

    const paddingBlock = style.paddingBlock || style.paddingTop
    const paddingInline = style.paddingInline || style.paddingLeft
    expect(tokenValue(paddingBlock, conf.tokensParsed.space)).toBe(7)
    expect(tokenValue(paddingInline, conf.tokensParsed.space)).toBe(16)
    expect(tokenValue(style.borderRadius, conf.tokensParsed.radius)).toBe(5)
  })

  it('renders ToggleGroup.Item md with v5 keys and control height', () => {
    const { getByRole } = render(
      <TamaguiProvider config={conf} defaultTheme="light">
        <ToggleGroup type="single">
          <ToggleGroup.Item value="a" size="md">
            A
          </ToggleGroup.Item>
        </ToggleGroup>
      </TamaguiProvider>
    )
    const item = getByRole('button')
    const style = getComputedStyle(item)

    // outer height is 36 + 2 = 38px
    expect(style.width).toBe('38px')
    expect(style.height).toBe('38px')
    expect(tokenValue(style.borderRadius, conf.tokensParsed.radius)).toBe(5)
  })

  it('renders Card md with v5 keys', () => {
    const { container } = render(
      <TamaguiProvider config={conf} defaultTheme="light">
        <Card size="md" id="test-card">
          <Card.Header id="test-card-header">Header</Card.Header>
        </Card>
      </TamaguiProvider>
    )
    const card = container.querySelector('#test-card')
    const header = container.querySelector('#test-card-header')
    expect(card).toBeTruthy()
    expect(header).toBeTruthy()
    const cardStyle = getComputedStyle(card as Element)
    const headerStyle = getComputedStyle(header as Element)

    expect(tokenValue(cardStyle.borderRadius, conf.tokensParsed.radius)).toBe(5)
    // In v5 sizing ladder, paddingInline is $3.5 (= 16px)
    expect(tokenValue(headerStyle.padding, conf.tokensParsed.space)).toBe(16)
  })

  it('renders Slider md with v5 track and thumb geometry', () => {
    const { container } = render(
      <TamaguiProvider config={conf} defaultTheme="light">
        <Slider size="md" defaultValue={[50]}>
          <Slider.Track id="test-slider-track">
            <Slider.TrackActive />
          </Slider.Track>
          <Slider.Thumb index={0} id="test-slider-thumb" />
        </Slider>
      </TamaguiProvider>
    )
    const track = container.querySelector('#test-slider-track')
    const thumb = container.querySelector('#test-slider-thumb')
    expect(track).toBeTruthy()
    expect(thumb).toBeTruthy()
    const trackStyle = getComputedStyle(track as Element)
    const thumbStyle = getComputedStyle(thumb as Element)

    expect(trackStyle.height).toBe('6px')
    // In v5 font.lineHeight['3'] is 21px
    expect(thumbStyle.width).toBe('21px')
    expect(thumbStyle.height).toBe('21px')
  })
})

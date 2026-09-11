import { defaultConfig } from '@tamagui/config/v6'
import { TamaguiProvider, createTamagui } from '@tamagui/core'
import { themed } from '@tamagui/helpers-icon'
import { Tabs } from '@tamagui/tabs'
import { createRequire } from 'node:module'
import type { FC } from 'react'
import TestRenderer, { act } from 'react-test-renderer'
import { Button } from 'tamagui'
import { describe, expect, test } from 'vitest'

const config = createTamagui(defaultConfig)
const Probe = 'SizeProbe' as any
const require = createRequire(import.meta.url)

const CaptureIcon = themed(((props: any) => (
  <Probe testID="icon" size={props.size} />
)) as FC<any>)

function flattenStyle(style: unknown): Record<string, unknown> {
  if (Array.isArray(style)) return Object.assign({}, ...style.map(flattenStyle))
  return (style as Record<string, unknown>) || {}
}

async function renderButton(size?: any) {
  let rendered: TestRenderer.ReactTestRenderer | null = null
  await act(async () => {
    rendered = TestRenderer.create(
      <TamaguiProvider config={config} defaultTheme="light">
        <Button size={size} icon={CaptureIcon}>
          Save
        </Button>
      </TamaguiProvider>
    )
  })
  const root = rendered!.root
  const frame = flattenStyle(
    root.find((node) => node.type === 'View' && node.props.role === 'button').props.style
  )
  const text = flattenStyle(
    root.find((node) => node.type === 'Text' && node.props.children === 'Save').props
      .style
  )
  return {
    height: frame.height,
    minHeight: frame.minHeight,
    paddingVertical: frame.paddingTop,
    paddingHorizontal: frame.paddingLeft,
    fontSize: text.fontSize,
    lineHeight: text.lineHeight,
    icon: root.find((node) => node.props.testID === 'icon').props.size,
  }
}

describe('named control sizes on native', () => {
  test('md is a recipe of tokens and never a height', async () => {
    expect(await renderButton('md')).toEqual({
      height: undefined,
      minHeight: undefined,
      paddingVertical: 8,
      paddingHorizontal: 16,
      fontSize: 14,
      lineHeight: 20,
      icon: 16,
    })
    expect(await renderButton()).toEqual(await renderButton('md'))
  })

  test('sm and lg follow the config table', async () => {
    expect(await renderButton('sm')).toMatchObject({
      height: undefined,
      paddingVertical: 6,
      paddingHorizontal: 12,
      fontSize: 14,
      lineHeight: 20,
      icon: 16,
    })
    expect(await renderButton('lg')).toMatchObject({
      height: undefined,
      paddingVertical: 8,
      paddingHorizontal: 24,
      fontSize: 16,
      lineHeight: 24,
      icon: 16,
    })
  })

  test('a token key honestly indexes the config scales', async () => {
    expect(await renderButton('$4')).toMatchObject({
      minHeight: 16,
      paddingHorizontal: config.tokensParsed.space['4'].val,
      fontSize: config.fontsParsed.body.size['4'].val,
    })
  })

  test('shares the size singleton through the externalized native CJS graph', () => {
    const direct = require('@tamagui/size').SizeContext
    const throughCore = require('@tamagui/core/native-test').SizeContext

    expect(throughCore).toBe(direct)
  })

  test('passes the Tabs size context to themed icons', async () => {
    let rendered: TestRenderer.ReactTestRenderer | null = null
    await act(async () => {
      rendered = TestRenderer.create(
        <TamaguiProvider config={config} defaultTheme="light">
          <Tabs value="tab" size="lg">
            <CaptureIcon />
          </Tabs>
        </TamaguiProvider>
      )
    })

    expect(rendered!.root.find((node) => node.props.testID === 'icon').props.size).toBe(
      16
    )
  })
})

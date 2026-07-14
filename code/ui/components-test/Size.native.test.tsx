import { defaultConfig } from '@tamagui/config/v6'
import { TamaguiProvider, createTamagui } from '@tamagui/core'
import { themed } from '@tamagui/helpers-icon'
import { createSizeTable, resolveTokenSize, type CreatedSizeTable } from '@tamagui/size'
import { Tabs } from '@tamagui/tabs'
import { createRequire } from 'node:module'
import type { FC } from 'react'
import TestRenderer, { act } from 'react-test-renderer'
import { describe, expect, test } from 'vitest'

const config = createTamagui(defaultConfig)
const Probe = 'SizeProbe' as any
const require = createRequire(import.meta.url)

const first = createSizeTable(
  {
    small: { frame: { height: 28 }, text: { fontSize: 13 }, icon: 14 },
    large: { frame: { height: 44 }, text: { fontSize: 17 }, icon: 22 },
  } as const,
  'small'
)

const second = createSizeTable(
  {
    small: { frame: { height: 20 }, text: { fontSize: 11 }, icon: 10 },
    large: { frame: { height: 36 }, text: { fontSize: 15 }, icon: 18 },
  } as const,
  'small'
)

type AnyTable = CreatedSizeTable<any, any>

function TableValue({ table, id }: { table: AnyTable; id: string }) {
  const { size } = table.Context.useStyledContext()
  const value = table.resolve(size)
  return (
    <Probe
      testID={id}
      value={`${value.frame.height}:${value.text.fontSize}:${value.icon}`}
    />
  )
}

function IndependentTables({ firstSize }: { firstSize: 'small' | 'large' }) {
  return (
    <>
      <first.Context.Provider size={firstSize}>
        <TableValue table={first} id="first-sibling" />
      </first.Context.Provider>
      <second.Context.Provider size="small">
        <TableValue table={second} id="second-sibling" />
      </second.Context.Provider>

      <first.Context.Provider size={firstSize}>
        <TableValue table={first} id="first-outer" />
        <second.Context.Provider size="small">
          <TableValue table={first} id="first-through-second" />
          <TableValue table={second} id="second-inner" />
        </second.Context.Provider>
      </first.Context.Provider>

      <second.Context.Provider size="small">
        <TableValue table={second} id="second-outer" />
        <first.Context.Provider size={firstSize}>
          <TableValue table={second} id="second-through-first" />
          <TableValue table={first} id="first-inner" />
        </first.Context.Provider>
      </second.Context.Provider>
    </>
  )
}

const CaptureIcon = themed(((props: any) => (
  <Probe testID="tabs-icon" size={props.size} />
)) as FC<any>)

function value(rendered: TestRenderer.ReactTestRenderer, id: string) {
  return rendered.root.find((node) => node.props.testID === id).props.value
}

describe('opt-in size primitives on native', () => {
  test('isolates same-name tables as siblings and nested in both directions', async () => {
    let rendered: TestRenderer.ReactTestRenderer | null = null
    await act(async () => {
      rendered = TestRenderer.create(<IndependentTables firstSize="small" />)
    })

    expect(value(rendered!, 'first-sibling')).toBe('28:13:14')
    expect(value(rendered!, 'second-sibling')).toBe('20:11:10')
    expect(value(rendered!, 'first-through-second')).toBe('28:13:14')
    expect(value(rendered!, 'second-inner')).toBe('20:11:10')
    expect(value(rendered!, 'second-through-first')).toBe('20:11:10')
    expect(value(rendered!, 'first-inner')).toBe('28:13:14')

    await act(async () => {
      rendered!.update(<IndependentTables firstSize="large" />)
    })

    expect(value(rendered!, 'first-sibling')).toBe('44:17:22')
    expect(value(rendered!, 'first-through-second')).toBe('44:17:22')
    expect(value(rendered!, 'first-inner')).toBe('44:17:22')
    expect(value(rendered!, 'second-sibling')).toBe('20:11:10')
    expect(value(rendered!, 'second-inner')).toBe('20:11:10')
    expect(value(rendered!, 'second-through-first')).toBe('20:11:10')
  })

  test('projects true, explicit tokens, and raw numbers through active scales', () => {
    const extras = { tokens: config.tokensParsed, font: config.fontsParsed.$body }
    const defaultSize = config.settings.defaultSize
    const defaults = config.settings.defaultTokens
    const projected = resolveTokenSize(true, extras)

    expect(projected.frame.size).toBe(config.tokensParsed.size[defaultSize])
    expect(projected.frame.space).toBe(
      config.tokensParsed.space[defaults?.space ?? defaultSize]
    )
    expect(projected.frame.radius).toBe(
      config.tokensParsed.radius[defaults?.radius ?? defaultSize]
    )
    expect(projected.text.fontSize).toBe(
      config.fontsParsed.$body.size[defaults?.fontSize ?? defaultSize]
    )
    expect(projected.text.lineHeight).toBe(
      config.fontsParsed.$body.lineHeight[defaults?.fontSize ?? defaultSize]
    )
    expect(projected.icon).toBe(
      config.fontsParsed.$body.size[defaults?.fontSize ?? defaultSize]
    )
    expect(resolveTokenSize('$4', extras)).toEqual({
      frame: {
        size: config.tokensParsed.size.$4,
        space: config.tokensParsed.space.$4,
        radius: config.tokensParsed.radius.$4,
      },
      text: {
        fontSize: config.fontsParsed.$body.size.$4,
        lineHeight: config.fontsParsed.$body.lineHeight.$4,
      },
      icon: config.fontsParsed.$body.size.$4,
    })
    expect(resolveTokenSize(24, extras)).toEqual({
      frame: { size: 24, space: 24, radius: 24 },
      text: { fontSize: 24, lineHeight: undefined },
      icon: 24,
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
          <Tabs value="tab" size="$4">
            <CaptureIcon />
          </Tabs>
        </TamaguiProvider>
      )
    })

    expect(
      rendered!.root.find((node) => node.props.testID === 'tabs-icon').props.size
    ).toBe(config.fontsParsed.$body.size.$4.val)
  })
})

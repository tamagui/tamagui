import '@testing-library/jest-dom'

import { defaultConfig } from '@tamagui/config/v6'
import {
  SizeContext as CoreSizeContext,
  TamaguiProvider,
  createTamagui,
} from '@tamagui/core'
import { themed } from '@tamagui/helpers-icon'
import {
  SizeContext,
  createSizeTable,
  resolveTokenSize,
  type CreatedSizeTable,
} from '@tamagui/size'
import { Tabs } from '@tamagui/tabs'
import { render } from '@testing-library/react'
import type { FC } from 'react'
import { SizeContext as TamaguiSizeContext } from 'tamagui'
import { describe, expect, test } from 'vitest'

const config = createTamagui(defaultConfig)

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
    <output data-testid={id}>
      {value.frame.height}:{value.text.fontSize}:{value.icon}
    </output>
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
  <output data-testid="tabs-icon" data-size={props.size} />
)) as FC<any>)

describe('opt-in size primitives on web', () => {
  test('isolates same-name tables as siblings and nested in both directions', () => {
    const rendered = render(<IndependentTables firstSize="small" />)

    expect(rendered.getByTestId('first-sibling')).toHaveTextContent('28:13:14')
    expect(rendered.getByTestId('second-sibling')).toHaveTextContent('20:11:10')
    expect(rendered.getByTestId('first-through-second')).toHaveTextContent('28:13:14')
    expect(rendered.getByTestId('second-inner')).toHaveTextContent('20:11:10')
    expect(rendered.getByTestId('second-through-first')).toHaveTextContent('20:11:10')
    expect(rendered.getByTestId('first-inner')).toHaveTextContent('28:13:14')

    rendered.rerender(<IndependentTables firstSize="large" />)

    expect(rendered.getByTestId('first-sibling')).toHaveTextContent('44:17:22')
    expect(rendered.getByTestId('first-through-second')).toHaveTextContent('44:17:22')
    expect(rendered.getByTestId('first-inner')).toHaveTextContent('44:17:22')
    expect(rendered.getByTestId('second-sibling')).toHaveTextContent('20:11:10')
    expect(rendered.getByTestId('second-inner')).toHaveTextContent('20:11:10')
    expect(rendered.getByTestId('second-through-first')).toHaveTextContent('20:11:10')
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

  test('shares one singleton through size, core, and tamagui exports', () => {
    expect(CoreSizeContext).toBe(SizeContext)
    expect(TamaguiSizeContext).toBe(SizeContext)
  })

  test('passes the Tabs size context to themed icons', () => {
    const rendered = render(
      <TamaguiProvider config={config} defaultTheme="light">
        <Tabs value="tab" size="$4">
          <CaptureIcon />
        </Tabs>
      </TamaguiProvider>
    )

    expect(rendered.getByTestId('tabs-icon')).toHaveAttribute(
      'data-size',
      `${config.fontsParsed.$body.size.$4.val}`
    )
  })
})

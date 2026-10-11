import { describe, expect, test } from 'vitest'

import {
  reduceFlatValueIdentity,
  type ClauseIdentityErrorCode,
  type ClauseIdentityHandler,
} from '../runtime/clauseIdentity'
import { createModifierRegistry } from '../programs/modifierRegistry'
import { parseValue } from '../ast/valueParser'

type Receipt = {
  source: string
  base: string | null
  clauses: Array<{
    authored: string
    chain: string
    modifiers: string[]
    payload: string
    slot: string
  }>
  pending: string[]
  errors: Array<{ code: ClauseIdentityErrorCode; index: number }>
}

const receiptHandler: ClauseIdentityHandler<Receipt> = {
  segment(ctx, start, end, isBase) {
    if (isBase) ctx.base = start < end ? ctx.source.slice(start, end) : null
  },
  chain(ctx) {
    ctx.pending = []
  },
  modifier(ctx, start, end) {
    ctx.pending.push(ctx.source.slice(start, end))
  },
  clause(ctx, start, chainEnd, payloadStart, end, slot) {
    ctx.clauses.push({
      authored: ctx.source.slice(start, end),
      chain: ctx.source.slice(start, chainEnd),
      modifiers: ctx.pending,
      payload: ctx.source.slice(payloadStart, end),
      slot,
    })
  },
  error(ctx, code, index) {
    ctx.errors.push({ code, index })
  },
}

function reduce(source: string): Receipt {
  const receipt: Receipt = { source, base: null, clauses: [], pending: [], errors: [] }
  reduceFlatValueIdentity(source, receiptHandler, receipt)
  return receipt
}

describe('flat value clause identity', () => {
  test('reports authored clause spans and canonical slots in one scan', () => {
    const { pending: _pending, ...receipt } = reduce(
      '  red  active: blue  sm:group-active/card: green  '
    )
    expect(receipt).toEqual({
      source: '  red  active: blue  sm:group-active/card: green  ',
      base: 'red',
      clauses: [
        {
          authored: 'active: blue',
          chain: 'active',
          modifiers: ['active'],
          payload: 'blue',
          slot: 'press',
        },
        {
          authored: 'sm:group-active/card: green',
          chain: 'sm:group-active/card',
          modifiers: ['sm', 'group-active/card'],
          payload: 'green',
          slot: 'group-press/card:sm',
        },
      ],
      errors: [],
    })
  })

  test('reordered sets, aliases, and duplicates reduce to one slot', () => {
    const slots = ['dark:hover:red', 'hover:dark:blue', 'dark:hover:hover:green'].map(
      (source) => reduce(source).clauses[0].slot
    )
    expect(slots).toEqual(['dark:hover', 'dark:hover', 'dark:hover'])
  })

  test('malformed clauses retain the scanner error and source index', () => {
    expect(reduce('red hover:').errors).toEqual([{ code: 'empty-payload', index: 10 }])
    expect(reduce('red hover::blue').errors).toEqual([
      { code: 'empty-modifier', index: 10 },
    ])
    expect(reduce('red rgb(1,2,3').errors).toEqual([
      { code: 'unterminated-function', index: 7 },
    ])
  })

  const configured = createModifierRegistry({
    mediaNames: ['sm', 'lg'],
    themeNames: { dark: {} },
  }).registry
  const configuredCases = [
    'green hover:transparent press:transparent',
    'red sm:blue',
    'red hover:sm:blue',
    'dark:red hover:green',
    '10px sm:20px lg:30px',
    'rgb(1, 2, 3) hover:rgb(4, 5, 6)',
    'hover:red',
    'plain',
  ]

  for (const source of configuredCases) {
    test(`splits ${source} identically before configured classification`, () => {
      const identity = reduce(source)
      const parsed = parseValue(source, configured)
      expect(parsed.ok, `configured registry rejected ${source}`).toBe(true)
      if (parsed.ok) {
        expect({
          base: identity.base,
          clauses: identity.clauses.map(({ modifiers, payload }) => ({
            modifiers,
            payload,
          })),
        }).toEqual(parsed.value)
      }
    })
  }

  test('classification can reject a spelling that identity still reduces', () => {
    const source = 'red nosuchmodifier:blue'
    expect(reduce(source).clauses).toHaveLength(1)
    expect(parseValue(source, configured).ok).toBe(false)
  })
})

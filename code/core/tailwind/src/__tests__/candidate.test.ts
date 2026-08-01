import { getDefaultTamaguiConfig } from '../../../config-default/src'
import { createTamagui, getConfig } from '@tamagui/web'
import { beforeAll, describe, expect, test } from 'vitest'

import { preprocessTailwindClassName } from '../candidate'

beforeAll(() => {
  createTamagui(getDefaultTamaguiConfig() as any)
})

const tokenize = (className: string, rest?: Record<string, any>) =>
  preprocessTailwindClassName({ className, ...rest }, getConfig())

describe('claimed candidates become flat props', () => {
  test('a base candidate resolves through the config', () => {
    expect(tokenize('p-4')).toEqual({ padding: '4' })
  })

  test('modifiers are preserved in the frontend program', () => {
    expect(tokenize('hover:bg-[red]')).toEqual({
      __tamagui_frontend_program_0: {
        property: 'backgroundColor',
        value: {
          base: null,
          clauses: [{ modifiers: ['hover'], payload: 'red' }],
        },
      },
    })
  })

  test('chained modifiers keep their authored order', () => {
    expect(tokenize('sm:hover:bg-[red]')).toEqual({
      __tamagui_frontend_program_0: {
        property: 'backgroundColor',
        value: {
          base: null,
          clauses: [{ modifiers: ['sm', 'hover'], payload: 'red' }],
        },
      },
    })
  })

  test('percentage utilities become their numeric value', () => {
    expect(tokenize('opacity-50')).toEqual({ opacity: 0.5 })
  })

  test('a px arbitrary becomes a number so react native accepts it', () => {
    expect(tokenize('w-[400px]')).toEqual({ width: 400 })
  })

  test('a unit-bearing arbitrary stays a string', () => {
    expect(tokenize('min-h-[100vh]')).toEqual({ minHeight: '100vh' })
  })

  test('underscores inside an arbitrary decode back to spaces', () => {
    expect(tokenize('shadow-[0_2px_8px_#0003]')).toEqual({
      boxShadow: '0 2px 8px #0003',
    })
  })

  test('sizing keywords and fractions lower to CSS', () => {
    expect(tokenize('w-full')).toEqual({ width: '100%' })
    expect(tokenize('w-1/2')).toEqual({ width: '50%' })
  })

  test('a directional border expands to every affected longhand', () => {
    expect(tokenize('border-x-2')).toEqual({
      borderLeftWidth: '2',
      borderRightWidth: '2',
    })
  })

  test('color opacity rides along as a suffix for the shared resolver', () => {
    // the suffix survives tokenization untouched; alpha composition happens once,
    // in core's color resolution, identically on web and native
    expect(tokenize('bg-white/50')).toEqual({ backgroundColor: 'white/50' })
  })

  test('invalid color opacity stays bare for the shared resolver diagnostic', () => {
    expect(tokenize('bg-white/50.5')).toEqual({
      backgroundColor: 'white/50.5',
    })
    expect(tokenize('bg-white/150')).toEqual({
      backgroundColor: 'white/150',
    })
  })

  test('a theme value name resolves like a token so it stays theme-reactive', () => {
    expect(tokenize('bg-background')).toEqual({ backgroundColor: 'background' })
  })

  test('a whole-class utility sets its props directly when unmodified', () => {
    // base util props bypass the `prop` form so non-style keys still resolve
    expect(tokenize('flex-row')).toEqual({ flexDirection: 'row' })
  })

  test('a modified whole-class utility emits a frontend program', () => {
    expect(tokenize('hover:flex-row')).toEqual({
      __tamagui_frontend_program_0: {
        property: 'flexDirection',
        value: {
          base: null,
          clauses: [{ modifiers: ['hover'], payload: 'row' }],
        },
      },
    })
  })
})

describe('unclaimed candidates', () => {
  test('an unknown class stays in className verbatim', () => {
    expect(tokenize('grid-cols-3')).toEqual({ className: 'grid-cols-3' })
  })

  test('unknown classes keep author order and claimed ones are removed', () => {
    expect(tokenize('grid-cols-2 p-4 grid-cols-3')).toEqual({
      className: 'grid-cols-2 grid-cols-3',
      padding: '4',
    })
  })

  test('tamagui never string-merges its own candidates: the last one wins', () => {
    // two paddings collapse to one flat prop; the shared resolver never sees a
    // conflicting pair, so no tailwind-merge equivalent is needed
    expect(tokenize('p-2 p-4')).toEqual({ padding: '4' })
  })
})

describe('className position in the prop pass', () => {
  test('classes expand where className was authored, not at the end', () => {
    const result = tokenize('p-4', { margin: 1 })
    expect(Object.keys(result)).toEqual(['padding', 'margin'])
  })

  test('a prop authored after className wins over the class', () => {
    const result = preprocessTailwindClassName(
      { className: 'p-4', padding: '8' },
      getConfig()
    )
    expect(result.padding).toBe('8')
  })

  test('props with no className are returned untouched', () => {
    const props = { id: 'x' }
    expect(preprocessTailwindClassName(props, getConfig())).toBe(props)
  })
})

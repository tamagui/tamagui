import { getDefaultTamaguiConfig } from '../../../config-default/src'
import { createTamagui, getConfig } from '@tamagui/web'
import { beforeAll, describe, expect, test } from 'vitest'

import { resolveTailwindClassName } from '../candidate'

beforeAll(() => {
  createTamagui(getDefaultTamaguiConfig() as any)
})

const tokenize = (className: string) => resolveTailwindClassName(className, getConfig())

describe('claimed candidates become flat props', () => {
  test('a base candidate resolves through the config', () => {
    expect(tokenize('p-4')).toEqual({ padding: '4' })
  })

  test('modifiers are preserved in the shared conditional spelling', () => {
    expect(tokenize('hover:bg-[red]')).toEqual({
      backgroundColor: { hover: 'red' },
    })
  })

  test('chained modifiers keep their authored order', () => {
    expect(tokenize('sm:hover:bg-[red]')).toEqual({
      backgroundColor: { 'sm:hover': 'red' },
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

  test('logical spacing and gap axes become native-capable props', () => {
    expect(
      tokenize('ps-4 pe-2 pbs-4 pbe-2 -ms-1 me-4 -mbs-1 mbe-4 gap-x-2 gap-y-4')
    ).toEqual({
      paddingInlineStart: '4',
      paddingInlineEnd: '2',
      paddingBlockStart: '4',
      paddingBlockEnd: '2',
      marginInlineStart: '-1',
      marginInlineEnd: '4',
      marginBlockStart: '-1',
      marginBlockEnd: '4',
      columnGap: '2',
      rowGap: '4',
    })
  })

  test('logical border sides preserve width and color meaning', () => {
    expect(tokenize('border-s-2 border-e-white border-bs-2 border-be-white')).toEqual({
      borderInlineStartWidth: '2',
      borderInlineEndColor: 'white',
      borderBlockStartWidth: '2',
      borderBlockEndColor: 'white',
    })
    expect(tokenize('border-s border-e border-bs border-be')).toEqual({
      borderInlineStartWidth: 1,
      borderInlineEndWidth: 1,
      borderBlockStartWidth: 1,
      borderBlockEndWidth: 1,
    })
  })

  test('logical radii and standard flex and aspect conveniences resolve directly', () => {
    expect(tokenize('rounded-s-4 rounded-se-8')).toEqual({
      borderStartStartRadius: '4',
      borderEndStartRadius: '4',
      borderStartEndRadius: '8',
    })
    expect(tokenize('grow shrink-0 aspect-video')).toEqual({
      flexGrow: 1,
      flexShrink: 0,
      aspectRatio: 16 / 9,
    })
  })

  test('size-* sets width and height from the size token', () => {
    expect(tokenize('size-10')).toEqual({ width: '10', height: '10' })
  })

  test('size-full sets both axes to 100%', () => {
    expect(tokenize('size-full')).toEqual({ width: '100%', height: '100%' })
  })

  test('axis insets expand to the matching sides', () => {
    expect(tokenize('inset-x-0')).toEqual({ left: '0', right: '0' })
    expect(tokenize('inset-y-4')).toEqual({ top: '4', bottom: '4' })
  })

  test('text-* color and size stay distinct from alignment', () => {
    expect(tokenize('text-white')).toEqual({ color: 'white' })
    expect(tokenize('text-center')).toEqual({ textAlign: 'center' })
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

  test('a modified whole-class utility keeps its shared conditional spelling', () => {
    expect(tokenize('hover:flex-row')).toEqual({
      flexDirection: { hover: 'row' },
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

  test('a later shorthand drops earlier logical longhands', () => {
    expect(tokenize('ps-2 p-4')).toEqual({ padding: '4' })
    expect(tokenize('p-4 ps-2')).toEqual({
      padding: '4',
      paddingInlineStart: '2',
    })
    expect(tokenize('gap-x-2 gap-4')).toEqual({ gap: '4' })
    expect(tokenize('rounded-s-4 rounded-[6px]')).toEqual({ borderRadius: 6 })
    expect(tokenize('border-s-2 border-[6px]')).toEqual({ borderWidth: 6 })
  })
})

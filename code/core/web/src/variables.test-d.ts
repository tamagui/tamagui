/**
 * type tests for createTamagui({ variables }) inference and <Variables> props
 * (plans/variables.md)
 */

import { describe, expectTypeOf, test } from 'vitest'
import { createTamagui } from './createTamagui'
import type { GenericVariables, VariablesProps, VariablesValues } from './types'

describe('config variables inference', () => {
  test('variables keys merge into every theme type', () => {
    const config = createTamagui({
      tokens: {
        color: { blue: 'blue' },
        space: { 1: 4 },
        size: { 1: 4 },
        radius: { 1: 4 },
        zIndex: { 1: 1 },
      },
      themes: {
        light: { background: '#fff', color: '#000' },
        dark: { background: '#000', color: '#fff' },
      },
      variables: {
        surfaceBorder: '$color',
        disabledOpacity: 0.5,
        accent: { light: '#001', dark: '#ffe' },
      },
    })

    type Themes = (typeof config)['themes']
    expectTypeOf<keyof Themes['light']>().toEqualTypeOf<
      'background' | 'color' | 'surfaceBorder' | 'disabledOpacity' | 'accent'
    >()
    expectTypeOf<Themes['dark']['disabledOpacity']['val']>().toEqualTypeOf<number>()
    // scheme-scoped values collapse to the single scheme value type
    expectTypeOf<Themes['light']['accent']['val']>().toEqualTypeOf<string>()
  })

  test('GenericVariables accepts literals, references, and scheme pairs', () => {
    const good: GenericVariables = {
      ref: '$borderColor',
      literal: 10,
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      scoped: { light: '#fff', dark: '#000' },
    }
    expectTypeOf(good).toMatchTypeOf<GenericVariables>()

    // @ts-expect-error scheme pair requires both light and dark values as VariableValIn
    const bad: GenericVariables = { scoped: { light: [] } }
  })
})

describe('VariablesProps', () => {
  test('values/dark/light accept theme-key records', () => {
    const props: VariablesProps = {
      values: { background: '$color', anything: 10 },
      dark: { background: '#000' },
      light: { background: '#fff' },
    }
    expectTypeOf(props).toMatchTypeOf<VariablesProps>()
  })

  test('values reject non-value types', () => {
    // @ts-expect-error functions are not variable values
    const bad: VariablesValues = { background: () => 'red' }
    // @ts-expect-error objects are not variable values (no nesting)
    const bad2: VariablesValues = { background: { deep: 'red' } }
  })
})

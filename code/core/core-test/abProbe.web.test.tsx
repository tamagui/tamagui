// Engine-contraction A/B: variant and inline flat clauses use the same program
// shape and obey last-restatement-wins.
import { beforeAll, expect, test } from 'vitest'
import config from '../config-default'
import { View, createTamagui, getSplitStyles, styled } from '../web/src'
import { exposeClassProperties } from './utils'

beforeAll(() => {
  process.env.TAMAGUI_AB_LEGACY_PROGRAMS = '1'
  createTamagui(config.getDefaultTamaguiConfig() as any)
})

test('a variant press clause converts to :active; inline restates it', () => {
  const StyledButton = styled(View, {
    variants: {
      variant: {
        prim: {
          backgroundColor: 'press:blue',
        },
      },
    } as const,
  })

  const inline = exposeClassProperties(
    getSplitStyles(
      { variant: 'prim', backgroundColor: 'press:red' },
      StyledButton.staticConfig,
      undefined as any,
      'light',
      { unmounted: false } as any,
      { isAnimated: false, noClass: false, resolveValues: 'auto' } as any
    )
  )
  const className = inline.classNames.backgroundColor
  expect(className).toMatch(/^_b-/)
  const rules = inline.rulesToInsert[className]?.[4] ?? []
  const all = rules.join('\n')
  // The inline clause restated the press clause: red wins, blue is gone.
  expect(all).toContain(':active')
  expect(all).toContain('red')
  expect(all).not.toContain('blue')

  const variantOnly = exposeClassProperties(
    getSplitStyles(
      { variant: 'prim' },
      StyledButton.staticConfig,
      undefined as any,
      'light',
      { unmounted: false } as any,
      { isAnimated: false, noClass: false, resolveValues: 'auto' } as any
    )
  )
  const vClass = variantOnly.classNames.backgroundColor
  const vRules = (variantOnly.rulesToInsert[vClass]?.[4] ?? []).join('\n')
  expect(vRules).toContain(':active')
  expect(vRules).toContain('blue')
})

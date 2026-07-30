// engine-contraction A/B: converted legacy pseudo props must be behaviorally
// equivalent to the legacy pseudo classes — the class names change shape
// (program hash instead of per-value atomic), the emitted behavior must not.
import { beforeAll, expect, test } from 'vitest'
import config from '../config-default'
import { View, createTamagui, getSplitStyles, styled } from '../web/src'

beforeAll(() => {
  process.env.TAMAGUI_AB_LEGACY_PROGRAMS = '1'
  createTamagui(config.getDefaultTamaguiConfig() as any)
})

test('variant pressStyle converts to an :active program clause; inline restates it', () => {
  const StyledButton = styled(View, {
    variants: {
      variant: {
        prim: { pressStyle: { backgroundColor: 'blue' } },
      },
    } as const,
  })

  const inline = getSplitStyles(
    { variant: 'prim', pressStyle: { backgroundColor: 'red' } },
    StyledButton.staticConfig,
    undefined as any,
    'light',
    { unmounted: false } as any,
    { isAnimated: false, noClass: false, resolveValues: 'auto' } as any
  )
  const className = inline.classNames.backgroundColor
  expect(className).toMatch(/^_bc-/)
  const rules = inline.rulesToInsert[className]?.[4] ?? []
  const all = rules.join('\n')
  // the inline pressStyle restated the press clause: red wins, blue is gone
  expect(all).toContain(':active')
  expect(all).toContain('red')
  expect(all).not.toContain('blue')

  const variantOnly = getSplitStyles(
    { variant: 'prim' },
    StyledButton.staticConfig,
    undefined as any,
    'light',
    { unmounted: false } as any,
    { isAnimated: false, noClass: false, resolveValues: 'auto' } as any
  )
  const vClass = variantOnly.classNames.backgroundColor
  const vRules = (variantOnly.rulesToInsert[vClass]?.[4] ?? []).join('\n')
  expect(vRules).toContain(':active')
  expect(vRules).toContain('blue')
})

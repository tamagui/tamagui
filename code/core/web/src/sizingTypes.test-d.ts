/**
 * Type tests for config-driven control sizing.
 *
 * The point of moving the size ladder into `createTamagui({ sizing })` is that
 * `size` becomes typed off the user's config instead of five hand-written unions.
 * That win is only real if `sizing` flows through the SAME inference chain as
 * `settings` (ConfProps -> InferTamaguiConfig -> TamaguiInternalConfig). Bolting
 * `sizing` on outside that chain compiles, looks correct, and silently leaves
 * `TamaguiConfig['sizing']['sizes']` generic, so `SizeName` collapses to `string`
 * and every control accepts any garbage string with no autocomplete.
 *
 * These tests exist to fail loudly in that case. `test 3` is the one that matters.
 *
 * Run with: bun run test:web (from code/core/web)
 */

import { describe, expectTypeOf, test } from 'vitest'
import type {
  GenericSizing,
  InferTamaguiConfig,
  SizeName,
  SizeRecipe,
  SizingDerivations,
} from './types'
import type { ButtonSize } from '../../../ui/tamagui/src/components/Button'
import type { CheckboxSize } from '../../../ui/tamagui/src/components/Checkbox'
import type { ListItemSize } from '../../../ui/tamagui/src/components/ListItem'
import type { RadioGroupSize } from '../../../ui/tamagui/src/components/RadioGroup'
import type { SwitchSize } from '../../../ui/tamagui/src/components/Switch'

// =============================================================================
// Mock config
// =============================================================================

const mockSizing = {
  default: 'md',
  sizes: {
    xs: {
      fontSize: 'xs',
      controlFontSize: 'xs',
      paddingInline: '2',
      paddingBlock: '1',
      gap: '1',
      radius: 'sm',
    },
    md: {
      fontSize: 'sm',
      controlFontSize: 'base',
      paddingInline: '4',
      paddingBlock: '2',
      gap: '2',
      radius: 'md',
    },
    // a name that is NOT in the shipped v6 ladder: the proof that user keys flow
    xxl: {
      fontSize: '2xl',
      controlFontSize: '2xl',
      paddingInline: '10',
      paddingBlock: '3',
      gap: '3',
      radius: 'xl',
    },
  },
  height: ({ lineHeight, paddingBlock }) => lineHeight + paddingBlock * 2,
  icon: ({ fontSize }) => Math.ceil(fontSize / 4) * 4,
  square: ({ controlFontSize }) => Math.round(controlFontSize * 1.4),
} satisfies GenericSizing

// =============================================================================

describe('SizeRecipe', () => {
  test('a rung carries token keys, never pixels', () => {
    expectTypeOf<SizeRecipe['fontSize']>().toEqualTypeOf<string>()
    expectTypeOf<SizeRecipe['paddingBlock']>().toEqualTypeOf<string>()
    // a number here would mean someone reintroduced a frozen px ladder
    expectTypeOf<SizeRecipe['paddingBlock']>().not.toEqualTypeOf<number>()
  })
})

describe('SizingDerivations', () => {
  test('derivations are px in, px out', () => {
    expectTypeOf<SizingDerivations['height']>().returns.toEqualTypeOf<number>()
    expectTypeOf<SizingDerivations['icon']>().returns.toEqualTypeOf<number>()
    expectTypeOf<SizingDerivations['square']>().returns.toEqualTypeOf<number>()
  })
})

describe('SizeName inference', () => {
  // -- test 1: the shipped ladder is always available -------------------------
  test('unaugmented config still autocompletes the v6 names', () => {
    expectTypeOf<'md'>().toMatchTypeOf<SizeName>()
    expectTypeOf<'xs'>().toMatchTypeOf<SizeName>()
    expectTypeOf<'xl'>().toMatchTypeOf<SizeName>()
  })

  // -- test 2: THE IMPORTANT ONE ---------------------------------------------
  // If `sizing` was bolted on outside the ConfProps/InferTamaguiConfig chain,
  // `sizes` stays Record<string, SizeRecipe>, `keyof` widens to `string`, and
  // SizeName becomes `string`. That compiles everywhere and kills the feature.
  test('SizeName does NOT collapse to string', () => {
    expectTypeOf<SizeName>().not.toEqualTypeOf<string>()
    // a nonsense name must be rejected
    expectTypeOf<'not-a-size'>().not.toMatchTypeOf<SizeName>()
  })

  // -- test 3: user keys actually flow through --------------------------------
  test('a custom size name reaches SizeName through the config', () => {
    type Conf = InferTamaguiConfig<{ sizing: typeof mockSizing }>
    type Names = Extract<keyof Conf['sizing']['sizes'], string>
    expectTypeOf<'xxl'>().toMatchTypeOf<Names>()
    expectTypeOf<Names>().not.toEqualTypeOf<string>()
  })
})

describe('component size props', () => {
  test('the five skin aliases are SizeName | boolean, not restated unions', () => {
    expectTypeOf<ButtonSize>().toEqualTypeOf<SizeName | boolean>()
    expectTypeOf<CheckboxSize>().toEqualTypeOf<SizeName | boolean>()
    expectTypeOf<RadioGroupSize>().toEqualTypeOf<SizeName | boolean>()
    expectTypeOf<SwitchSize>().toEqualTypeOf<SizeName | boolean>()
    expectTypeOf<ListItemSize>().toEqualTypeOf<SizeName | boolean>()
  })
})

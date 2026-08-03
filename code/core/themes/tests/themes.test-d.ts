import { describe, expectTypeOf, test } from 'vitest'

import { themes as authoredThemes } from '../src/builder'
import { themes, type ThemeNames } from '../src/generated'

describe('v6 theme types', () => {
  test('keeps generated names and keys finite', () => {
    expectTypeOf<'light_brand_level2_level2'>().toMatchTypeOf<ThemeNames>()
    expectTypeOf(themes.light_red_level2.background).toEqualTypeOf<string>()
    expectTypeOf(authoredThemes.dark_inverse_level2.color11).toEqualTypeOf<string>()

    // @ts-expect-error unknown theme names are rejected
    themes.light_blue
    // @ts-expect-error the v6 ramp has eleven values
    themes.light.color12
    // @ts-expect-error component themes are not generated
    themes.light_Button
  })
})

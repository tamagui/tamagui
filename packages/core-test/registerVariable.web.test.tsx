import { expect, test } from 'vitest'

import { createVariable } from '../web/src/createVariable'
import { variableToCSS } from '../web/src/helpers/registerCSSVariable'

test(`ensures unitless variables in CSS don't add px suffix`, () => {
  expect(
    variableToCSS(
      createVariable({
        key: `zi`,
        name: `zi`,
        val: 1,
      }),
      true
    )
  ).toBe('--zi:1')
})

test(`custom prefix is added to css variable`, () => {
  process.env.TAMAGUI_CSS_VARIABLE_PREFIX = 'custom-'

  expect(
    variableToCSS(
      createVariable({
        key: `zi`,
        name: `zi`,
        val: 1,
      }),
      true
    )
  ).toBe('--custom-zi:1')
})

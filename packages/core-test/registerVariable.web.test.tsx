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

import { beforeAll, expect, test } from 'vitest'

import config from '../config-default-node'
import { createTamagui, getStylesAtomic } from '../core/src'

beforeAll(() => {
  createTamagui(config.getDefaultTamaguiConfig())
})

test(`should expand webkit user-select`, () => {
  expect(
    getStylesAtomic({
      // @ts-ignore
      userSelect: 'none',
    })
  ).toMatchInlineSnapshot(`
    [
      {
        "identifier": "_ussel-none",
        "property": "userSelect",
        "pseudo": undefined,
        "rules": [
          "._ussel-none{user-select:none;-webkit-user-select:none;}",
        ],
        "value": "none",
      },
    ]
  `)
})

test(`should handle decimal placement differently`, () => {
  const out = getStylesAtomic({
    left: 1.11,
    right: 11.1,
  })

  expect(out[0].identifier).toBe(`_l-1-d11px1a`)
  expect(out[1].identifier).toBe(`_r-11-d1px1a`)
})

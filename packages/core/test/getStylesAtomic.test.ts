import { createTamagui, getStylesAtomic } from '@tamagui/core-node'
import { beforeAll, expect, test } from 'vitest'

import config from '../../config-default-node/dist'

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

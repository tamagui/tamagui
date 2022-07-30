import { expect, test } from 'vitest'

import { getStylesAtomic } from './getStylesAtomic'

test(`should expand webkit user-select`, () => {
  expect(
    getStylesAtomic({
      // @ts-ignore
      userSelect: 'none',
    })
  ).toMatchInlineSnapshot(`
    [
      {
        "identifier": "_userSelect-none",
        "property": "userSelect",
        "pseudo": undefined,
        "rules": [
          "._userSelect-none{user-select:none;-webkit-user-select:none;}",
        ],
        "value": "none",
      },
    ]
  `)
})

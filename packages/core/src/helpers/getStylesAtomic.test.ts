import { expect, test } from 'vitest'

import { getStylesAtomic } from './getStylesAtomic'

test(`should expand webkit user-select`, () => {
  expect(
    getStylesAtomic({
      // @ts-ignore
      userSelect: 'none',
    })
  ).toMatchSnapshot()
})

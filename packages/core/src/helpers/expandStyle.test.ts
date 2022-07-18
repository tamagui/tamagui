import { expect, test } from 'vitest'

import { expandStyle } from './expandStyle'

test(`should expand webkit user-select`, () => {
  expect(expandStyle('userSelect', 'none')).toStrictEqual([
    ['userSelect', 'none'],
    ['WebkitUserSelect', 'none'],
  ])
})

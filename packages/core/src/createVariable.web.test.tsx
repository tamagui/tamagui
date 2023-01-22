import { expect, test } from 'vitest'

import { createCSSVariable } from './createVariable'

test('dots', () => {
  expect(createCSSVariable('yellow.10')).toBe('var(--yellow101a)')
})

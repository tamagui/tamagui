import { expect, test } from 'vitest'

import { createCSSVariable } from '../core/src'

test('dots', () => {
  expect(createCSSVariable('yellow.10')).toBe('var(--yellow101a)')
})

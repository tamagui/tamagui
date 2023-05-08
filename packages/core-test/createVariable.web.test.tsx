import { expect, test } from 'vitest'

import { createCSSVariable } from '../core/src'

test('name with .', () => {
  expect(createCSSVariable('yellow.10')).toBe('var(--yellowd0t1046)')
})

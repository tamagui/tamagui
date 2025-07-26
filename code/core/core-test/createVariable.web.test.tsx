import { expect, test } from 'vitest'

import { createCSSVariable } from '@tamagui/core'

test('name with .', () => {
  expect(createCSSVariable('yellow.10')).toBe('var(--yellow--10)')
})

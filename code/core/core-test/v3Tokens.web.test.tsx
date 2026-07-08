import { expect, test } from 'vitest'

import { tokens } from '../themes/src/v3-tokens'

test('v3 tokens do not include true aliases', () => {
  expect(tokens.size).not.toHaveProperty('$true')
  expect(tokens.space).not.toHaveProperty('true')
  expect(tokens.space).not.toHaveProperty('-true')
  expect(tokens.radius).not.toHaveProperty('true')
})

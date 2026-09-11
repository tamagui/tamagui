import { createVariable, getSizedElevation } from 'tamagui'
import { expect, test } from 'vitest'

test('elevation resolves the v3 shadow-color theme key', () => {
  const shadowColor = createVariable({
    key: 'shadow-color',
    name: 'shadow-color',
    val: 'rgba(0, 0, 0, 0.12)',
  })

  const result = getSizedElevation(4, {
    theme: { 'shadow-color': shadowColor },
    tokens: {},
  } as any)

  expect(result?.shadowColor).toBe(shadowColor)
  expect(result?.shadowOffset).toEqual({ height: 2, width: 0 })
  expect(result?.shadowRadius).toBe(4)
})

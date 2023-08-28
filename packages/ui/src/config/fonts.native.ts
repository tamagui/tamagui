/*
we use system fonts for native to give a more native feeling to the app
you can safely delete this file and just use the same font we use on web
*/
import { createFont, getVariableValue } from 'tamagui'

const headingSize = {
  1: 11,
  2: 12,
  3: 13,
  4: 14,
  true: 14,
  5: 16,
  6: 18,
  7: 20,
  8: 23,
  9: 30,
  10: 46,
  11: 55,
  12: 62,
  13: 72,
  14: 92,
  15: 114,
  16: 134,
}

export const headingFont = createFont({
  family: 'System',
  transform: {
    6: 'uppercase',
    7: 'none',
  },
  weight: {
    3: '500',
    4: '700',
  },
  size: Object.fromEntries(Object.entries(headingSize).map(([k, v]) => [k, getVariableValue(v)])),
  lineHeight: Object.fromEntries(
    Object.entries(headingSize).map(([k, v]) => [k, getVariableValue(v) + 4])
  ),
})

const bodySize = {
  1: 11,
  2: 12,
  3: 13,
  4: 14,
  true: 14,
  5: 16,
  6: 18,
  7: 20,
  8: 23,
  9: 30,
  10: 46,
  11: 55,
  12: 62,
  13: 72,
  14: 92,
  15: 114,
  16: 134,
}
export const bodyFont = createFont({
  family: 'System',
  weight: {
    1: '300',
    // 2 will be 300
    4: '400',
    6: '600',
  },
  size: Object.fromEntries(
    Object.entries(bodySize).map(([k, v]) => [k, getVariableValue(v) * 1.2])
  ),
  lineHeight: Object.fromEntries(
    Object.entries(headingSize).map(([k, v]) => [k, getVariableValue(v) + 5])
  ),
})

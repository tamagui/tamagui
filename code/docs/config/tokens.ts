import { createTokens } from 'tamagui'
import { color } from './colors'

export const size = {
  $0: 0,
  '$0.25': 2,
  '$0.5': 4,
  '$0.75': 8,
  $1: 20,
  '$1.5': 24,
  $2: 28,
  '$2.5': 32,
  $3: 36,
  '$3.5': 40,
  $4: 44,
  $true: 44,
  '$4.5': 48,
  $5: 52,
  $6: 64,
  $7: 74,
  $8: 84,
  $9: 94,
  $10: 104,
  $11: 124,
  $12: 144,
  $13: 164,
  $14: 184,
  $15: 204,
  $16: 224,
  $17: 224,
  $18: 244,
  $19: 264,
  $20: 284,
}

type SizeKeysIn = keyof typeof size
type Sizes = {
  [Key in SizeKeysIn extends `$${infer Key}` ? Key : SizeKeysIn]: number
}
type SizeKeys = `${keyof Sizes extends `${infer K}` ? K : never}`

const spaces = Object.entries(size).map(([k, v]) => {
  return [k, sizeToSpace(v)] as const
})

function sizeToSpace(v: number) {
  if (v === 0) return 0
  if (v === 2) return 0.5
  if (v === 4) return 1
  if (v === 8) return 1.5
  if (v <= 16) return Math.round(v * 0.333)
  return Math.floor(v * 0.7 - 12)
}

const spacesNegative = spaces.slice(1).map(([k, v]) => [`-${k.slice(1)}`, -v])

type SizeKeysWithNegatives =
  | Exclude<`-${SizeKeys extends `$${infer Key}` ? Key : SizeKeys}`, '-0'>
  | SizeKeys

const space: {
  [Key in SizeKeysWithNegatives]: Key extends keyof Sizes ? Sizes[Key] : number
} = {
  ...Object.fromEntries(spaces),
  ...Object.fromEntries(spacesNegative),
} as any

const zIndex = {
  0: 0,
  1: 100,
  2: 200,
  3: 300,
  4: 400,
  5: 500,
}

const radius = {
  0: 0,
  1: 3,
  2: 5,
  3: 7,
  4: 9,
  true: 9,
  5: 10,
  6: 16,
  7: 19,
  8: 22,
  9: 26,
  10: 34,
  11: 42,
  12: 50,
}

export const tokens = createTokens({
  color,
  radius,
  zIndex,
  space,
  size,
})

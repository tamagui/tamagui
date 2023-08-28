import { SizeKeys, Sizes, size } from './token-size'

const spaces = Object.entries(size).map(([k, v]) => {
  return [k, sizeToSpace(v)] as const
})

// a bit odd but keeping backward compat for values >8 while fixing below
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

export const space: {
  [Key in SizeKeysWithNegatives]: Key extends keyof Sizes ? Sizes[Key] : number
} = {
  ...Object.fromEntries(spaces),
  ...Object.fromEntries(spacesNegative),
}

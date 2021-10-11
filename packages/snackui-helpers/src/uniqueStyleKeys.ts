import { getNiceKey } from './getNiceKey'
import { stylePropsAll } from './validStyleProps'

const existing = new Set<string>()

// unique shortkey for each style key
// for atomic styles prefixing and collision dedupe
export const uniqueStyleKeys: { [key: string]: string } = {}
export const uniqueKeyToStyleName: { [key: string]: string } = {}

for (const name in stylePropsAll) {
  addStylePrefix(name)
}

export function getOrCreateStylePrefix(name: string) {
  return uniqueStyleKeys[name] ?? addStylePrefix(name)
}

function addStylePrefix(name: string) {
  let len = 1
  let key = getNiceKey(name)
  while (existing.has(key)) {
    len++
    key = getNiceKey(name, len)
  }
  existing.add(key)
  uniqueStyleKeys[name] = key
  uniqueKeyToStyleName[key] = name
  return key
}

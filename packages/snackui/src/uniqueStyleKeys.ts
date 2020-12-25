import { getNiceKey } from './helpers/getNiceKey'
import { stylePropsText } from './styleProps'

const existing = new Set<string>()

// unique shortkey for each style key
// for atomic styles prefixing and collision dedupe
export const uniqueStyleKeys: { [key: string]: string } = {}

for (const name in stylePropsText) {
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
  return key
}

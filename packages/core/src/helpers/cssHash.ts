import { simpleHash } from '@tamagui/helpers'

// not sure it's worth the extra weight, could be dev time though
// affordances for simple values
export function cssHash(val: string, maxLen = 10) {
  if (val.length < maxLen) {
    let res = ''
    for (let i = 0; i < val.length; i++) {
      const char = val[i]
      if (specials[char]) {
        res += specials[char]
      } else {
        res += validCSS.test(char) ? char : '_' + char.charCodeAt(0).toString()
      }
    }
    return res
  }
  return simpleHash(val)
}

const validCSS = /[a-z0-9]/i

const specials = {
  '.': 'dot',
  ',': '_',
  '%': 'pct',
  '-': 'neg',
}

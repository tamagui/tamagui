import { validateFont } from './helpers/validate'
import { GenericFont } from './types'

export const createFont = <A extends GenericFont>(font: A): A => {
  if (process.env.NODE_ENV === 'development') {
    validateFont(font)
  }

  // fills in any missing values based on size keys being standard
  const sizeKeys = Object.keys(font.size)

  for (const key in font) {
    if (key === 'size' || key === 'family') continue
    const section = font[key] as Object
    const keys = Object.keys(section)

    // fill with first filled in value to start
    let fillVal = section[keys[0]]

    for (const sKey of sizeKeys) {
      if (!(sKey in section)) {
        section[sKey] = fillVal
      } else {
        // if exists, set as the fillVal
        fillVal = section[sKey]
      }
    }
  }

  return Object.freeze(font)
}

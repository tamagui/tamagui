import type { Variable } from '@tamagui/core'
import { getVariableValue } from '@tamagui/core'

export const hexToRGBA = (hex: string, alpha = 1) => {
  if (!isValidHex(hex)) {
    throw new Error('Invalid HEX')
  }
  const chunkSize = Math.floor((hex.length - 1) / 3)
  const hexArr = getChunksFromString(hex.slice(1), chunkSize)
  const [r, g, b, a] = hexArr?.map(convertHexUnitTo256) ?? []
  return `rgba(${r}, ${g}, ${b}, ${getAlphaFloat(a, alpha)})`
}

export const setColorAlpha = (colorIn: string | Variable, alpha = 1) => {
  const color = `${getVariableValue(colorIn)}`
  if (color.startsWith('hsl(')) {
    return color.replace('hsl', 'hsla').replace(')', `, ${alpha})`)
  }
  if (color.startsWith('#')) {
    return hexToRGBA(color, alpha)
  }
  if (color.startsWith('rgb(')) {
    return color.replace('rgb', 'rgba').replace(')', `, ${alpha})`)
  }
  return color
}

const isValidHex = (hex: string) => /^#([A-Fa-f0-9]{3,4}){1,2}$/.test(hex)

const getChunksFromString = (st: string, chunkSize = 0) =>
  st.match(new RegExp(`.{${chunkSize}}`, 'g'))

const convertHexUnitTo256 = (hexStr: string) =>
  parseInt(hexStr.repeat(2 / hexStr.length), 16)

const getAlphaFloat = (a: any, alpha = 1) => {
  if (a !== undefined) {
    return a / 255
  }
  if (typeof alpha !== 'number' || alpha < 0 || alpha > 1) {
    return 1
  }
  return alpha
}

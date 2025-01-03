import { PixelRatio } from 'react-native'

export function resolveRem(rem: string) {
  return PixelRatio.getFontScale() * 16 * Number(rem.replace('rem', '')) + 0.000001
}

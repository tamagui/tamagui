import { Color, colorString } from '@tamagui/cli-color'
import type { TamaguiOptions } from '../types'

export function getPrefixLogs(options?: TamaguiOptions) {
  return (
    options?.prefixLogs ??
    ` 🐥 [tamagui]  ${colorString(Color.FgYellow, options?.platform || 'web')}`
  )
}

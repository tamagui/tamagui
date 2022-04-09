import { TamaguiOptions } from '../types'

export function getPrefixLogs(options?: TamaguiOptions) {
  const { TAMAGUI_TARGET } = process.env
  return options?.prefixLogs ?? ` ${TAMAGUI_TARGET}  | `
}

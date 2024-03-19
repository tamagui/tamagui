import type { TamaguiOptions } from '../types'

export function getPrefixLogs(options?: TamaguiOptions) {
  return options?.prefixLogs ?? ` ${options?.platform || 'web'}  | `
}

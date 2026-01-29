import type { UseSwitchNativeProps } from './types'

/**
 * web version - no-op, native switch logic handled in .native.ts
 */
export function useSwitchNative(_props: UseSwitchNativeProps): React.ReactNode | null {
  return null
}

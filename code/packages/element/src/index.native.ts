export * from './useNativeRef'
export * from './types'

// stub for bundler consistency - on native, this is a no-op that just returns ref and composedRef
export { useNativeRef as useWebRef } from './useNativeRef'
export function getWebElement(): never {
  throw new Error('getWebElement is only available on web')
}

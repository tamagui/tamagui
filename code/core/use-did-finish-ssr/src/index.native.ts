// native has no SSR — always hydrated, always client.
// avoids useContext / useSyncExternalStore subscriptions per Tamagui component
// (Hermes amplifies these ~22x vs JSC/V8).
export { ClientOnly, ClientOnlyContext } from './ClientOnly'

export const useIsClientOnly = (): boolean => true

export function useDidFinishSSR(): boolean {
  return true
}

type FunctionOrValue<Value> = Value extends () => infer X ? X : Value

export function useClientValue<Value>(value?: Value): FunctionOrValue<Value> | undefined {
  // @ts-expect-error matches non-native signature
  return typeof value === 'function' ? value() : value
}

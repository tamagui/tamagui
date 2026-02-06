export function createGlobalState<T extends { enabled: boolean }>(
  key: string,
  defaultValue: T
): {
  get: () => T
  set: (next: T) => void
} {
  const GLOBAL_KEY = `__tamagui_${key}__`

  type TamaguiGlobal = typeof globalThis & {
    [GLOBAL_KEY]?: T
  }

  function getGlobalState(): T {
    const g = globalThis as TamaguiGlobal
    if (!g[GLOBAL_KEY]) {
      // reset on module load so reloadReactNative gets a clean state
      // (globalThis persists across reloads but module scope re-evaluates)
      g[GLOBAL_KEY] = defaultValue
    }
    return g[GLOBAL_KEY]!
  }

  function setGlobalState(newState: T): void {
    ;(globalThis as TamaguiGlobal)[GLOBAL_KEY] = newState
  }

  return {
    get: getGlobalState,
    set: setGlobalState,
  }
}

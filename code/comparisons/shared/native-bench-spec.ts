export const NATIVE_RUNTIME_FIXTURE_VERSION = 2
export const NATIVE_RUNTIME_SCENARIOS = [
  'simple',
  'themed',
  'rich',
  'group',
  'heavy',
  'component',
] as const
export type NativeRuntimeScenario = (typeof NATIVE_RUNTIME_SCENARIOS)[number]

export const NATIVE_COMPILED_FIXTURE_VERSION = 2
export const NATIVE_COMPILED_SCENARIOS = [
  'simple',
  'nested-static',
  'styled-static',
] as const
export type NativeCompiledScenario = (typeof NATIVE_COMPILED_SCENARIOS)[number]

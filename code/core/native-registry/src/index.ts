/**
 * Web/no-native fallback. The registry is a native-only optimization; on web
 * (or when the native module is absent) the mirror still tracks scope state
 * so shared code can resolve slots, but nothing links and nothing commits.
 */
import type {
  LinkHandle,
  RegistryStats,
  ViewSlots,
  ViewStateUpdate,
} from './types'
import {
  ROOT_SCOPE,
  getMirroredStateName,
  removeMirroredScope,
  setMirroredStateName,
} from './mirror'

export type {
  LinkHandle,
  RegistryStats,
  Unlink,
  ViewSlots,
  ViewStateUpdate,
} from './types'
export { ROOT_SCOPE, getMirroredStateName } from './mirror'

export function isAvailable(): boolean {
  return false
}

export function link(
  _ref: unknown,
  _slots: ViewSlots,
  _scopeId?: string
): LinkHandle | null {
  return null
}

export function applyViewStates(_entries: ViewStateUpdate[]): void {}

export function setStateName(stateName: string, scopeId: string = ROOT_SCOPE): void {
  setMirroredStateName(scopeId, stateName)
}

export function removeScope(scopeId: string): void {
  removeMirroredScope(scopeId)
}

export function resolveSlots(
  slots: ViewSlots,
  scopeId: string = ROOT_SCOPE
): Record<string, unknown> {
  const name = getMirroredStateName(scopeId)
  return {
    ...slots.base,
    ...(name ? slots.state?.[name] : undefined),
  }
}

export function getStats(): RegistryStats {
  return { viewCount: 0, commitCount: 0, missCount: 0 }
}

export function processStyleColors(
  props: Record<string, unknown>
): Record<string, unknown> {
  return props
}

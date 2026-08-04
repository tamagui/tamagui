/**
 * Native implementation backed by the TamaguiRegistry Nitro HybridObject.
 * The C++ engine commits style updates directly to Fabric's ShadowTree via
 * UIManager::updateShadowTree (RN >= 0.81), with zero React re-renders.
 */
import { NitroModules } from 'react-native-nitro-modules'
import type { TamaguiRegistry } from './specs/TamaguiRegistry.nitro'
import type {
  LinkHandle,
  RegistryStats,
  Unlink,
  ViewSlots,
  ViewStateSnapshot,
  ViewStateTableUpdate,
  ViewStateUpdate,
} from './types'
import {
  ROOT_SCOPE,
  getMirroredStateName,
  removeMirroredScope,
  setMirroredStateName,
} from './mirror'
import { processStyleColors } from './processStyleColors'

export type {
  LinkHandle,
  RegistryStats,
  Unlink,
  ViewSlots,
  ViewStateSnapshot,
  ViewStateTableUpdate,
  ViewStateUpdate,
} from './types'
export { ROOT_SCOPE, getMirroredStateName } from './mirror'
export { processStyleColors } from './processStyleColors'

/** Full engine surface: typed Nitro methods plus the raw-JSI methods. */
interface Engine extends TamaguiRegistry {
  link(shadowNode: unknown, slots: object, scopeId: string): number
  applyViewStates(entries: ViewStateUpdate[]): void
  updateViewStateTables(entries: ViewStateTableUpdate[]): void
  getViewState(id: number): ViewStateSnapshot | null
}

let engine: Engine | null = null
let initError: unknown = null
try {
  engine = NitroModules.createHybridObject<TamaguiRegistry>(
    'TamaguiRegistry'
  ) as Engine
} catch (error) {
  initError = error
}

export function isAvailable(): boolean {
  return engine !== null
}

function getEngine(): Engine {
  if (engine) return engine
  const detail = initError instanceof Error ? ` ${initError.message}` : ''
  throw new Error(
    `[@tamagui/native-registry] TamaguiRegistry failed to initialize; is react-native-nitro-modules installed and the app rebuilt?${detail}`
  )
}

/**
 * Extract the opaque ShadowNode JSI wrapper from a Fabric host component ref.
 * Same internals access as Unistyles; verified against RN 0.83.
 */
function getShadowNode(ref: unknown): unknown | null {
  const handle = (ref as Record<string, unknown>)?.__internalInstanceHandle as
    | { stateNode?: { node?: unknown } }
    | undefined
  return handle?.stateNode?.node ?? null
}

/**
 * Link a mounted view to the engine. Captures the ShadowNode once, returns
 * a handle keyed by the engine-issued id: unlink never re-derives anything
 * from the ref, so a torn-down ref cannot leave a stale entry behind.
 */
export function link(
  ref: unknown,
  slots: ViewSlots,
  scopeId: string = ROOT_SCOPE
): LinkHandle | null {
  const node = getShadowNode(ref)
  if (!node) return null

  const e = getEngine()
  const prepared: Record<string, unknown> = {}
  if (slots.base) prepared.base = processStyleColors(slots.base)
  if (slots.state) {
    const state: Record<string, unknown> = {}
    for (const name in slots.state) {
      state[name] = processStyleColors(slots.state[name])
    }
    prepared.state = state
  }

  const id = e.link(node, prepared, scopeId)
  let unlinked = false
  return {
    id,
    unlink: () => {
      if (unlinked) return
      unlinked = true
      e.unlink(id)
    },
  }
}

/**
 * Batched per-view state selection: cold entries carry `props` (computed by
 * the caller, colors already processed via processStyleColors), warm entries
 * just name the state. One native commit for the whole batch.
 */
export function applyViewStates(entries: ViewStateUpdate[]): void {
  if (entries.length === 0) return
  getEngine().applyViewStates(entries)
}

/**
 * Fill lazily resolved state-table entries without switching a view to the
 * per-view runtime controller. The native engine commits an entry immediately
 * only when that state is already active for the view's scope.
 */
export function updateViewStateTables(entries: ViewStateTableUpdate[]): void {
  if (entries.length === 0) return
  getEngine().updateViewStateTables(
    entries.map((entry) => ({ ...entry, props: processStyleColors(entry.props) }))
  )
}

/**
 * Set the active state name (e.g. theme name) for a scope and commit the
 * update natively. The JS mirror updates first so any concurrent React
 * render paints the same styles the engine commits.
 */
export function setStateName(stateName: string, scopeId: string = ROOT_SCOPE): void {
  setMirroredStateName(scopeId, stateName)
  getEngine().setStateName(scopeId, stateName)
}

export function removeScope(scopeId: string): void {
  removeMirroredScope(scopeId)
  getEngine().removeScope(scopeId)
}

/** Resolve the props a view should render right now, mirror-consistent. */
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

/** Debug/test introspection of a linked view's engine tables. Not a hot path. */
export function getViewState(id: number): ViewStateSnapshot | null {
  if (!engine) return null
  return engine.getViewState(id)
}

export function getStats(): RegistryStats {
  if (!engine) return { viewCount: 0, commitCount: 0, missCount: 0 }
  return {
    viewCount: engine.getViewCount(),
    commitCount: engine.getCommitCount(),
    missCount: engine.getMissCount(),
  }
}

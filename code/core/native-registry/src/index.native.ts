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
  ViewStateSnapshot,
  ViewStateUpdate,
} from './types'
export { ROOT_SCOPE, getMirroredStateName } from './mirror'
export { processStyleColors } from './processStyleColors.native'

/** Full engine surface: typed Nitro methods plus the raw-JSI methods. */
interface Engine extends TamaguiRegistry {
  link(
    shadowNode: unknown,
    table: ViewSlots | number,
    scopeId: string,
    commitNow: boolean
  ): number
  linkTables(
    shadowNodes: unknown[],
    tableIds: number[],
    scopeIndexes: number[],
    scopes: string[]
  ): void
  applyViewStates(entries: ViewStateUpdate[]): void
  setTableState(tableId: number, state: string, props: Record<string, unknown>): void
  getViewState(id: number): ViewStateSnapshot | null
}

let engine: Engine | null = null
let initError: unknown = null
try {
  engine = NitroModules.createHybridObject<TamaguiRegistry>('TamaguiRegistry') as Engine
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
 * Same internals access as Unistyles; verified against RN 0.86.
 */
function getShadowNode(ref: unknown): unknown | null {
  const handle = (ref as Record<string, unknown>)?.__internalInstanceHandle as
    | { stateNode?: { node?: unknown } }
    | undefined
  return handle?.stateNode?.node ?? null
}

/**
 * Nitro hybrid views parse props only from JSI values (their component
 * descriptor uses the JSI RawPropsParser), so the folly props this engine
 * commits, like React Native's own setNativeProps, abort in them. Every
 * Nitro view declares its `hybridRef` prop; those hosts stay unlinked and
 * re-theme through React renders.
 */
function isNitroHybridView(ref: unknown): boolean {
  const config = (ref as { __viewConfig?: { validAttributes?: object } })?.__viewConfig
  return !!config?.validAttributes && 'hybridRef' in config.validAttributes
}

/**
 * Link a mounted view to the engine. Captures the ShadowNode once, returns
 * a handle keyed by the engine-issued id: unlink never re-derives anything
 * from the ref, so a torn-down ref cannot leave a stale entry behind.
 *
 * `table` is either the view's own slots or the id of a shared table filled
 * by setTableState; every view of one compiler mapping links the same table,
 * so linking sends no props at all. `commitNow` commits the view's active
 * state once, for a host whose render raced a scope change. Props arrive in
 * engine form, already through processStyleColors.
 */
export function link(
  ref: unknown,
  table: ViewSlots | number,
  scopeId: string = ROOT_SCOPE,
  commitNow = false
): LinkHandle | null {
  if (isNitroHybridView(ref)) return null
  const node = getShadowNode(ref)
  if (!node) return null

  const e = getEngine()
  const id = e.link(node, table, scopeId, commitNow)
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
 * Link many host views to shared tables in one native call. Entry i links
 * refs[i] to table tableIds[i] under scope scopes[scopeIndexes[i]]. A host
 * already linked to a table moves to its new entry, and the engine drops
 * linked views that left the tree, so table links need no unlink. The refs
 * are React Native host components (never Nitro views, see link).
 */
export function linkTables(
  refs: unknown[],
  tableIds: number[],
  scopeIndexes: number[],
  scopes: string[]
): void {
  const nodes = new Array(refs.length)
  for (let i = 0; i < refs.length; i++) {
    nodes[i] = getShadowNode(refs[i])
  }
  getEngine().linkTables(nodes, tableIds, scopeIndexes, scopes)
}

/** Unlink by an id from link. Safe to call twice. */
export function unlink(id: number): void {
  getEngine().unlink(id)
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
 * Fill one state of a shared table. Every view linked to the table reads it;
 * views already showing that state commit the new props. Props arrive in
 * engine form, already through processStyleColors.
 */
export function setTableState(
  tableId: number,
  state: string,
  props: Record<string, unknown>
): void {
  getEngine().setTableState(tableId, state, props)
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

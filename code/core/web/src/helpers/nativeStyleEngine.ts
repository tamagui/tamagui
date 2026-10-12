/**
 * Injectable native style engine (plans/native-fast-path.md).
 *
 * When set (native only, experimental), eligible leaf components link their
 * host view to the engine and theme changes commit styles straight to the
 * native ShadowTree with zero React re-renders. The engine contract matches
 * `@tamagui/native-registry`; core stays free of any native dependency and
 * web builds never set an engine.
 *
 * Batching: one theme cascade fires many per-view updates synchronously; a
 * microtask flush folds them into a single applyViewStates call, which the
 * engine commits in one ShadowTree transaction.
 */

import { getVariableValue } from '../createVariable'

/**
 * CSS-shaped Input color styles lower back to React Native TextInput props.
 * Keeping this table beside native color processing makes the runtime and
 * compiler use one RN compatibility boundary after token resolution.
 */
export const nativeTextInputColorProps: Readonly<Record<string, string>> = {
  placeholderTextColor: 'placeholderTextColor',
  selectionColor: 'selectionColor',
  cursorColor: 'cursorColor',
  selectionHandleColor: 'selectionHandleColor',
}

const nativeOutlineProps = [
  'outlineStyle',
  'outlineWidth',
  'outlineColor',
  'outlineOffset',
] as const

const nativeIntrinsicSizeProps = [
  'width',
  'height',
  'minWidth',
  'minHeight',
  'maxWidth',
  'maxHeight',
] as const

/** drops CSS values Fabric cannot accept; state tables use null to clear lower layers */
export function normalizeNativeStyle(
  style: Record<string, unknown>,
  reset = false
): Record<string, unknown> {
  let next: Record<string, unknown> | undefined

  if (style.outlineStyle === 'none') {
    next = { ...style }
    for (const key of nativeOutlineProps) {
      if (reset) {
        next[key] = null
      } else {
        delete next[key]
      }
    }
  }

  for (const key of nativeIntrinsicSizeProps) {
    const value = style[key]
    if (value === 'max-content' || value === 'min-content' || value === 'fit-content') {
      next ||= { ...style }
      if (reset) {
        next[key] = null
      } else {
        delete next[key]
      }
    }
  }

  return next ?? style
}

export interface NativeStyleEngineLinkHandle {
  id: number
  unlink: () => void
}

export interface NativeViewStateUpdate {
  id: number
  state: string
  props?: Record<string, unknown>
}

export interface NativeStyleEngineSlots {
  state?: Record<string, Record<string, unknown>>
}

export type NativeStyleThemeMapping = Record<string, string>

export interface NativeStyleEngine {
  /**
   * links a mounted host. `table` is a shared table id from setTableState
   * (compiler mappings) or per-view slots (runtime views driven through
   * applyViewStates). `commitNow` commits the table's active state for the
   * view once, for a host whose render raced a scope change.
   */
  link(
    ref: unknown,
    table: NativeStyleEngineSlots | number,
    scopeId?: string,
    commitNow?: boolean
  ): NativeStyleEngineLinkHandle | null
  /**
   * links many mounted hosts to shared tables in one call: entry i links
   * refs[i] to tableIds[i] under scopes[scopeIndexes[i]]. returns the id of
   * entry 0; ids are consecutive, and an entry whose host is gone consumes
   * its id unlinked
   */
  linkTables(
    refs: unknown[],
    tableIds: number[],
    scopeIndexes: number[],
    scopes: string[]
  ): number
  /** unlinks an id from linkTables */
  unlink(id: number): void
  /**
   * fills one state of a shared table, read by every view linked to it;
   * views already showing that state commit the new props
   */
  setTableState(tableId: number, state: string, props: Record<string, unknown>): void
  applyViewStates(entries: NativeViewStateUpdate[]): void
  processStyleColors(props: Record<string, unknown>): Record<string, unknown>
  setStateName(stateName: string, scopeId?: string): void
  removeScope(scopeId: string): void
}

let engine: NativeStyleEngine | null = null
const scopeStates = new Map<string, { name: string; theme: object }>()

interface ResolvedMappingState {
  theme: object
  /** raw resolved values, what React renders through RN's own style normalizer */
  renderProps: Record<string, unknown>
  /** engine transport form after processStyleColors, never handed back to React */
  nativeProps: Record<string, unknown>
}

interface CompiledMapping {
  mapping: NativeStyleThemeMapping
  states: Map<string, ResolvedMappingState>
  /** the engine table every view of this mapping links to */
  tableId: number
  /** the resolved state last sent to the engine table, per state name */
  sent: Map<string, ResolvedMappingState>
}

const mappingKeys = new WeakMap<object, string>()
const compiledMappings = new Map<string, CompiledMapping>()
// linked mappings per scope, with their live link counts. they remain update
// owners across memo-generation rollovers, and a scope change only syncs the
// mappings linked under that scope
const scopeMappings = new Map<string, Map<CompiledMapping, number>>()
let nextTableId = 1

function getCompiledMapping(mapping: NativeStyleThemeMapping): CompiledMapping {
  let key = mappingKeys.get(mapping)
  if (!key) {
    key = JSON.stringify(
      Object.keys(mapping)
        .sort()
        .map((styleKey) => [styleKey, mapping[styleKey]])
    )
    mappingKeys.set(mapping, key)
  }
  let compiled = compiledMappings.get(key)
  if (!compiled) {
    compiled = {
      mapping,
      states: new Map(),
      tableId: nextTableId++,
      sent: new Map(),
    }
    if (compiledMappings.size >= 10_000) {
      compiledMappings.clear()
    }
    compiledMappings.set(key, compiled)
  }
  return compiled
}

function resolveCompiledMapping(
  compiled: CompiledMapping,
  stateName: string,
  theme: Record<string, unknown>
): ResolvedMappingState {
  const cached = compiled.states.get(stateName)
  if (cached?.theme === theme) return cached

  let renderProps: Record<string, unknown> = {}
  for (const styleKey in compiled.mapping) {
    const value = theme[compiled.mapping[styleKey]]
    renderProps[styleKey] = value === undefined ? null : getVariableValue(value)
  }
  renderProps = normalizeNativeStyle(renderProps, true)
  // the engine's color form (srgb maps for Fabric's C++ parser) must not flow
  // back through React: RN's JS style normalizer misreads it
  const nativeProps = engine?.processStyleColors(renderProps) ?? renderProps
  if (compiled.states.size >= 10_000) {
    compiled.states.clear()
  }
  const resolved: ResolvedMappingState = { theme, renderProps, nativeProps }
  compiled.states.set(stateName, resolved)
  return resolved
}

/** resolves one state of a mapping and sends it to the engine table once */
function syncTableState(
  compiled: CompiledMapping,
  stateName: string,
  theme: Record<string, unknown>
): void {
  const resolved = resolveCompiledMapping(compiled, stateName, theme)
  if (compiled.sent.get(stateName) === resolved) return
  compiled.sent.set(stateName, resolved)
  engine!.setTableState(compiled.tableId, stateName, resolved.nativeProps)
}

export function setNativeStyleEngine(next: NativeStyleEngine | null): void {
  if (engine !== next) {
    settleReleases()
    compiledMappings.clear()
    scopeMappings.clear()
    pendingLinks = []
    unlinkedPending = 0
  }
  engine = next
  if (next) {
    for (const [scopeId, state] of scopeStates) {
      next.setStateName(state.name, scopeId)
    }
  }
}

export function getNativeStyleEngine(): NativeStyleEngine | null {
  return engine
}

export function updateNativeStyleScope(
  scopeId: string,
  stateName: string,
  theme: object
): void {
  const previous = scopeStates.get(scopeId)
  if (previous?.name === stateName && previous.theme === theme) return
  // pending views rendered the outgoing state: link them before it changes
  flushNativeStyleLinks()
  scopeStates.set(scopeId, { name: stateName, theme })

  if (engine) {
    // one table entry per mapping, never per view: a state name resolves to
    // one theme, so every scope showing it reads the same table entry
    const linked = scopeMappings.get(scopeId)
    if (linked) {
      for (const compiled of linked.keys()) {
        syncTableState(compiled, stateName, theme as Record<string, unknown>)
      }
    }
  }
  engine?.setStateName(stateName, scopeId)
}

export function removeNativeStyleScope(scopeId: string): void {
  if (!scopeStates.delete(scopeId)) return
  engine?.removeScope(scopeId)
}

export function resolveNativeStyleMapping(
  mapping: NativeStyleThemeMapping,
  stateName: string,
  theme: Record<string, unknown>
): Record<string, unknown> {
  return resolveCompiledMapping(getCompiledMapping(mapping), stateName, theme).renderProps
}

interface MappingLink {
  ref: unknown
  compiled: CompiledMapping
  scopeId: string
  /** 0 while pending, -1 once unlinked */
  id: number
  /** the engine that assigned `id`: a later engine swap must not receive its unlink */
  owner: NativeStyleEngine | null
}

// views link lazily: a mount only records its host here, and the engine
// links every pending view in one call before a scope next changes. linking
// exists for theme switches, so a mount pays nothing native, and a view that
// unmounts before any switch never reaches the engine
let pendingLinks: MappingLink[] = []
// pending entries unlinked before any flush; compacted once they dominate
let unlinkedPending = 0

function trackScopeMapping(link: MappingLink, delta: 1 | -1) {
  let linked = scopeMappings.get(link.scopeId)
  if (!linked) scopeMappings.set(link.scopeId, (linked = new Map()))
  const count = (linked.get(link.compiled) ?? 0) + delta
  if (count) {
    linked.set(link.compiled, count)
  } else {
    linked.delete(link.compiled)
    if (!linked.size) scopeMappings.delete(link.scopeId)
  }
}

/** links every pending view in one engine call */
export function flushNativeStyleLinks(): void {
  settleReleases()
  if (!pendingLinks.length) return
  const links = pendingLinks
  pendingLinks = []
  unlinkedPending = 0
  if (!engine) return
  const live = links.filter((link) => link.id === 0)
  if (!live.length) return
  const refs: unknown[] = []
  const tableIds: number[] = []
  const scopeIndexes: number[] = []
  const scopes: string[] = []
  for (const link of live) {
    let scopeIndex = scopes.indexOf(link.scopeId)
    if (scopeIndex === -1) scopeIndex = scopes.push(link.scopeId) - 1
    refs.push(link.ref)
    tableIds.push(link.compiled.tableId)
    scopeIndexes.push(scopeIndex)
  }
  const firstId = engine.linkTables(refs, tableIds, scopeIndexes, scopes)
  for (let i = 0; i < live.length; i++) {
    const link = live[i]!
    link.id = firstId + i
    link.owner = engine
    link.ref = null
    trackScopeMapping(link, 1)
  }
}

// React detaches and re-attaches a callback ref whenever the callback changes,
// which a parent re-render does to every child. a release settles after the
// commit, so the same host attaching again keeps its link and the engine keeps
// its per-view caches instead of unlinking and relinking every view
interface Release {
  compiled: CompiledMapping
  scopeId: string
  handle: NativeStyleEngineLinkHandle
  settle: () => void
}
const releases = new Map<unknown, Release>()
let settleQueued = false

function settleReleases() {
  settleQueued = false
  if (!releases.size) return
  const settling = [...releases.values()]
  releases.clear()
  for (const release of settling) release.settle()
}

function releasable(
  ref: unknown,
  compiled: CompiledMapping,
  scopeId: string,
  id: number,
  settle: () => void
): NativeStyleEngineLinkHandle {
  const handle: NativeStyleEngineLinkHandle = {
    id,
    unlink: () => {
      const prior = releases.get(ref)
      if (prior && prior.handle !== handle) prior.settle()
      releases.set(ref, { compiled, scopeId, handle, settle })
      if (!settleQueued) {
        settleQueued = true
        queueMicrotask(settleReleases)
      }
    },
  }
  return handle
}

export function linkNativeStyleMapping(
  ref: unknown,
  mapping: NativeStyleThemeMapping,
  scopeId: string,
  stateName: string,
  theme: Record<string, unknown>
): NativeStyleEngineLinkHandle | null {
  if (!engine) return null

  const compiled = getCompiledMapping(mapping)
  // a scope can advance (layout effect) after a concurrent render captured its
  // theme but before that render's host ref links. link that host now against
  // the live scope state and have the engine commit it once to correct the
  // stale React commit.
  const scopeState = scopeStates.get(scopeId)
  const stale = scopeState && (scopeState.name !== stateName || scopeState.theme !== theme)
  const kept = releases.get(ref)
  if (kept) {
    releases.delete(ref)
    if (!stale && kept.compiled === compiled && kept.scopeId === scopeId) return kept.handle
    kept.settle()
  }
  if (stale) {
    syncTableState(compiled, scopeState.name, scopeState.theme as Record<string, unknown>)
    const handle = engine.link(ref, compiled.tableId, scopeId, true)
    if (!handle) return null
    const link: MappingLink = { ref: null, compiled, scopeId, id: handle.id, owner: engine }
    trackScopeMapping(link, 1)
    return releasable(ref, compiled, scopeId, handle.id, () => {
      if (link.id === -1) return
      link.id = -1
      if (link.owner === engine) trackScopeMapping(link, -1)
      handle.unlink()
    })
  }

  // the table must hold the state this view rendered before a switch links it
  syncTableState(compiled, stateName, theme)
  const link: MappingLink = { ref, compiled, scopeId, id: 0, owner: null }
  pendingLinks.push(link)
  return releasable(ref, compiled, scopeId, 0, () => {
    const id = link.id
    if (id === -1) return
    link.id = -1
    link.ref = null
    if (id > 0) {
      // scope accounting was reset when the engine changed
      if (link.owner === engine) trackScopeMapping(link, -1)
      link.owner!.unlink(id)
    } else if (++unlinkedPending > 512 && unlinkedPending * 2 > pendingLinks.length) {
      pendingLinks = pendingLinks.filter((pending) => pending.id === 0)
      unlinkedPending = 0
    }
  })
}

/** memo-generation and live-owner sizes for development diagnostics and probes */
export const getNativeStyleEngineCacheStats = () => {
  const active = new Set(
    [...scopeMappings.values()].flatMap((linked) => [...linked.keys()])
  )
  return {
    mappings: compiledMappings.size,
    activeMappings: active.size,
    states: [...new Set([...compiledMappings.values(), ...active])].reduce(
      (total, compiled) => total + compiled.states.size,
      0
    ),
  }
}

let pending: NativeViewStateUpdate[] | null = null
let flushListener: ((entries: NativeViewStateUpdate[]) => void) | null = null

/**
 * instrumentation hook: called after each batched native flush with the
 * flushed entries (benchmarks, parity tests)
 */
export function setNativeStyleEngineFlushListener(
  cb: ((entries: NativeViewStateUpdate[]) => void) | null
): void {
  flushListener = cb
}

/**
 * Host-ref hook for createComponent: links eligible mounted hosts to the
 * engine, unlinks on detach. `nativeStyleUpdate` presence is the per-render
 * eligibility signal; a host that mounts ineligible simply never links.
 */
export function updateNativeStyleLink(
  ref: {
    nativeLink?: NativeStyleEngineLinkHandle | null
    nativeStyleUpdate?: unknown
    nativePushedKeys?: Set<string>
  },
  host: unknown
): void {
  if (ref.nativeLink) {
    ref.nativeLink.unlink()
    ref.nativeLink = null
  }
  // pushed-key tracking is per-link: a new native view starts from the props
  // React committed, nothing pushed yet
  ref.nativePushedKeys = undefined
  if (host && engine && ref.nativeStyleUpdate) {
    ref.nativeLink = engine.link(host, {})
  }
}

export function queueNativeViewState(entry: NativeViewStateUpdate): void {
  if (!engine) return
  if (!pending) {
    pending = []
    queueMicrotask(() => {
      const entries = pending!
      pending = null
      engine?.applyViewStates(entries)
      flushListener?.(entries)
    })
  }
  pending.push(entry)
}

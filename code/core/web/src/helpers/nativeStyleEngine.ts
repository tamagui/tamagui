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
   * refs[i] to tableIds[i] under scopes[scopeIndexes[i]]. a host already
   * linked moves to its new entry, and the engine drops linked views that
   * have left the tree, so table links are never unlinked by id
   */
  linkTables(
    refs: unknown[],
    tableIds: number[],
    scopeIndexes: number[],
    scopes: string[]
  ): void
  /** unlinks an id from link with per-view slots */
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
const scopeMappings = new Map<string, Set<CompiledMapping>>()
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
    compiledMappings.clear()
    scopeMappings.clear()
    pendingHosts = []
    pendingStates = []
    resetNativeStyleDiscovery()
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
      for (const compiled of linked) {
        syncTableState(compiled, stateName, theme as Record<string, unknown>)
      }
    }
  }
  engine?.setStateName(stateName, scopeId)
}

export function removeNativeStyleScope(scopeId: string): void {
  if (!scopeStates.delete(scopeId)) return
  // a <Theme> removes and re-adds its scope in one commit whenever its state
  // changes; only a scope still gone after that commit drops its mappings
  queueMicrotask(() => {
    if (!scopeStates.has(scopeId)) scopeMappings.delete(scopeId)
  })
  engine?.removeScope(scopeId)
}

export function resolveNativeStyleMapping(
  mapping: NativeStyleThemeMapping,
  stateName: string,
  theme: Record<string, unknown>
): Record<string, unknown> {
  return resolveCompiledMapping(getCompiledMapping(mapping), stateName, theme).renderProps
}

/**
 * what a host rendered: one mapping under one scope state. every host of a
 * compiled component that rendered that state shares one record, so a mount
 * allocates nothing to link
 */
export interface NativeStyleLinkState {
  mapping: NativeStyleThemeMapping
  scopeId: string
  stateName: string
  theme: Record<string, unknown>
}

export function createNativeStyleLinkState(
  mapping: NativeStyleThemeMapping,
  scopeId: string,
  stateName: string,
  theme: Record<string, unknown>
): NativeStyleLinkState {
  return { mapping, scopeId, stateName, theme }
}

// views link lazily: a mount only records its host and the state it rendered,
// and the engine links every pending view in one call before a scope next
// changes. linking exists for theme switches, so a mount pays nothing native.
// nothing unlinks: the engine drops views that left the tree when it links, so
// an unmount costs nothing either.
//
// a callback ref per themed host is most of the render cost (react calls it
// on every mount). the first mounts still attach one, and that ref records
// the react root. once the root is known, compiled hosts omit the ref and a
// later flush walks the root for hosts whose style array was registered here.
// that walk runs once the JS thread idles after the render that needs it, so a
// theme switch only walks when it lands before that idle.
let pendingHosts: unknown[] = []
let pendingStates: NativeStyleLinkState[] = []
// past this many pending hosts, link them once the JS thread idles, so hosts
// that mount and unmount without a scope change never accumulate
const maxPendingHosts = 4096
let idleFlushQueued = false

type StyleFiber = {
  child: StyleFiber | null
  sibling: StyleFiber | null
  return: StyleFiber | null
  memoizedProps: { style?: object } | null
  stateNode: { node?: unknown; canonical?: object; current?: StyleFiber } | null
}

// style array identity -> the state those hosts rendered. the array is stable
// until the scope state changes, and it is the style prop on the host fiber
const stylesToState = new WeakMap<object, NativeStyleLinkState>()
// host -> the state it linked with. a host stays linked to its mapping's table
// under its scope, so a re-render with a newer state of that scope links nothing.
// fabric clones a host instance on every update and keeps its canonical
// record, so that record is the key for both a ref and a walked fiber
let linkedHostState = new WeakMap<object, NativeStyleLinkState>()

function hostKey(host: object): object {
  const record = host as {
    __internalInstanceHandle?: StyleFiber
    stateNode?: StyleFiber['stateNode']
  }
  const instance = record.__internalInstanceHandle?.stateNode ?? record.stateNode
  return instance?.canonical ?? host
}
// FiberRoot of the tree a host ref captured. current is the committed HostRoot.
// current is optional because a host fiber's stateNode is this same shape and
// has no current, and that object is what capture stores
let fiberRoot: { current?: StyleFiber | null } | null = null
let needsDiscover = false

function resetNativeStyleDiscovery(): void {
  fiberRoot = null
  needsDiscover = false
  linkedHostState = new WeakMap()
}

export function registerNativeStyle(style: object, state: NativeStyleLinkState): void {
  stylesToState.set(style, state)
}

/** true once a host ref has captured a react root that is still mounted */
export function nativeStyleMountMode(): 'discover' | 'ref' {
  const current = fiberRoot?.current
  if (current && current.stateNode === fiberRoot) {
    if (!needsDiscover) {
      needsDiscover = true
      queueIdleFlush()
    }
    return 'discover'
  }
  return 'ref'
}

/** records the react root from a host ref, when the instance carries a fiber */
export function captureNativeStyleRoot(node: unknown): void {
  const fiber = (node as { __internalInstanceHandle?: StyleFiber } | null)
    ?.__internalInstanceHandle
  if (!fiber) return
  let top = fiber
  for (let guard = 0; top.return && guard < 100000; guard++) top = top.return
  const root = top.stateNode
  if (root && root.current === top) fiberRoot = root
}

function discoverMountedHosts(): number {
  const root = fiberRoot?.current
  if (!root || root.stateNode !== fiberRoot) return 0
  const stack: StyleFiber[] = [root]
  let found = 0
  for (let guard = 0; stack.length && guard < 100000; guard++) {
    const fiber = stack.pop()!
    if (fiber.sibling) stack.push(fiber.sibling)
    if (fiber.child) stack.push(fiber.child)
    const style = fiber.memoizedProps?.style
    if (!style) continue
    const state = stylesToState.get(style)
    // only a fabric host carries the shadow node; composite fibers share the
    // style prop and must not link
    if (!state || !fiber.stateNode?.node) continue
    found++
    linkNativeStyleHost(fiber, state)
  }
  return found
}

function idleFlush() {
  idleFlushQueued = false
  flushNativeStyleLinks()
}

function queueIdleFlush() {
  if (idleFlushQueued) return
  idleFlushQueued = true
  requestIdleCallback(idleFlush)
}

function addScopeMapping(scopeId: string, compiled: CompiledMapping) {
  let linked = scopeMappings.get(scopeId)
  if (!linked) scopeMappings.set(scopeId, (linked = new Set()))
  linked.add(compiled)
}

/** links every pending view in one engine call */
export function flushNativeStyleLinks(): void {
  if (needsDiscover) {
    needsDiscover = false
    const current = fiberRoot?.current
    // a replaced react root no longer points at the fiber we captured
    if (!current || current.stateNode !== fiberRoot) fiberRoot = null
    else discoverMountedHosts()
  }
  if (!pendingHosts.length) return
  const hosts = pendingHosts
  const states = pendingStates
  pendingHosts = []
  pendingStates = []
  if (!engine) return
  const tableIds: number[] = new Array(hosts.length)
  const scopeIndexes: number[] = new Array(hosts.length)
  const scopes: string[] = []
  let last: NativeStyleLinkState | undefined
  let tableId = 0
  let scopeIndex = 0
  for (let i = 0; i < hosts.length; i++) {
    const state = states[i]!
    if (state !== last) {
      last = state
      const compiled = getCompiledMapping(state.mapping)
      // the table must hold the state each view rendered before the switch
      syncTableState(compiled, state.stateName, state.theme)
      addScopeMapping(state.scopeId, compiled)
      tableId = compiled.tableId
      scopeIndex = scopes.indexOf(state.scopeId)
      if (scopeIndex === -1) scopeIndex = scopes.push(state.scopeId) - 1
    }
    tableIds[i] = tableId
    scopeIndexes[i] = scopeIndex
  }
  engine.linkTables(hosts, tableIds, scopeIndexes, scopes)
}

/** records a mounted host for linking. a host attaching twice links once */
export function linkNativeStyleHost(host: unknown, state: NativeStyleLinkState): void {
  if (!engine || host == null) return
  const key = hostKey(host as object)
  const linked = linkedHostState.get(key)
  if (linked && linked.mapping === state.mapping && linked.scopeId === state.scopeId) {
    return
  }
  linkedHostState.set(key, state)
  // a scope can advance (layout effect) after a concurrent render captured its
  // theme but before that render's host attaches. link that host now against
  // the live scope state and have the engine commit it once to correct the
  // stale React commit.
  const live = scopeStates.get(state.scopeId)
  if (live && (live.name !== state.stateName || live.theme !== state.theme)) {
    const compiled = getCompiledMapping(state.mapping)
    syncTableState(compiled, live.name, live.theme as Record<string, unknown>)
    addScopeMapping(state.scopeId, compiled)
    engine.link(host, compiled.tableId, state.scopeId, true)
    return
  }
  pendingHosts.push(host)
  pendingStates.push(state)
  if (pendingHosts.length >= maxPendingHosts) queueIdleFlush()
}

/** memo-generation and live-owner sizes for development diagnostics and probes */
export const getNativeStyleEngineCacheStats = () => {
  const active = new Set([...scopeMappings.values()].flatMap((linked) => [...linked]))
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

// per view id, how many pending entries a render of that view superseded
let superseded: Map<number, number> | null = null

export function queueNativeViewState(entry: NativeViewStateUpdate): void {
  if (!engine) return
  if (!pending) {
    pending = []
    queueMicrotask(() => {
      let entries = pending!
      const dropped = superseded
      pending = null
      superseded = null
      if (dropped) {
        entries = entries.filter(
          (queued, index) => index >= (dropped.get(queued.id) ?? 0)
        )
      }
      if (!entries.length) return
      engine?.applyViewStates(entries)
      flushListener?.(entries)
    })
  }
  pending.push(entry)
}

/**
 * a render of a linked view commits its current styles, so updates it queued
 * before rendering carry older props and must not land after that commit: a
 * parent passing a raw theme value re-renders the view with the new value
 * while the view's own theme listener queued a push of the old one
 */
export function supersedeNativeViewStates(id: number): void {
  if (!pending) return
  ;(superseded ||= new Map()).set(id, pending.length)
}

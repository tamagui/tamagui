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

export interface NativeStyleEngineLinkHandle {
  id: number
  unlink: () => void
}

export interface NativeViewStateUpdate {
  id: number
  state: string
  props?: Record<string, unknown>
}

export interface NativeViewStateTableUpdate {
  id: number
  state: string
  props: Record<string, unknown>
}

export interface NativeStyleEngineSlots {
  base?: Record<string, unknown>
  state?: Record<string, Record<string, unknown>>
}

export type NativeStyleThemeMapping = Record<string, string>

export interface NativeStyleEngine {
  link(
    ref: unknown,
    slots: NativeStyleEngineSlots,
    scopeId?: string
  ): NativeStyleEngineLinkHandle | null
  applyViewStates(entries: NativeViewStateUpdate[]): void
  updateViewStateTables(entries: NativeViewStateTableUpdate[]): void
  processStyleColors(props: Record<string, unknown>): Record<string, unknown>
  setStateName(stateName: string, scopeId?: string): void
  removeScope(scopeId: string): void
}

let engine: NativeStyleEngine | null = null
const scopeStates = new Map<string, { name: string; theme: object }>()

interface CompiledMappingLink {
  handle: NativeStyleEngineLinkHandle
  scopeId: string
  stateThemes: Map<string, object>
}

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
  links: Set<CompiledMappingLink>
}

const mappingKeys = new WeakMap<object, string>()
const compiledMappings = new Map<string, CompiledMapping>()
// linked mappings remain update owners across memo-generation rollovers
const activeCompiledMappings = new Set<CompiledMapping>()
const processedBases = new WeakMap<
  object,
  { engine: NativeStyleEngine; props: Record<string, unknown> }
>()

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
    compiled = { mapping, states: new Map(), links: new Set() }
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

  const renderProps: Record<string, unknown> = {}
  for (const styleKey in compiled.mapping) {
    const value = theme[compiled.mapping[styleKey]]
    renderProps[styleKey] = value === undefined ? null : getVariableValue(value)
  }
  // the engine's color form (srgb maps for Fabric's C++ parser) must not flow
  // back through React: RN's JS style normalizer misreads it
  const nativeProps = engine?.processStyleColors(renderProps) ?? renderProps
  if (compiled.states.size >= 10_000) {
    compiled.states.clear()
    for (const link of compiled.links) {
      link.stateThemes.clear()
    }
  }
  const resolved: ResolvedMappingState = { theme, renderProps, nativeProps }
  compiled.states.set(stateName, resolved)
  return resolved
}

export function setNativeStyleEngine(next: NativeStyleEngine | null): void {
  if (engine !== next) {
    compiledMappings.clear()
    activeCompiledMappings.clear()
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
  scopeStates.set(scopeId, { name: stateName, theme })

  if (engine) {
    const entries: NativeViewStateTableUpdate[] = []
    for (const compiled of activeCompiledMappings) {
      let props: Record<string, unknown> | undefined
      for (const link of compiled.links) {
        if (link.scopeId !== scopeId) continue
        const linkedTheme = link.stateThemes.get(stateName)
        if (linkedTheme === theme) continue
        props ||= resolveCompiledMapping(
          compiled,
          stateName,
          theme as Record<string, unknown>
        ).nativeProps
        entries.push({ id: link.handle.id, state: stateName, props })
        link.stateThemes.set(stateName, theme)
      }
    }
    if (entries.length) engine.updateViewStateTables(entries)
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

export function linkNativeStyleMapping(
  ref: unknown,
  baseStyle: Record<string, unknown>,
  mapping: NativeStyleThemeMapping,
  scopeId: string,
  stateName: string,
  theme: Record<string, unknown>
): NativeStyleEngineLinkHandle | null {
  if (!engine) return null

  const compiled = getCompiledMapping(mapping)
  // a scope can advance (layout effect) after a concurrent render captured its
  // theme but before that render's host ref links. the engine's link() only
  // stores tables, it never commits, so link against the live scope state and
  // commit that table once to correct the stale React commit.
  const scopeState = scopeStates.get(scopeId)
  const currentStateName = scopeState?.name ?? stateName
  const currentTheme = (scopeState?.theme ?? theme) as Record<string, unknown>
  const stale = currentStateName !== stateName || currentTheme !== theme
  const stateProps = resolveCompiledMapping(
    compiled,
    currentStateName,
    currentTheme
  ).nativeProps
  let base = processedBases.get(baseStyle)
  if (!base || base.engine !== engine) {
    base = { engine, props: engine.processStyleColors(baseStyle) }
    processedBases.set(baseStyle, base)
  }
  const state: Record<string, Record<string, unknown>> = {}
  const stateThemes = new Map<string, object>()
  for (const [name, cached] of compiled.states) {
    state[name] = cached.nativeProps
    stateThemes.set(name, cached.theme)
  }
  state[currentStateName] = stateProps
  stateThemes.set(currentStateName, currentTheme)
  const handle = engine.link(ref, { base: base.props, state }, scopeId)
  if (!handle) return null

  if (stale) {
    engine.updateViewStateTables([
      { id: handle.id, state: currentStateName, props: stateProps },
    ])
  }

  const link: CompiledMappingLink = {
    handle,
    scopeId,
    stateThemes,
  }
  compiled.links.add(link)
  activeCompiledMappings.add(compiled)
  return {
    id: handle.id,
    unlink: () => {
      compiled.links.delete(link)
      if (!compiled.links.size) {
        activeCompiledMappings.delete(compiled)
      }
      handle.unlink()
    },
  }
}

/** memo-generation and live-owner sizes for development diagnostics and probes */
export const getNativeStyleEngineCacheStats = () => ({
  mappings: compiledMappings.size,
  activeMappings: activeCompiledMappings.size,
  states: [...new Set([...compiledMappings.values(), ...activeCompiledMappings])].reduce(
    (total, compiled) => total + compiled.states.size,
    0
  ),
})

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

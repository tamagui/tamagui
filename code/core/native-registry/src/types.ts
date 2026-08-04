/**
 * Slot props for one linked view.
 *
 * v1 implements two slot kinds: `base` (state-independent props, applied
 * under every state) and `state` (props keyed by state name, e.g. theme
 * name; the scope's active name selects which entry applies). Future kinds
 * (media, press, group, container) extend this shape; the engine merge
 * order is fixed: base, then state, then future kinds.
 *
 * Keys must be exhaustive for every state name the scope can take. The
 * engine does exact lookups only: no fallback chains, no name parsing. A
 * miss increments the engine's miss counter and is a bug in the emitter.
 */
export interface ViewSlots {
  base?: Record<string, unknown>
  state?: Record<string, Record<string, unknown>>
}

export interface RegistryStats {
  viewCount: number
  commitCount: number
  missCount: number
}

/** Returned by link(); call to unlink. Safe to call more than once. */
export type Unlink = () => void

/**
 * Handle for a linked view. `id` addresses the view in batched per-view
 * operations (applyViewStates); `unlink` removes it. null when the ref had
 * no shadow node (never mounted) or the engine is unavailable (web).
 */
export interface LinkHandle {
  id: number
  unlink: Unlink
}

/**
 * One entry of a batched per-view state update. When `props` is present it
 * is merged into the view's state table under `state` first (lazy warm-up
 * for runtime integrations); the view's active state then becomes `state`
 * and all entries commit natively in one transaction.
 */
export interface ViewStateUpdate {
  id: number
  state: string
  props?: Record<string, unknown>
}

/** Debug/test snapshot of a linked view's engine tables (getViewState). */
export interface ViewStateSnapshot {
  scopeId: string
  activeState: string
  base: Record<string, unknown> | null
  states: Record<string, Record<string, unknown>> | null
  /** the family's sticky nativeProps_DEPRECATED merge, null when unset */
  nativeProps: Record<string, unknown> | null
}

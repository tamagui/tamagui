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

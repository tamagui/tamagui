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

export interface NativeStyleEngineLinkHandle {
  id: number
  unlink: () => void
}

export interface NativeViewStateUpdate {
  id: number
  state: string
  props?: Record<string, unknown>
}

export interface NativeStyleEngine {
  link(
    ref: unknown,
    slots: object,
    scopeId?: string
  ): NativeStyleEngineLinkHandle | null
  applyViewStates(entries: NativeViewStateUpdate[]): void
  processStyleColors(props: Record<string, unknown>): Record<string, unknown>
}

let engine: NativeStyleEngine | null = null

export function setNativeStyleEngine(next: NativeStyleEngine | null): void {
  engine = next
}

export function getNativeStyleEngine(): NativeStyleEngine | null {
  return engine
}

let pending: NativeViewStateUpdate[] | null = null
let flushListener: (() => void) | null = null

/** instrumentation hook: called after each batched native flush (benchmarks) */
export function setNativeStyleEngineFlushListener(cb: (() => void) | null): void {
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
      flushListener?.()
    })
  }
  pending.push(entry)
}

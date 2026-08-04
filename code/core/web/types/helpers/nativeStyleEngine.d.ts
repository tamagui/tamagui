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
    id: number;
    unlink: () => void;
}
export interface NativeViewStateUpdate {
    id: number;
    state: string;
    props?: Record<string, unknown>;
}
export interface NativeStyleEngineSlots {
    base?: Record<string, unknown>;
    state?: Record<string, Record<string, unknown>>;
}
export interface NativeStyleEngine {
    link(ref: unknown, slots: NativeStyleEngineSlots, scopeId?: string): NativeStyleEngineLinkHandle | null;
    applyViewStates(entries: NativeViewStateUpdate[]): void;
    processStyleColors(props: Record<string, unknown>): Record<string, unknown>;
    setStateName(stateName: string, scopeId?: string): void;
    removeScope(scopeId: string): void;
}
export declare function setNativeStyleEngine(next: NativeStyleEngine | null): void;
export declare function getNativeStyleEngine(): NativeStyleEngine | null;
export declare function updateNativeStyleScope(scopeId: string, stateName: string): void;
export declare function removeNativeStyleScope(scopeId: string): void;
/**
 * instrumentation hook: called after each batched native flush with the
 * flushed entries (benchmarks, parity tests)
 */
export declare function setNativeStyleEngineFlushListener(cb: ((entries: NativeViewStateUpdate[]) => void) | null): void;
/**
 * Host-ref hook for createComponent: links eligible mounted hosts to the
 * engine, unlinks on detach. `nativeStyleUpdate` presence is the per-render
 * eligibility signal; a host that mounts ineligible simply never links.
 */
export declare function updateNativeStyleLink(ref: {
    nativeLink?: NativeStyleEngineLinkHandle | null;
    nativeStyleUpdate?: unknown;
    nativePushedKeys?: Set<string>;
}, host: unknown): void;
export declare function queueNativeViewState(entry: NativeViewStateUpdate): void;
//# sourceMappingURL=nativeStyleEngine.d.ts.map
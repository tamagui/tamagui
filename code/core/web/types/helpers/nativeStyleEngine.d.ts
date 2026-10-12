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
/**
 * CSS-shaped Input color styles lower back to React Native TextInput props.
 * Keeping this table beside native color processing makes the runtime and
 * compiler use one RN compatibility boundary after token resolution.
 */
export declare const nativeTextInputColorProps: Readonly<Record<string, string>>;
/** drops CSS values Fabric cannot accept; state tables use null to clear lower layers */
export declare function normalizeNativeStyle(style: Record<string, unknown>, reset?: boolean): Record<string, unknown>;
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
    state?: Record<string, Record<string, unknown>>;
}
export type NativeStyleThemeMapping = Record<string, string>;
export interface NativeStyleEngine {
    /**
     * links a mounted host. `table` is a shared table id from setTableState
     * (compiler mappings) or per-view slots (runtime views driven through
     * applyViewStates). `commitNow` commits the table's active state for the
     * view once, for a host whose render raced a scope change.
     */
    link(ref: unknown, table: NativeStyleEngineSlots | number, scopeId?: string, commitNow?: boolean): NativeStyleEngineLinkHandle | null;
    /**
     * links many mounted hosts to shared tables in one call: entry i links
     * refs[i] to tableIds[i] under scopes[scopeIndexes[i]]. returns the id of
     * entry 0; ids are consecutive, and an entry whose host is gone consumes
     * its id unlinked
     */
    linkTables(refs: unknown[], tableIds: number[], scopeIndexes: number[], scopes: string[]): number;
    /** unlinks an id from linkTables */
    unlink(id: number): void;
    /**
     * fills one state of a shared table, read by every view linked to it;
     * views already showing that state commit the new props
     */
    setTableState(tableId: number, state: string, props: Record<string, unknown>): void;
    applyViewStates(entries: NativeViewStateUpdate[]): void;
    processStyleColors(props: Record<string, unknown>): Record<string, unknown>;
    setStateName(stateName: string, scopeId?: string): void;
    removeScope(scopeId: string): void;
}
export declare function setNativeStyleEngine(next: NativeStyleEngine | null): void;
export declare function getNativeStyleEngine(): NativeStyleEngine | null;
export declare function updateNativeStyleScope(scopeId: string, stateName: string, theme: object): void;
export declare function removeNativeStyleScope(scopeId: string): void;
export declare function resolveNativeStyleMapping(mapping: NativeStyleThemeMapping, stateName: string, theme: Record<string, unknown>): Record<string, unknown>;
/** links every pending view in one engine call */
export declare function flushNativeStyleLinks(): void;
export declare function linkNativeStyleMapping(ref: unknown, mapping: NativeStyleThemeMapping, scopeId: string, stateName: string, theme: Record<string, unknown>): NativeStyleEngineLinkHandle | null;
/** memo-generation and live-owner sizes for development diagnostics and probes */
export declare const getNativeStyleEngineCacheStats: () => {
    mappings: number;
    activeMappings: number;
    states: number;
};
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
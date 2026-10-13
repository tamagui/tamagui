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
     * refs[i] to tableIds[i] under scopes[scopeIndexes[i]]. a host already
     * linked moves to its new entry, and the engine drops linked views that
     * have left the tree, so table links are never unlinked by id
     */
    linkTables(refs: unknown[], tableIds: number[], scopeIndexes: number[], scopes: string[]): void;
    /** unlinks an id from link with per-view slots */
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
/**
 * what a host rendered: one mapping under one scope state. every host of a
 * compiled component that rendered that state shares one record, so a mount
 * allocates nothing to link
 */
export interface NativeStyleLinkState {
    mapping: NativeStyleThemeMapping;
    scopeId: string;
    stateName: string;
    theme: Record<string, unknown>;
}
export declare function createNativeStyleLinkState(mapping: NativeStyleThemeMapping, scopeId: string, stateName: string, theme: Record<string, unknown>): NativeStyleLinkState;
export declare function registerNativeStyle(style: object, state: NativeStyleLinkState): void;
/** true once a host ref has captured a react root that is still mounted */
export declare function nativeStyleMountMode(): 'discover' | 'ref';
/** records the react root from a host ref, when the instance carries a fiber */
export declare function captureNativeStyleRoot(node: unknown): void;
/** links every pending view in one engine call */
export declare function flushNativeStyleLinks(): void;
/** records a mounted host for linking. a host attaching twice links once */
export declare function linkNativeStyleHost(host: unknown, state: NativeStyleLinkState): void;
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
/**
 * a render of a linked view commits its current styles, so updates it queued
 * before rendering carry older props and must not land after that commit: a
 * parent passing a raw theme value re-renders the view with the new value
 * while the view's own theme listener queued a push of the old one
 */
export declare function supersedeNativeViewStates(id: number): void;
//# sourceMappingURL=nativeStyleEngine.d.ts.map
import type { LinkHandle, RegistryStats, ViewSlots, ViewStateSnapshot, ViewStateUpdate } from "./types";
export type { LinkHandle, RegistryStats, Unlink, ViewSlots, ViewStateSnapshot, ViewStateUpdate } from "./types";
export { ROOT_SCOPE, getMirroredStateName } from "./mirror";
export { processStyleColors } from "./processStyleColors.native";
export declare function isAvailable(): boolean;
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
export declare function link(ref: unknown, table: ViewSlots | number, scopeId?: string, commitNow?: boolean): LinkHandle | null;
/**
* Batched per-view state selection: cold entries carry `props` (computed by
* the caller, colors already processed via processStyleColors), warm entries
* just name the state. One native commit for the whole batch.
*/
export declare function applyViewStates(entries: ViewStateUpdate[]): void;
/**
* Fill one state of a shared table. Every view linked to the table reads it;
* views already showing that state commit the new props. Props arrive in
* engine form, already through processStyleColors.
*/
export declare function setTableState(tableId: number, state: string, props: Record<string, unknown>): void;
/**
* Set the active state name (e.g. theme name) for a scope and commit the
* update natively. The JS mirror updates first so any concurrent React
* render paints the same styles the engine commits.
*/
export declare function setStateName(stateName: string, scopeId?: string): void;
export declare function removeScope(scopeId: string): void;
/** Resolve the props a view should render right now, mirror-consistent. */
export declare function resolveSlots(slots: ViewSlots, scopeId?: string): Record<string, unknown>;
/** Debug/test introspection of a linked view's engine tables. Not a hot path. */
export declare function getViewState(id: number): ViewStateSnapshot | null;
export declare function getStats(): RegistryStats;

//# sourceMappingURL=index.native.d.ts.map
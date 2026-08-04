import type { LinkHandle, RegistryStats, ViewSlots, ViewStateUpdate } from "./types";
export type { LinkHandle, RegistryStats, Unlink, ViewSlots, ViewStateUpdate } from "./types";
export { ROOT_SCOPE, getMirroredStateName } from "./mirror";
export { processStyleColors } from "./processStyleColors";
export declare function isAvailable(): boolean;
/**
* Link a mounted view to the engine. Captures the ShadowNode once, returns
* a handle keyed by the engine-issued id: unlink never re-derives anything
* from the ref, so a torn-down ref cannot leave a stale entry behind.
*/
export declare function link(ref: unknown, slots: ViewSlots, scopeId?: string): LinkHandle | null;
/**
* Batched per-view state selection: cold entries carry `props` (computed by
* the caller, colors already processed via processStyleColors), warm entries
* just name the state. One native commit for the whole batch.
*/
export declare function applyViewStates(entries: ViewStateUpdate[]): void;
/**
* Set the active state name (e.g. theme name) for a scope and commit the
* update natively. The JS mirror updates first so any concurrent React
* render paints the same styles the engine commits.
*/
export declare function setStateName(stateName: string, scopeId?: string): void;
export declare function removeScope(scopeId: string): void;
/** Resolve the props a view should render right now, mirror-consistent. */
export declare function resolveSlots(slots: ViewSlots, scopeId?: string): Record<string, unknown>;
export declare function getStats(): RegistryStats;

//# sourceMappingURL=index.native.d.ts.map
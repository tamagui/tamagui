/**
* Web/no-native fallback. The registry is a native-only optimization; on web
* (or when the native module is absent) the mirror still tracks scope state
* so shared code can resolve slots, but nothing links and nothing commits.
*/
import type { LinkHandle, RegistryStats, ViewSlots, ViewStateSnapshot, ViewStateTableUpdate, ViewStateUpdate } from "./types";
export type { LinkHandle, RegistryStats, Unlink, ViewSlots, ViewStateSnapshot, ViewStateTableUpdate, ViewStateUpdate } from "./types";
export { ROOT_SCOPE, getMirroredStateName } from "./mirror";
export declare function isAvailable(): boolean;
export declare function link(_ref: unknown, _slots: ViewSlots, _scopeId?: string): LinkHandle | null;
export declare function applyViewStates(_entries: ViewStateUpdate[]): void;
export declare function updateViewStateTables(_entries: ViewStateTableUpdate[]): void;
export declare function getViewState(_id: number): ViewStateSnapshot | null;
export declare function setStateName(stateName: string, scopeId?: string): void;
export declare function removeScope(scopeId: string): void;
export declare function resolveSlots(slots: ViewSlots, scopeId?: string): Record<string, unknown>;
export declare function getStats(): RegistryStats;
export declare function processStyleColors(props: Record<string, unknown>): Record<string, unknown>;

//# sourceMappingURL=index.d.ts.map
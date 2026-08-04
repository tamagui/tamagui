/**
* Web/no-native fallback. The registry is a native-only optimization; on web
* (or when the native module is absent) the mirror still tracks scope state
* so shared code can resolve slots, but nothing links and nothing commits.
*/
import type { RegistryStats, Unlink, ViewSlots } from "./types";
export type { RegistryStats, Unlink, ViewSlots } from "./types";
export { ROOT_SCOPE, getMirroredStateName } from "./mirror";
export declare function isAvailable(): boolean;
export declare function link(_ref: unknown, _slots: ViewSlots, _scopeId?: string): Unlink;
export declare function setStateName(stateName: string, scopeId?: string): void;
export declare function removeScope(scopeId: string): void;
export declare function resolveSlots(slots: ViewSlots, scopeId?: string): Record<string, unknown>;
export declare function getStats(): RegistryStats;
export declare function processStyleColors(props: Record<string, unknown>): Record<string, unknown>;

//# sourceMappingURL=index.d.ts.map
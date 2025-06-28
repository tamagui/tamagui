import type { DebugProp } from '../types';
export type CallbackSetState<State> = (next: (cb: State) => State) => void;
export declare function useCreateShallowSetState<State extends Record<string, unknown>>(setter: CallbackSetState<State>, debugIn?: DebugProp): (next: Partial<State>) => void;
export declare function mergeIfNotShallowEqual<State extends Record<string, unknown>>(prev: State, next: Partial<State>, debug?: DebugProp): State;
export declare function isEqualShallow(prev: any, next: any): boolean;
//# sourceMappingURL=useCreateShallowSetState.d.ts.map
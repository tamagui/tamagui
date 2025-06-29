import { type DebugProp } from '@tamagui/is-equal-shallow';
export type CallbackSetState<State> = (next: (cb: State) => State) => void;
export declare function useCreateShallowSetState<State extends Record<string, unknown>>(setter: CallbackSetState<State>, debugIn?: DebugProp): (next: Partial<State>) => void;
export { isEqualShallow, mergeIfNotShallowEqual } from '@tamagui/is-equal-shallow';
//# sourceMappingURL=useCreateShallowSetState.d.ts.map
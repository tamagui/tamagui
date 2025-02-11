import type React from 'react';
import type { DebugProp } from '../types';
export declare function createShallowSetState<State extends Object>(setter: React.Dispatch<React.SetStateAction<State>>, onlyAllow?: string[], transition?: boolean, debug?: DebugProp, callback?: (nextState: any) => void): (next?: Partial<State>) => void;
export declare function mergeIfNotShallowEqual(prev: any, next: any, onlyAllow?: string[], debug?: DebugProp): any;
export declare function isEqualShallow(prev: any, next: any): boolean;
//# sourceMappingURL=createShallowSetState.d.ts.map
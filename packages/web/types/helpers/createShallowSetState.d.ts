import React from 'react';
import { TamaguiComponentState } from '../types';
export declare function createShallowSetState<State extends TamaguiComponentState>(setter: React.Dispatch<React.SetStateAction<State>>): (next: Partial<State>) => void;
export declare function mergeIfNotShallowEqual(prev: any, next: any): any;
//# sourceMappingURL=createShallowSetState.d.ts.map
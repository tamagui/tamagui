import React from 'react';
export declare function createShallowSetState<State extends Object>(setter: React.Dispatch<React.SetStateAction<State>>): (next: Partial<State>) => void;
export declare function mergeIfNotShallowEqual(prev: any, next: any): any;
//# sourceMappingURL=createShallowSetState.d.ts.map
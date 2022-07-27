import React from 'react';
declare type ChangeCb<T> = ((next: T) => void) | React.Dispatch<React.SetStateAction<T>>;
export declare function useControllableState<T>({ prop, defaultProp, onChange, strategy, preventUpdate, }: {
    prop?: T | undefined;
    defaultProp: T;
    onChange?: ChangeCb<T>;
    strategy?: 'prop-wins' | 'most-recent-wins';
    preventUpdate?: boolean;
}): [T, (next: T) => void];
export {};
//# sourceMappingURL=useControllableState.d.ts.map
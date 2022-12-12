import React from 'react';
type ChangeCb<T> = ((next: T) => void) | React.Dispatch<React.SetStateAction<T>>;
export declare function useControllableState<T>({ prop, defaultProp, onChange, strategy, preventUpdate, }: {
    prop?: T | undefined;
    defaultProp: T;
    onChange?: ChangeCb<T>;
    strategy?: 'prop-wins' | 'most-recent-wins';
    preventUpdate?: boolean;
}): [T, React.Dispatch<React.SetStateAction<T>>];
export {};
//# sourceMappingURL=useControllableState.d.ts.map
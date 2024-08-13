import * as React from 'react';
type ChangeCb<T> = ((next: T) => void) | React.Dispatch<React.SetStateAction<T>>;
export declare function useControllableState<T>({ prop, defaultProp, onChange, strategy, preventUpdate, transition, }: {
    prop?: T | undefined;
    defaultProp: T;
    onChange?: ChangeCb<T>;
    strategy?: 'prop-wins' | 'most-recent-wins';
    preventUpdate?: boolean;
    transition?: boolean;
}): [T, React.Dispatch<React.SetStateAction<T>>];
export {};
//# sourceMappingURL=useControllableState.d.ts.map
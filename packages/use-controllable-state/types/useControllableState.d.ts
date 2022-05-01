import React from 'react';
export declare function useControllableState<T>({ prop, defaultProp, onChange, strategy, }: {
    prop?: T | undefined;
    defaultProp: T;
    onChange?: ((next: T) => void) | React.Dispatch<React.SetStateAction<T>>;
    strategy?: 'prop-wins' | 'most-recent-wins';
}): [T, React.Dispatch<React.SetStateAction<T>>];
//# sourceMappingURL=useControllableState.d.ts.map
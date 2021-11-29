import React from 'react';
export declare function useControllableProp<T>(prop: T | undefined, state: T): readonly [boolean, T];
export interface UseControllableStateProps<T> {
    value?: T;
    defaultValue?: T | (() => T);
    onChange?: (value: T) => void;
    name?: string;
}
export declare function useControllableState<T>(props: UseControllableStateProps<T>): [T, React.Dispatch<React.SetStateAction<T>>];
//# sourceMappingURL=useControllableState.d.ts.map
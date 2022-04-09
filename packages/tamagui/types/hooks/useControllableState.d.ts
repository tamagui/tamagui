/// <reference types="react" />
export declare function useControllableState<T>({ prop, defaultProp, onChange, strategy, }: {
    prop?: T;
    defaultProp: T;
    onChange?: (next: T) => void;
    strategy?: 'prop-wins' | 'most-recent-wins';
}): [T, React.Dispatch<React.SetStateAction<T>>];
//# sourceMappingURL=useControllableState.d.ts.map
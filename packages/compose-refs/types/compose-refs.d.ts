import * as React from 'react';
type PossibleRef<T> = React.Ref<T> | React.ForwardedRef<T> | React.RefObject<T> | undefined;
/**
 * A utility to compose multiple refs together
 * Accepts callback refs and RefObject(s)
 */
export declare function composeRefs<T>(...refs: PossibleRef<T>[]): (node: T) => void;
/**
 * A custom hook that composes multiple refs
 * Accepts callback refs and RefObject(s)
 */
export declare function useComposedRefs<T>(...refs: PossibleRef<T>[]): (node: T) => void;
export {};
//# sourceMappingURL=compose-refs.d.ts.map
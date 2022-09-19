import * as React from 'react';
declare type PossibleRef<T> = React.Ref<T> | undefined;
/**
 * A utility to compose multiple refs together
 * Accepts callback refs and RefObject(s)
 */
declare function composeRefs<T>(...refs: PossibleRef<T>[]): (node: T) => void;
/**
 * A custom hook that composes multiple refs
 * Accepts callback refs and RefObject(s)
 */
declare function useComposedRefs<T>(...refs: PossibleRef<T>[]): (node: T) => void;
export { composeRefs, useComposedRefs };
//# sourceMappingURL=compose-refs.d.ts.map
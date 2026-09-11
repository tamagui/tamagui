import * as React from 'react';
import type { ReactNode, Ref } from 'react';
type PossibleRef<T> = React.Ref<T> | React.RefObject<T> | React.Dispatch<React.SetStateAction<T | null>> | undefined;
/**
 * Set a given ref to a given value
 * This utility takes care of different types of refs: callback refs and RefObject(s)
 */
export declare function setRef<T>(ref: PossibleRef<T>, value: T): void;
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
export type RefProp<RefType> = {
    ref?: Ref<RefType>;
};
export type RefComponent<RefType, Props extends object> = ((props: Props & RefProp<RefType>) => ReactNode) & {
    displayName?: string;
    propTypes?: any;
};
export declare function createRefComponent<RefType, Props extends object>(render: (props: Props, ref: Ref<RefType> | undefined) => ReactNode): RefComponent<RefType, Props>;
export {};
//# sourceMappingURL=compose-refs.d.ts.map
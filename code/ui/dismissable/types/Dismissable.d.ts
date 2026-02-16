import * as React from 'react';
import type { DismissableBranchProps, DismissableProps } from './DismissableProps';
export declare function dispatchDiscreteCustomEvent<E extends CustomEvent>(target: E['target'], event: E): void;
/**
 * returns the number of active dismissable layers
 * useful for non-React contexts (e.g. escape key handlers)
 */
export declare function getDismissableLayerCount(): number;
/**
 * debug helper - logs what elements are registered as dismissable layers
 */
export declare function debugDismissableLayers(): HTMLDivElement[];
/**
 * hook that returns true when any dismissable layer is active
 * re-renders when the state changes
 * uses module-level globals, not React context, so works anywhere in tree
 */
export declare function useHasDismissableLayers(): boolean;
/**
 * hook to check if a DOM element is inside an active dismissable layer
 * useful for custom escape handling - if inside a dismissable, you may want to defer
 */
export declare function useIsInsideDismissable(ref: React.RefObject<HTMLElement | null>): boolean;
/**
 * hook to check if there are dismissable layers above a given element
 * returns the count of layers that are ancestors of the element
 */
export declare function useDismissableLayersAbove(ref: React.RefObject<HTMLElement | null>): number;
declare const Dismissable: React.ForwardRefExoticComponent<DismissableProps & {
    asChild?: boolean;
} & React.RefAttributes<HTMLDivElement>>;
declare const DismissableBranch: React.ForwardRefExoticComponent<DismissableBranchProps & React.RefAttributes<HTMLDivElement>>;
export type PointerDownOutsideEvent = CustomEvent<{
    originalEvent: PointerEvent;
}>;
export type FocusOutsideEvent = CustomEvent<{
    originalEvent: FocusEvent;
}>;
export { Dismissable, DismissableBranch };
export type { DismissableProps };
//# sourceMappingURL=Dismissable.d.ts.map
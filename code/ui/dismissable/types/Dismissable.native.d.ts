import React from 'react';
import type { DismissableBranchProps, DismissableProps } from './DismissableProps';
export declare function dispatchDiscreteCustomEvent<E extends CustomEvent>(_target: E['target'], _event: E): void;
export declare function getDismissableLayerCount(): number;
export declare function useHasDismissableLayers(): boolean;
export declare function useIsInsideDismissable(_ref: React.RefObject<HTMLElement | null>): boolean;
export declare function useDismissableLayersAbove(_ref: React.RefObject<HTMLElement | null>): number;
export declare const Dismissable: import("@tamagui/core").RefComponent<unknown, DismissableProps>;
export declare const DismissableBranch: import("@tamagui/core").RefComponent<unknown, DismissableBranchProps>;
//# sourceMappingURL=Dismissable.native.d.ts.map
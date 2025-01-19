import * as React from 'react';
import type { DismissableBranchProps, DismissableProps } from './DismissableProps';
export declare function dispatchDiscreteCustomEvent<E extends CustomEvent>(target: E['target'], event: E): void;
declare const Dismissable: React.ForwardRefExoticComponent<DismissableProps & React.RefAttributes<HTMLDivElement>>;
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
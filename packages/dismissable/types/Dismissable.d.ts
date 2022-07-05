import * as React from 'react';
import { DismissableBranchProps, DismissableProps } from './DismissableProps';
declare const Dismissable: React.ForwardRefExoticComponent<DismissableProps & React.RefAttributes<HTMLDivElement>>;
declare const DismissableBranch: React.ForwardRefExoticComponent<DismissableBranchProps & React.RefAttributes<HTMLDivElement>>;
export declare type PointerDownOutsideEvent = CustomEvent<{
    originalEvent: PointerEvent;
}>;
export declare type FocusOutsideEvent = CustomEvent<{
    originalEvent: FocusEvent;
}>;
declare const Root: React.ForwardRefExoticComponent<DismissableProps & React.RefAttributes<HTMLDivElement>>;
declare const Branch: React.ForwardRefExoticComponent<DismissableBranchProps & React.RefAttributes<HTMLDivElement>>;
export { Dismissable, DismissableBranch, Root, Branch, };
export type { DismissableProps };
//# sourceMappingURL=Dismissable.d.ts.map
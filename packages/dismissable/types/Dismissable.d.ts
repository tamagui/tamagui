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
export { Dismissable, DismissableBranch };
export type { DismissableProps };
//# sourceMappingURL=Dismissable.d.ts.map
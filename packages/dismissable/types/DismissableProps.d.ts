import React from 'react';
import { FocusOutsideEvent, PointerDownOutsideEvent } from './Dismissable';
export interface DismissableProps {
    disableOutsidePointerEvents?: boolean;
    onEscapeKeyDown?: (event: KeyboardEvent) => void;
    onPointerDownOutside?: (event: PointerDownOutsideEvent) => void;
    onFocusOutside?: (event: FocusOutsideEvent) => void;
    onInteractOutside?: (event: PointerDownOutsideEvent | FocusOutsideEvent) => void;
    onDismiss?: () => void;
    forceUnmount?: boolean;
    children?: React.ReactNode;
}
export interface DismissableBranchProps {
    children?: React.ReactNode;
}
//# sourceMappingURL=DismissableProps.d.ts.map
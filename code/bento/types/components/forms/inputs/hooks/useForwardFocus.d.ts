import type { RefObject } from 'react';
import type { TamaguiElement } from 'tamagui';
/** focus target element when trigger element is focused */
export declare const useForwardFocus: (target: RefObject<TamaguiElement>) => {
    onFocus: () => void;
    onBlur: () => void;
    focusable: boolean;
};
//# sourceMappingURL=useForwardFocus.d.ts.map
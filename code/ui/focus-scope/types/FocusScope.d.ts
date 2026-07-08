import * as React from 'react';
import type { FocusScopeProps } from './types';
type FocusScopeElement = HTMLDivElement;
declare const FocusScope: import("@tamagui/compose-refs").RefComponent<HTMLDivElement, FocusScopeProps>;
export declare function useFocusScope(props: FocusScopeProps, forwardedRef?: React.Ref<FocusScopeElement>): {
    ref: (node: HTMLElement) => void;
    onKeyDown: (event: React.KeyboardEvent) => void;
    asChild?: boolean;
};
export { FocusScope };
export type { FocusScopeProps };
//# sourceMappingURL=FocusScope.d.ts.map
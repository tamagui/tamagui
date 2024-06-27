import * as React from 'react';
import type { FocusScopeProps } from './FocusScopeProps';
type FocusScopeElement = HTMLDivElement;
declare const FocusScope: React.ForwardRefExoticComponent<FocusScopeProps & React.RefAttributes<HTMLDivElement>>;
export declare function useFocusScope(props: FocusScopeProps, forwardedRef: React.ForwardedRef<FocusScopeElement>): {
    ref: (node: HTMLDivElement) => void;
    onKeyDown: (event: React.KeyboardEvent) => void;
    tabIndex: number;
};
export { FocusScope };
export type { FocusScopeProps };
//# sourceMappingURL=FocusScope.d.ts.map
import * as React from 'react';
import type { FocusScopeProps } from './types';
type FocusScopeElement = HTMLDivElement;
declare const FocusScope: React.ForwardRefExoticComponent<FocusScopeProps & React.RefAttributes<HTMLDivElement>>;
export declare function useFocusScope(props: FocusScopeProps, forwardedRef: React.ForwardedRef<FocusScopeElement>): {
    ref: (node: HTMLDivElement) => void;
    onKeyDown: (event: React.KeyboardEvent) => void;
};
export { FocusScope };
export type { FocusScopeProps };
//# sourceMappingURL=FocusScope.d.ts.map
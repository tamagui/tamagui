import * as React from 'react';
import { FocusScopeProps } from './FocusScopeProps';
type FocusScopeElement = HTMLDivElement;
declare const FocusScope: React.ForwardRefExoticComponent<FocusScopeProps & React.RefAttributes<HTMLDivElement>>;
export declare function useFocusScope(props: FocusScopeProps, forwardedRef: React.ForwardedRef<FocusScopeElement>): {
    ref: (node: HTMLDivElement) => void;
    onKeyDown: (event: React.KeyboardEvent) => void;
    children?: React.ReactNode | ((props: {
        onKeyDown: (event: React.KeyboardEvent<Element>) => void;
        tabIndex: number;
        ref: React.ForwardedRef<any>;
    }) => React.ReactNode);
    tabIndex: number;
};
export { FocusScope };
export type { FocusScopeProps };
//# sourceMappingURL=FocusScope.d.ts.map
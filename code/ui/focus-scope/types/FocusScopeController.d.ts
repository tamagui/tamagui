import type { Scope } from '@tamagui/create-context';
import * as React from 'react';
import type { FocusScopeProps } from './FocusScopeProps';
type ScopedProps<P> = P & {
    __scopeFocusScopeController?: Scope;
};
declare const createFocusScopeControllerScope: import("@tamagui/create-context").CreateScope;
type FocusScopeControllerContextValue = Omit<FocusScopeProps, 'children'>;
declare const FocusScopeControllerProvider: (props: FocusScopeControllerContextValue & {
    scope: Scope<FocusScopeControllerContextValue>;
    children: React.ReactNode;
}) => import("react/jsx-runtime").JSX.Element, useFocusScopeControllerContext: (consumerName: string, scope: Scope<FocusScopeControllerContextValue | undefined>, options?: {
    warn?: boolean;
    fallback?: Partial<FocusScopeControllerContextValue> | undefined;
} | undefined) => FocusScopeControllerContextValue;
export interface FocusScopeControllerProps extends FocusScopeControllerContextValue {
    children?: React.ReactNode;
}
declare function FocusScopeController(props: ScopedProps<FocusScopeControllerProps>): import("react/jsx-runtime").JSX.Element;
declare const FocusScopeControllerComponent: typeof FocusScopeController;
export { createFocusScopeControllerScope, FocusScopeControllerComponent as FocusScopeController, FocusScopeControllerProvider, useFocusScopeControllerContext, };
//# sourceMappingURL=FocusScopeController.d.ts.map
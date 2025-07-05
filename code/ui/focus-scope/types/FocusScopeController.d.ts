import * as React from 'react';
import type { FocusScopeProps } from './types';
import type { ScopedProps } from './types';
declare const createFocusScopeControllerScope: import("@tamagui/create-context").CreateScope;
type FocusScopeControllerContextValue = Omit<FocusScopeProps, 'children'>;
declare const FocusScopeControllerProvider: (props: FocusScopeControllerContextValue & {
    scope: import("@tamagui/create-context").Scope<FocusScopeControllerContextValue>;
    children: React.ReactNode;
}) => import("react/jsx-runtime").JSX.Element, useFocusScopeControllerContext: (consumerName: string, scope: import("@tamagui/create-context").Scope<FocusScopeControllerContextValue | undefined>, options?: {
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
import { ReactNode } from 'react';
import { ScopedProps, SelectContextValue, SelectedItemContext } from './types';
export declare const createSelectContext: <ContextValueType extends object | null>(rootComponentName: string, defaultContext?: ContextValueType | undefined) => readonly [{
    (props: ContextValueType & {
        scope: import("@tamagui/create-context").Scope<ContextValueType>;
        children: ReactNode;
    }): JSX.Element;
    displayName: string;
}, (consumerName: string, scope: import("@tamagui/create-context").Scope<ContextValueType | undefined>) => ContextValueType], createSelectScope: import("@tamagui/create-context").CreateScope;
export declare const SelectProvider: {
    (props: SelectContextValue & {
        scope: import("@tamagui/create-context").Scope<SelectContextValue>;
        children: ReactNode;
    }): JSX.Element;
    displayName: string;
}, useSelectContext: (consumerName: string, scope: import("@tamagui/create-context").Scope<SelectContextValue | undefined>) => SelectContextValue;
export declare const ForwardSelectContext: (props: ScopedProps<{
    children?: any;
    context: SelectContextValue;
    itemContext: SelectedItemContext;
}>) => JSX.Element;
export declare const createSelectedItemContext: <ContextValueType extends object | null>(rootComponentName: string, defaultContext?: ContextValueType | undefined) => readonly [{
    (props: ContextValueType & {
        scope: import("@tamagui/create-context").Scope<ContextValueType>;
        children: ReactNode;
    }): JSX.Element;
    displayName: string;
}, (consumerName: string, scope: import("@tamagui/create-context").Scope<ContextValueType | undefined>) => ContextValueType], createSelectedItemScope: import("@tamagui/create-context").CreateScope;
export declare const SelectedItemProvider: {
    (props: SelectedItemContext & {
        scope: import("@tamagui/create-context").Scope<SelectedItemContext>;
        children: ReactNode;
    }): JSX.Element;
    displayName: string;
}, useSelectedItemContext: (consumerName: string, scope: import("@tamagui/create-context").Scope<SelectedItemContext | undefined>) => SelectedItemContext;
//# sourceMappingURL=context.d.ts.map
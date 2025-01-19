import type { SelectScopedProps, SelectContextValue, SelectItemParentContextValue } from './types';
export declare const createSelectContext: <ContextValueType extends object | null>(rootComponentName: string, defaultContext?: ContextValueType) => readonly [{
    (props: ContextValueType & {
        scope: import("@tamagui/create-context").Scope<ContextValueType>;
        children: React.ReactNode;
    }): import("react/jsx-runtime").JSX.Element;
    displayName: string;
}, (consumerName: string, scope: import("@tamagui/create-context").Scope<ContextValueType | undefined>, options?: {
    warn?: boolean;
    fallback?: Partial<ContextValueType>;
}) => ContextValueType], createSelectScope: import("@tamagui/create-context").CreateScope;
export declare const SelectProvider: {
    (props: SelectContextValue & {
        scope: import("@tamagui/create-context").Scope<SelectContextValue>;
        children: React.ReactNode;
    }): import("react/jsx-runtime").JSX.Element;
    displayName: string;
}, useSelectContext: (consumerName: string, scope: import("@tamagui/create-context").Scope<SelectContextValue | undefined>, options?: {
    warn?: boolean;
    fallback?: Partial<SelectContextValue> | undefined;
} | undefined) => SelectContextValue;
export declare const createSelectItemParentContext: <ContextValueType extends object | null>(rootComponentName: string, defaultContext?: ContextValueType) => readonly [{
    (props: ContextValueType & {
        scope: import("@tamagui/create-context").Scope<ContextValueType>;
        children: React.ReactNode;
    }): import("react/jsx-runtime").JSX.Element;
    displayName: string;
}, (consumerName: string, scope: import("@tamagui/create-context").Scope<ContextValueType | undefined>, options?: {
    warn?: boolean;
    fallback?: Partial<ContextValueType>;
}) => ContextValueType], createSelectItemParentScope: import("@tamagui/create-context").CreateScope;
export declare const SelectItemParentProvider: {
    (props: SelectItemParentContextValue & {
        scope: import("@tamagui/create-context").Scope<SelectItemParentContextValue>;
        children: React.ReactNode;
    }): import("react/jsx-runtime").JSX.Element;
    displayName: string;
}, useSelectItemParentContext: (consumerName: string, scope: import("@tamagui/create-context").Scope<SelectItemParentContextValue | undefined>, options?: {
    warn?: boolean;
    fallback?: Partial<SelectItemParentContextValue> | undefined;
} | undefined) => SelectItemParentContextValue;
export declare const ForwardSelectContext: ({ __scopeSelect, context, itemContext, children, }: SelectScopedProps<{
    children?: any;
    context: SelectContextValue;
    itemContext: SelectItemParentContextValue;
}>) => import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=context.d.ts.map
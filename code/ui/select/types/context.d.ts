import type { SelectContextValue, SelectItemParentContextValue } from './types';
export declare const SelectProvider: import("react").Provider<SelectContextValue> & import("react").ProviderExoticComponent<Partial<SelectContextValue> & {
    children?: import("react").ReactNode;
    scope?: string;
}>, useSelectContext: (scope?: string) => SelectContextValue;
export declare const SelectItemParentProvider: import("react").Provider<SelectItemParentContextValue> & import("react").ProviderExoticComponent<Partial<SelectItemParentContextValue> & {
    children?: import("react").ReactNode;
    scope?: string;
}>, useSelectItemParentContext: (scope?: string) => SelectItemParentContextValue;
export declare const ForwardSelectContext: ({ context, itemContext, children, }: {
    children?: any;
    context: SelectContextValue;
    itemContext: SelectItemParentContextValue;
}) => import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=context.d.ts.map
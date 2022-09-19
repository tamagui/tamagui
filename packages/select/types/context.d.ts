/// <reference types="react" />
import { ScopedProps, SelectContextValue } from './types';
export declare const createSelectContext: <ContextValueType extends object | null>(rootComponentName: string, defaultContext?: ContextValueType | undefined) => readonly [{
    (props: ContextValueType & {
        scope: import("@tamagui/create-context").Scope<ContextValueType>;
        children: import("react").ReactNode;
    }): JSX.Element;
    displayName: string;
}, (consumerName: string, scope: import("@tamagui/create-context").Scope<ContextValueType | undefined>) => ContextValueType], createSelectScope: import("@tamagui/create-context").CreateScope;
export declare const SelectProvider: {
    (props: SelectContextValue & {
        scope: import("@tamagui/create-context").Scope<SelectContextValue>;
        children: import("react").ReactNode;
    }): JSX.Element;
    displayName: string;
}, useSelectContext: (consumerName: string, scope: import("@tamagui/create-context").Scope<SelectContextValue | undefined>) => SelectContextValue;
export declare const ForwardSelectContext: (props: ScopedProps<{
    children?: any;
    context: SelectContextValue;
}>) => JSX.Element;
//# sourceMappingURL=context.d.ts.map
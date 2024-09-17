import type { StackProps } from '@tamagui/core';
import type { Scope } from '@tamagui/create-context';
export declare const FormFrame: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {}, import("@tamagui/core").StaticConfigPublic>;
type ScopedProps<P> = P & {
    __scopeForm?: Scope;
};
type FormContextValue = {
    onSubmit?: () => unknown;
};
export declare const FormProvider: {
    (props: FormContextValue & {
        scope: Scope<FormContextValue>;
        children: React.ReactNode;
    }): import("react/jsx-runtime").JSX.Element;
    displayName: string;
}, useFormContext: (consumerName: string, scope: Scope<FormContextValue | undefined>, options?: {
    warn?: boolean;
    fallback?: Partial<FormContextValue> | undefined;
} | undefined) => FormContextValue;
export type FormProps = StackProps & {
    onSubmit?: () => void;
};
export interface FormTriggerProps extends StackProps {
}
export declare const FormTrigger: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {}>, import("@tamagui/core").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & void, import("@tamagui/core").StackStyleBase, {}, import("@tamagui/core").StaticConfigPublic>;
export declare const Form: (({ onSubmit, ...props }: ScopedProps<FormProps>) => import("react/jsx-runtime").JSX.Element) & {
    Trigger: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {}>, import("@tamagui/core").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & void, import("@tamagui/core").StackStyleBase, {}, import("@tamagui/core").StaticConfigPublic>;
};
export {};
//# sourceMappingURL=Form.d.ts.map
import type { ViewProps } from '@tamagui/core';
export declare const FormFrame: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {}, import("@tamagui/core").StaticConfigPublic>;
type FormContextValue = {
    onSubmit?: () => unknown;
};
export declare const FormContext: import("@tamagui/core").StyledContext<FormContextValue>;
export declare const useFormContext: (scope?: string) => FormContextValue, FormProvider: import("react").Provider<FormContextValue> & import("react").ProviderExoticComponent<Partial<FormContextValue> & {
    children?: import("react").ReactNode;
    scope?: string;
}>;
type FormExtraProps = {
    scope?: string;
    onSubmit?: () => void;
};
export type FormProps = ViewProps & FormExtraProps;
export interface FormTriggerProps extends ViewProps {
    scope?: string;
}
export declare const FormTrigger: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {}>, keyof FormTriggerProps> & FormTriggerProps, import("@tamagui/core").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & FormTriggerProps, import("@tamagui/core").StackStyleBase, {}, import("@tamagui/core").StaticConfigPublic>;
export declare const Form: import("react").ForwardRefExoticComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {}>, keyof FormExtraProps> & FormExtraProps & import("react").RefAttributes<import("@tamagui/core").TamaguiElement>> & import("@tamagui/core").StaticComponentObject<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {}>, keyof FormExtraProps> & FormExtraProps, import("@tamagui/core").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & FormExtraProps, import("@tamagui/core").StackStyleBase, {}, import("@tamagui/core").StaticConfigPublic> & Omit<import("@tamagui/core").StaticConfigPublic, "staticConfig" | "styleable"> & {
    __tama: [Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {}>, keyof FormExtraProps> & FormExtraProps, import("@tamagui/core").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & FormExtraProps, import("@tamagui/core").StackStyleBase, {}, import("@tamagui/core").StaticConfigPublic];
} & {
    Trigger: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {}>, keyof FormTriggerProps> & FormTriggerProps, import("@tamagui/core").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & FormTriggerProps, import("@tamagui/core").StackStyleBase, {}, import("@tamagui/core").StaticConfigPublic>;
};
export {};
//# sourceMappingURL=Form.d.ts.map
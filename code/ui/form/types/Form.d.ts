import type { StackProps, TamaguiElement } from '@tamagui/core';
import type { Scope } from '@tamagui/create-context';
export declare const FormFrame: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {}, import("@tamagui/core").StaticConfigPublic>;
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
type FormExtraProps = {
    onSubmit?: () => void;
};
export type FormProps = StackProps & FormExtraProps;
export interface FormTriggerProps extends StackProps {
}
export declare const FormTrigger: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {}>, keyof FormTriggerProps | "__scopeForm"> & FormTriggerProps & {
    __scopeForm?: Scope;
}, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & FormTriggerProps & {
    __scopeForm?: Scope;
}, import("@tamagui/core").StackStyleBase, {}, import("@tamagui/core").StaticConfigPublic>;
export declare const Form: import("react").ForwardRefExoticComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {}>, "__scopeForm" | "onSubmit"> & FormExtraProps & {
    __scopeForm?: Scope;
} & import("react").RefAttributes<TamaguiElement>> & import("@tamagui/core").StaticComponentObject<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {}>, "__scopeForm" | "onSubmit"> & FormExtraProps & {
    __scopeForm?: Scope;
}, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & FormExtraProps & {
    __scopeForm?: Scope;
}, import("@tamagui/core").StackStyleBase, {}, import("@tamagui/core").StaticConfigPublic> & Omit<import("@tamagui/core").StaticConfigPublic, "staticConfig" | "styleable"> & {
    __tama: [Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {}>, "__scopeForm" | "onSubmit"> & FormExtraProps & {
        __scopeForm?: Scope;
    }, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & FormExtraProps & {
        __scopeForm?: Scope;
    }, import("@tamagui/core").StackStyleBase, {}, import("@tamagui/core").StaticConfigPublic];
} & {
    Trigger: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {}>, keyof FormTriggerProps | "__scopeForm"> & FormTriggerProps & {
        __scopeForm?: Scope;
    }, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & FormTriggerProps & {
        __scopeForm?: Scope;
    }, import("@tamagui/core").StackStyleBase, {}, import("@tamagui/core").StaticConfigPublic>;
};
export {};
//# sourceMappingURL=Form.d.ts.map
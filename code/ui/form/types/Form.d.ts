import type { TamaguiEventDetails, ViewProps } from '@tamagui/core';
import * as React from 'react';
export type FormValidationMode = 'onSubmit' | 'onBlur' | 'onChange';
export type FormErrors = Record<string, string | string[]>;
export type FormValues = Record<string, any>;
export type FormFieldRegistration = {
    name?: string;
    controlId?: string;
    controlRef: React.MutableRefObject<any>;
    getValue: () => unknown;
    validate: () => void;
    validityData: {
        state: {
            valid: boolean | null;
        };
    };
};
type FormRegistryContextValue = {
    validationMode: FormValidationMode;
    errors: FormErrors;
    formElementRef: React.MutableRefObject<HTMLFormElement | null>;
    submitAttemptedRef: React.MutableRefObject<boolean>;
    clearErrors: (name?: string) => void;
    getValues: () => FormValues;
    registerField: (id: string, registration: FormFieldRegistration) => () => void;
};
export declare const FormRegistryContext: React.Context<FormRegistryContextValue>;
export declare const useFormRegistryContext: () => FormRegistryContextValue;
type FormTriggerContextValue = {
    onSubmit?: (event?: unknown) => unknown;
};
export declare const FormContext: import("@tamagui/core").StyledContext<FormTriggerContextValue, "onSubmit">;
export declare const useFormContext: (scope?: string) => FormTriggerContextValue, FormProvider: React.Provider<FormTriggerContextValue> & React.ProviderExoticComponent<Partial<FormTriggerContextValue> & {
    children?: React.ReactNode;
    scope?: string;
}>;
export declare const FormFrame: React.FunctionComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, keyof import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {}>> & {
    ref?: React.Ref<import("@tamagui/core").TamaguiElement> | undefined;
}> & import("@tamagui/core").StaticComponentObject<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {}, import("@tamagui/core").StaticConfigPublic> & Omit<import("@tamagui/core").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {}, import("@tamagui/core").StaticConfigPublic];
};
export interface FormTriggerProps extends ViewProps {
    scope?: string;
}
export declare const FormTrigger: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {}>, keyof FormTriggerProps> & FormTriggerProps, import("react-native").View | (HTMLElement & import("@tamagui/core").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & FormTriggerProps, import("@tamagui/core").StackStyleBase, {}, import("@tamagui/core").StaticConfigPublic>;
export type FormSubmitEventDetails = TamaguiEventDetails<'submit' | 'trigger-press', unknown>;
export interface FormActions {
    validate: (fieldName?: string) => void;
}
type FormExtraProps<FormValue extends FormValues = FormValues> = {
    scope?: string;
    validationMode?: FormValidationMode;
    errors?: FormErrors;
    actionsRef?: React.RefObject<FormActions | null>;
    onSubmit?: (values: FormValue, details: FormSubmitEventDetails) => void | Promise<void>;
};
export type FormProps<FormValue extends FormValues = FormValues> = Omit<ViewProps, 'onSubmit'> & FormExtraProps<FormValue>;
type FormComponentType = <FormValue extends FormValues = FormValues>(props: FormProps<FormValue> & {
    ref?: React.Ref<any>;
}) => React.ReactElement;
export declare const Form: FormComponentType & {
    Trigger: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {}>, keyof FormTriggerProps> & FormTriggerProps, import("react-native").View | (HTMLElement & import("@tamagui/core").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & FormTriggerProps, import("@tamagui/core").StackStyleBase, {}, import("@tamagui/core").StaticConfigPublic>;
};
export declare namespace Form {
    type Actions = FormActions;
    type Errors = FormErrors;
    type Props<FormValue extends FormValues = FormValues> = FormProps<FormValue>;
    type SubmitEventDetails = FormSubmitEventDetails;
    type ValidationMode = FormValidationMode;
    type Values<FormValue extends FormValues = FormValues> = FormValue;
}
export {};
//# sourceMappingURL=Form.d.ts.map
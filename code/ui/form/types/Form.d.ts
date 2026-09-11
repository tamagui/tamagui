import type { TamaguiEventDetails, ViewProps } from '@tamagui/style';
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
export declare const FormContext: import("@tamagui/style").StyledContext<FormTriggerContextValue, "onSubmit">;
export declare const useFormContext: (scope?: string) => FormTriggerContextValue, FormProvider: React.Provider<FormTriggerContextValue> & React.ProviderExoticComponent<Partial<FormTriggerContextValue> & {
    children?: React.ReactNode;
    scope?: string;
}>;
export declare const FormFrame: React.FunctionComponent<Omit<import("@tamagui/style").RNTamaguiViewNonStyleProps, keyof import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{}> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>> & {
    ref?: React.Ref<import("@tamagui/style").TamaguiElement> | undefined;
}> & import("@tamagui/style").StaticComponentObject<import("@tamagui/style").TamaDefer, import("@tamagui/style").TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps, import("@tamagui/style").StackStyleBase, {}, import("@tamagui/style").StaticConfigPublic> & Omit<import("@tamagui/style").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/style").TamaDefer, import("@tamagui/style").TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps, import("@tamagui/style").StackStyleBase, {}, import("@tamagui/style").StaticConfigPublic];
};
export interface FormTriggerProps extends ViewProps {
    scope?: string;
}
export declare const FormTrigger: import("@tamagui/style").TamaguiComponent<Omit<import("@tamagui/style").GetFinalProps<import("@tamagui/style").RNTamaguiViewNonStyleProps, import("@tamagui/style").StackStyleBase, {}>, keyof FormTriggerProps> & FormTriggerProps, import("@tamagui/style").TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps & FormTriggerProps, import("@tamagui/style").StackStyleBase, {}, import("@tamagui/style").StaticConfigPublic>;
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
    Trigger: import("@tamagui/style").TamaguiComponent<Omit<import("@tamagui/style").GetFinalProps<import("@tamagui/style").RNTamaguiViewNonStyleProps, import("@tamagui/style").StackStyleBase, {}>, keyof FormTriggerProps> & FormTriggerProps, import("@tamagui/style").TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps & FormTriggerProps, import("@tamagui/style").StackStyleBase, {}, import("@tamagui/style").StaticConfigPublic>;
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
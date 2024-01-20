/// <reference types="react" />
import { StackProps } from '@tamagui/core';
import { Scope } from '@tamagui/create-context';
export declare const FormFrame: import("@tamagui/core").TamaguiComponent<{
    __tamaDefer: true;
}, import("@tamagui/core").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStylePropsBase, void, {}>;
type ScopedProps<P> = P & {
    __scopeForm?: Scope;
};
type FormContextValue = {
    onSubmit: () => unknown;
};
export declare const FormProvider: {
    (props: FormContextValue & {
        scope: Scope<FormContextValue>;
        children: import("react").ReactNode;
    }): JSX.Element;
    displayName: string;
}, useFormContext: (consumerName: string, scope: Scope<FormContextValue | undefined>, options?: {
    warn?: boolean | undefined;
    fallback?: Partial<FormContextValue> | undefined;
} | undefined) => FormContextValue;
export type FormProps = StackProps & {
    onSubmit: () => void;
};
export interface FormTriggerProps extends StackProps {
}
export declare const FormTrigger: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStylePropsBase & void>, import("@tamagui/core").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & void, import("@tamagui/core").StackStylePropsBase, void, {}>;
export declare const Form: (({ onSubmit, ...props }: ScopedProps<FormProps>) => JSX.Element) & {
    Trigger: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStylePropsBase & void>, import("@tamagui/core").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & void, import("@tamagui/core").StackStylePropsBase, void, {}>;
};
export {};
//# sourceMappingURL=Form.d.ts.map
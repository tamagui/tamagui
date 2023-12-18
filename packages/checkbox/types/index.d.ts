/// <reference types="react" />
export * from './createCheckbox';
export * from './Checkbox';
export declare const Checkbox: import("react").ForwardRefExoticComponent<Omit<import("react-native").PressableProps, "children"> & Omit<import("@tamagui/checkbox-headless").CheckboxBaseProps, "children"> & {
    children?: import("react").ReactNode | ((checked: import("@tamagui/checkbox-headless").CheckedState) => import("react").ReactNode);
} & {
    __scopeCheckbox?: import("@tamagui/create-context").Scope;
} & import("react").RefAttributes<import("react").ForwardRefExoticComponent<import("react-native").PressableProps & import("react").RefAttributes<import("react-native").View>>>> & {
    Indicator: import("react").ForwardRefExoticComponent<import("@tamagui/checkbox-headless").CheckboxIndicatorBaseProps & import("react-native").ViewProps & import("react").RefAttributes<import("react").ForwardRefExoticComponent<import("react-native").ViewProps>>>;
} & {
    Props: import("react").ProviderExoticComponent<Partial<{
        size: import("@tamagui/web").SizeTokens;
        scaleIcon: number;
    }> & {
        children?: import("react").ReactNode;
        scope?: string | undefined;
    }>;
};
//# sourceMappingURL=index.d.ts.map
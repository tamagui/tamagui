import { type ComponentSize, type GetProps } from '@tamagui/core';
export type RadioGroupSize = ComponentSize | boolean;
export declare const RadioGroupFrame: import("react").FunctionComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "orientation" | keyof import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithFlatVariantValues<{
    orientation?: "horizontal" | "vertical" | undefined;
}> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & {
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    required?: boolean;
    disabled?: boolean;
    name?: string;
    native?: boolean;
    accentColor?: string;
}, "orientation" | keyof import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithFlatVariantValues<{
    orientation?: "horizontal" | "vertical" | undefined;
}> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & {
    ref?: import("react").Ref<import("@tamagui/react-native-types/src").View | (HTMLElement & import("@tamagui/core").TamaguiElementMethods)> | undefined;
}> & import("@tamagui/core").StaticComponentObject<import("@tamagui/core").TamaDefer, import("@tamagui/react-native-types/src").View | (HTMLElement & import("@tamagui/core").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "orientation" | keyof import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithFlatVariantValues<{
    orientation?: "horizontal" | "vertical" | undefined;
}> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & {
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    required?: boolean;
    disabled?: boolean;
    name?: string;
    native?: boolean;
    accentColor?: string;
}, import("@tamagui/core").StackStyleBase, {
    orientation?: "horizontal" | "vertical" | undefined;
}, import("@tamagui/core").StaticConfigPublic> & Omit<import("@tamagui/core").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/core").TamaDefer, import("@tamagui/react-native-types/src").View | (HTMLElement & import("@tamagui/core").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "orientation" | keyof import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithFlatVariantValues<{
        orientation?: "horizontal" | "vertical" | undefined;
    }> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & {
        value?: string;
        defaultValue?: string;
        onValueChange?: (value: string) => void;
        required?: boolean;
        disabled?: boolean;
        name?: string;
        native?: boolean;
        accentColor?: string;
    }, import("@tamagui/core").StackStyleBase, {
        orientation?: "horizontal" | "vertical" | undefined;
    }, import("@tamagui/core").StaticConfigPublic];
};
export declare const RadioGroupItem: import("react").FunctionComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "disabled" | keyof import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithFlatVariantValues<{
    disabled?: boolean | undefined;
}> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & {
    value: string;
    id?: string;
    labelledBy?: string;
    disabled?: boolean;
    activeStyle?: import("@tamagui/core").StylePiece;
    activeTheme?: string | null;
}, "disabled" | "size" | keyof import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithFlatVariantValues<{
    disabled?: boolean | undefined;
    size?: RadioGroupSize | undefined;
}> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & {
    ref?: import("react").Ref<import("@tamagui/react-native-types/src").View | (HTMLElement & import("@tamagui/core").TamaguiElementMethods)> | undefined;
}> & import("@tamagui/core").StaticComponentObject<import("@tamagui/core").TamaDefer, import("@tamagui/react-native-types/src").View | (HTMLElement & import("@tamagui/core").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "disabled" | keyof import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithFlatVariantValues<{
    disabled?: boolean | undefined;
}> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & {
    value: string;
    id?: string;
    labelledBy?: string;
    disabled?: boolean;
    activeStyle?: import("@tamagui/core").StylePiece;
    activeTheme?: string | null;
}, import("@tamagui/core").StackStyleBase, {
    disabled?: boolean | undefined;
    size?: RadioGroupSize | undefined;
}, import("@tamagui/core").StaticConfigPublic> & Omit<import("@tamagui/core").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/core").TamaDefer, import("@tamagui/react-native-types/src").View | (HTMLElement & import("@tamagui/core").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "disabled" | keyof import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithFlatVariantValues<{
        disabled?: boolean | undefined;
    }> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & {
        value: string;
        id?: string;
        labelledBy?: string;
        disabled?: boolean;
        activeStyle?: import("@tamagui/core").StylePiece;
        activeTheme?: string | null;
    }, import("@tamagui/core").StackStyleBase, {
        disabled?: boolean | undefined;
        size?: RadioGroupSize | undefined;
    }, import("@tamagui/core").StaticConfigPublic];
};
export declare const RadioGroupIndicator: import("react").FunctionComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, keyof import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithFlatVariantValues<{}> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & {
    forceMount?: boolean;
}, keyof import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithFlatVariantValues<{}> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & {
    ref?: import("react").Ref<import("@tamagui/react-native-types/src").View | (HTMLElement & import("@tamagui/core").TamaguiElementMethods)> | undefined;
}> & import("@tamagui/core").StaticComponentObject<import("@tamagui/core").TamaDefer, import("@tamagui/react-native-types/src").View | (HTMLElement & import("@tamagui/core").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, keyof import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithFlatVariantValues<{}> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & {
    forceMount?: boolean;
}, import("@tamagui/core").StackStyleBase, {}, import("@tamagui/core").StaticConfigPublic> & Omit<import("@tamagui/core").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/core").TamaDefer, import("@tamagui/react-native-types/src").View | (HTMLElement & import("@tamagui/core").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, keyof import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithFlatVariantValues<{}> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & {
        forceMount?: boolean;
    }, import("@tamagui/core").StackStyleBase, {}, import("@tamagui/core").StaticConfigPublic];
};
export declare const RadioGroup: import("react").FunctionComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "orientation" | keyof import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithFlatVariantValues<{
    orientation?: "horizontal" | "vertical" | undefined;
}> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & {
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    required?: boolean;
    disabled?: boolean;
    name?: string;
    native?: boolean;
    accentColor?: string;
}, "orientation" | keyof import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithFlatVariantValues<{
    orientation?: "horizontal" | "vertical" | undefined;
}> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & {
    ref?: import("react").Ref<import("@tamagui/react-native-types/src").View | (HTMLElement & import("@tamagui/core").TamaguiElementMethods)> | undefined;
}> & import("@tamagui/core").StaticComponentObject<import("@tamagui/core").TamaDefer, import("@tamagui/react-native-types/src").View | (HTMLElement & import("@tamagui/core").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "orientation" | keyof import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithFlatVariantValues<{
    orientation?: "horizontal" | "vertical" | undefined;
}> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & {
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    required?: boolean;
    disabled?: boolean;
    name?: string;
    native?: boolean;
    accentColor?: string;
}, import("@tamagui/core").StackStyleBase, {
    orientation?: "horizontal" | "vertical" | undefined;
}, import("@tamagui/core").StaticConfigPublic> & Omit<import("@tamagui/core").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/core").TamaDefer, import("@tamagui/react-native-types/src").View | (HTMLElement & import("@tamagui/core").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "orientation" | keyof import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithFlatVariantValues<{
        orientation?: "horizontal" | "vertical" | undefined;
    }> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & {
        value?: string;
        defaultValue?: string;
        onValueChange?: (value: string) => void;
        required?: boolean;
        disabled?: boolean;
        name?: string;
        native?: boolean;
        accentColor?: string;
    }, import("@tamagui/core").StackStyleBase, {
        orientation?: "horizontal" | "vertical" | undefined;
    }, import("@tamagui/core").StaticConfigPublic];
} & {
    Item: import("react").FunctionComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "disabled" | keyof import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithFlatVariantValues<{
        disabled?: boolean | undefined;
    }> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & {
        value: string;
        id?: string;
        labelledBy?: string;
        disabled?: boolean;
        activeStyle?: import("@tamagui/core").StylePiece;
        activeTheme?: string | null;
    }, "disabled" | "size" | keyof import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithFlatVariantValues<{
        disabled?: boolean | undefined;
        size?: RadioGroupSize | undefined;
    }> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & {
        ref?: import("react").Ref<import("@tamagui/react-native-types/src").View | (HTMLElement & import("@tamagui/core").TamaguiElementMethods)> | undefined;
    }> & import("@tamagui/core").StaticComponentObject<import("@tamagui/core").TamaDefer, import("@tamagui/react-native-types/src").View | (HTMLElement & import("@tamagui/core").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "disabled" | keyof import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithFlatVariantValues<{
        disabled?: boolean | undefined;
    }> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & {
        value: string;
        id?: string;
        labelledBy?: string;
        disabled?: boolean;
        activeStyle?: import("@tamagui/core").StylePiece;
        activeTheme?: string | null;
    }, import("@tamagui/core").StackStyleBase, {
        disabled?: boolean | undefined;
        size?: RadioGroupSize | undefined;
    }, import("@tamagui/core").StaticConfigPublic> & Omit<import("@tamagui/core").StaticConfigPublic, "staticConfig"> & {
        __tama: [import("@tamagui/core").TamaDefer, import("@tamagui/react-native-types/src").View | (HTMLElement & import("@tamagui/core").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "disabled" | keyof import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithFlatVariantValues<{
            disabled?: boolean | undefined;
        }> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & {
            value: string;
            id?: string;
            labelledBy?: string;
            disabled?: boolean;
            activeStyle?: import("@tamagui/core").StylePiece;
            activeTheme?: string | null;
        }, import("@tamagui/core").StackStyleBase, {
            disabled?: boolean | undefined;
            size?: RadioGroupSize | undefined;
        }, import("@tamagui/core").StaticConfigPublic];
    };
    Indicator: import("react").FunctionComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, keyof import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithFlatVariantValues<{}> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & {
        forceMount?: boolean;
    }, keyof import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithFlatVariantValues<{}> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & {
        ref?: import("react").Ref<import("@tamagui/react-native-types/src").View | (HTMLElement & import("@tamagui/core").TamaguiElementMethods)> | undefined;
    }> & import("@tamagui/core").StaticComponentObject<import("@tamagui/core").TamaDefer, import("@tamagui/react-native-types/src").View | (HTMLElement & import("@tamagui/core").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, keyof import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithFlatVariantValues<{}> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & {
        forceMount?: boolean;
    }, import("@tamagui/core").StackStyleBase, {}, import("@tamagui/core").StaticConfigPublic> & Omit<import("@tamagui/core").StaticConfigPublic, "staticConfig"> & {
        __tama: [import("@tamagui/core").TamaDefer, import("@tamagui/react-native-types/src").View | (HTMLElement & import("@tamagui/core").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, keyof import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithFlatVariantValues<{}> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & {
            forceMount?: boolean;
        }, import("@tamagui/core").StackStyleBase, {}, import("@tamagui/core").StaticConfigPublic];
    };
};
export type RadioGroupProps = GetProps<typeof RadioGroup>;
//# sourceMappingURL=RadioGroup.d.ts.map
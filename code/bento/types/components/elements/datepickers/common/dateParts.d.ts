import type { DatePickerProviderProps } from '@rehookify/datepicker';
import type { GestureReponderEvent } from '@tamagui/web';
import type { PopoverProps } from 'tamagui';
/** rehookify internally return `onClick` and that's incompatible with native */
export declare function swapOnClick<D>(d: D): D;
type DatePickerProps = PopoverProps & {
    config: DatePickerProviderProps['config'];
};
export declare const HeaderTypeProvider: import("react").ProviderExoticComponent<Partial<{
    type: string;
    setHeader: (_: "day" | "month" | "year") => void;
}> & {
    children?: import("react").ReactNode;
    scope?: string;
}>, useHeaderType: (scope?: string) => {
    type: string;
    setHeader: (_: "day" | "month" | "year") => void;
};
export declare const DatePicker: ((props: DatePickerProps) => import("react/jsx-runtime").JSX.Element) & {
    Trigger: import("tamagui").TamaguiComponent<Omit<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
        elevation?: number | import("tamagui").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    }>, "__scopePopper" | "virtualRef"> & import("tamagui").PopperAnchorExtraProps & {
        __scopePopper?: string | undefined;
    }, "__scopePopover"> & {
        __scopePopover?: string | undefined;
    }, import("tamagui").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & import("tamagui").PopperAnchorExtraProps & {
        __scopePopper?: string | undefined;
    } & {
        __scopePopover?: string | undefined;
    }, import("@tamagui/web").StackStyleBase, {
        elevation?: number | import("tamagui").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    }, import("@tamagui/web").StaticConfigPublic>;
    Content: import("react").ForwardRefExoticComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps & import("tamagui").PopoverContentTypeProps & {
        __scopePopover?: string | undefined;
    }, "size" | "elevation" | keyof import("@tamagui/web").StackStyleBase | "fullscreen" | "unstyled"> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
        size?: import("tamagui").SizeTokens | undefined;
        elevation?: number | import("tamagui").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
        unstyled?: boolean | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
        size?: import("tamagui").SizeTokens | undefined;
        elevation?: number | import("tamagui").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
        unstyled?: boolean | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {
        size?: import("tamagui").SizeTokens | undefined;
        elevation?: number | import("tamagui").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
        unstyled?: boolean | undefined;
    }>> & import("react").RefAttributes<import("tamagui").TamaguiElement>> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, import("tamagui").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & import("tamagui").PopoverContentTypeProps & {
        __scopePopover?: string | undefined;
    }, import("@tamagui/web").StackStyleBase, {
        size?: import("tamagui").SizeTokens | undefined;
        elevation?: number | import("tamagui").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
        unstyled?: boolean | undefined;
    }, import("@tamagui/web").StaticConfigPublic> & Omit<import("@tamagui/web").StaticConfigPublic, "staticConfig" | "styleable"> & {
        __tama: [import("@tamagui/web").TamaDefer, import("tamagui").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & import("tamagui").PopoverContentTypeProps & {
            __scopePopover?: string | undefined;
        }, import("@tamagui/web").StackStyleBase, {
            size?: import("tamagui").SizeTokens | undefined;
            elevation?: number | import("tamagui").SizeTokens | undefined;
            fullscreen?: boolean | undefined;
            unstyled?: boolean | undefined;
        }, import("@tamagui/web").StaticConfigPublic];
    } & {
        Arrow: import("tamagui").TamaguiComponent<import("@tamagui/web").TamaDefer, import("tamagui").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & import("tamagui").PopperArrowExtraProps, import("@tamagui/web").StackStyleBase, {
            elevation?: number | import("tamagui").SizeTokens | undefined;
            fullscreen?: boolean | undefined;
            unstyled?: boolean | undefined;
        }, import("@tamagui/web").StaticConfigPublic>;
    };
};
type DatePickerInputProps = {
    onReset: () => void;
    onButtonPress?: (e: GestureReponderEvent) => void;
};
export declare const DatePickerInput: import("tamagui").TamaguiComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/web").TamaguiComponentPropsBaseBase & import("react-native").TextInputProps & import("tamagui").InputExtraProps, import("@tamagui/web").TextStylePropsBase & {
    readonly placeholderTextColor?: Omit<import("tamagui").ColorTokens | import("@tamagui/web").ThemeValueFallbackColor, "unset"> | undefined;
    readonly selectionColor?: Omit<import("tamagui").ColorTokens | import("@tamagui/web").ThemeValueFallbackColor, "unset"> | undefined;
}, {
    size?: import("tamagui").SizeTokens | undefined;
    disabled?: boolean | undefined;
    unstyled?: boolean | undefined;
}>, keyof DatePickerInputProps> & DatePickerInputProps, import("react-native").TextInput, import("@tamagui/web").TamaguiComponentPropsBaseBase & import("react-native").TextInputProps & import("tamagui").InputExtraProps & void & DatePickerInputProps, import("@tamagui/web").TextStylePropsBase & {
    readonly placeholderTextColor?: Omit<import("tamagui").ColorTokens | import("@tamagui/web").ThemeValueFallbackColor, "unset"> | undefined;
    readonly selectionColor?: Omit<import("tamagui").ColorTokens | import("@tamagui/web").ThemeValueFallbackColor, "unset"> | undefined;
}, {
    size?: import("tamagui").SizeTokens | undefined;
    disabled?: boolean | undefined;
    unstyled?: boolean | undefined;
}, {
    isInput: true;
    accept: {
        readonly placeholderTextColor: "color";
        readonly selectionColor: "color";
    };
} & import("@tamagui/web").StaticConfigPublic>;
export declare function MonthPicker({ onChange, }: {
    onChange?: (e: MouseEvent, date: Date) => void;
}): import("react/jsx-runtime").JSX.Element;
export declare function YearPicker({ onChange, }: {
    onChange?: (e: MouseEvent, date: Date) => void;
}): import("react/jsx-runtime").JSX.Element;
export declare function YearRangeSlider(): import("react/jsx-runtime").JSX.Element;
export declare function YearSlider(): import("react/jsx-runtime").JSX.Element;
export declare const SizableText: import("tamagui").TamaguiComponent<import("@tamagui/web").TamaDefer, import("tamagui").TamaguiTextElement, import("@tamagui/core").RNTamaguiTextNonStyleProps, import("@tamagui/web").TextStylePropsBase, {
    size?: import("tamagui").FontSizeTokens | undefined;
    unstyled?: boolean | undefined;
}, import("@tamagui/web").StaticConfigPublic>;
export {};
//# sourceMappingURL=dateParts.d.ts.map
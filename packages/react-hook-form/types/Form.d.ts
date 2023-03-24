import { FormProps as FormDefaultProps } from '@tamagui/form';
import { PropsWithChildren } from 'react';
import { FieldValues, SubmitHandler, UseFormProps } from 'react-hook-form';
export type FormProps = UseFormProps & Omit<FormDefaultProps, 'onSubmit'> & {
    onSubmit: SubmitHandler<FieldValues>;
};
export declare const Form: (({ children, onSubmit, mode, reValidateMode, defaultValues, values, resetOptions, resolver, context, shouldFocusError, shouldUnregister, shouldUseNativeValidation, criteriaMode, delayError, ...formProps }: PropsWithChildren<FormProps>) => JSX.Element) & {
    Checkbox: import("react").ForwardRefExoticComponent<Omit<import("tamagui").CheckboxProps & import("react").RefAttributes<HTMLButtonElement> & Omit<import("react-hook-form").ControllerProps<FieldValues, string>, "render" | "control">, "ref"> & import("react").RefAttributes<unknown>> & {
        Indicator: import("react").ForwardRefExoticComponent<((Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
            readonly fullscreen?: boolean | undefined;
            readonly elevation?: import("@tamagui/web").SizeTokens | undefined;
        }, "transparent" | "hoverTheme" | "pressTheme" | "focusTheme" | "elevate" | "bordered" | "circular" | "backgrounded" | "radiused" | "padded" | "chromeless"> & {
            readonly backgrounded?: boolean | undefined;
            readonly radiused?: boolean | undefined;
            readonly hoverTheme?: boolean | undefined;
            readonly pressTheme?: boolean | undefined;
            readonly focusTheme?: boolean | undefined;
            readonly circular?: boolean | undefined;
            readonly padded?: boolean | undefined;
            readonly elevate?: boolean | undefined;
            readonly bordered?: number | boolean | undefined;
            readonly transparent?: boolean | undefined;
            readonly chromeless?: boolean | "all" | undefined;
        } & import("@tamagui/web").MediaProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
            readonly fullscreen?: boolean | undefined;
            readonly elevation?: import("@tamagui/web").SizeTokens | undefined;
        }, "transparent" | "hoverTheme" | "pressTheme" | "focusTheme" | "elevate" | "bordered" | "circular" | "backgrounded" | "radiused" | "padded" | "chromeless"> & {
            readonly backgrounded?: boolean | undefined;
            readonly radiused?: boolean | undefined;
            readonly hoverTheme?: boolean | undefined;
            readonly pressTheme?: boolean | undefined;
            readonly focusTheme?: boolean | undefined;
            readonly circular?: boolean | undefined;
            readonly padded?: boolean | undefined;
            readonly elevate?: boolean | undefined;
            readonly bordered?: number | boolean | undefined;
            readonly transparent?: boolean | undefined;
            readonly chromeless?: boolean | "all" | undefined;
        }>> & import("@tamagui/web").PseudoProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
            readonly fullscreen?: boolean | undefined;
            readonly elevation?: import("@tamagui/web").SizeTokens | undefined;
        }, "transparent" | "hoverTheme" | "pressTheme" | "focusTheme" | "elevate" | "bordered" | "circular" | "backgrounded" | "radiused" | "padded" | "chromeless"> & {
            readonly backgrounded?: boolean | undefined;
            readonly radiused?: boolean | undefined;
            readonly hoverTheme?: boolean | undefined;
            readonly pressTheme?: boolean | undefined;
            readonly focusTheme?: boolean | undefined;
            readonly circular?: boolean | undefined;
            readonly padded?: boolean | undefined;
            readonly elevate?: boolean | undefined;
            readonly bordered?: number | boolean | undefined;
            readonly transparent?: boolean | undefined;
            readonly chromeless?: boolean | "all" | undefined;
        }>> & {
            forceMount?: true | undefined;
            disablePassStyles?: boolean | undefined;
        }) | Omit<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
            readonly fullscreen?: boolean | undefined;
            readonly elevation?: import("@tamagui/web").SizeTokens | undefined;
        } & {
            readonly backgrounded?: boolean | undefined;
            readonly radiused?: boolean | undefined;
            readonly hoverTheme?: boolean | undefined;
            readonly pressTheme?: boolean | undefined;
            readonly focusTheme?: boolean | undefined;
            readonly circular?: boolean | undefined;
            readonly padded?: boolean | undefined;
            readonly elevate?: boolean | undefined;
            readonly bordered?: number | boolean | undefined;
            readonly transparent?: boolean | undefined;
            readonly chromeless?: boolean | "all" | undefined;
        }, string | number> & {
            [x: string]: undefined;
        } & import("@tamagui/web").MediaProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
            readonly fullscreen?: boolean | undefined;
            readonly elevation?: import("@tamagui/web").SizeTokens | undefined;
        } & {
            readonly backgrounded?: boolean | undefined;
            readonly radiused?: boolean | undefined;
            readonly hoverTheme?: boolean | undefined;
            readonly pressTheme?: boolean | undefined;
            readonly focusTheme?: boolean | undefined;
            readonly circular?: boolean | undefined;
            readonly padded?: boolean | undefined;
            readonly elevate?: boolean | undefined;
            readonly bordered?: number | boolean | undefined;
            readonly transparent?: boolean | undefined;
            readonly chromeless?: boolean | "all" | undefined;
        }, string | number> & {
            [x: string]: undefined;
        }>> & import("@tamagui/web").PseudoProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
            readonly fullscreen?: boolean | undefined;
            readonly elevation?: import("@tamagui/web").SizeTokens | undefined;
        } & {
            readonly backgrounded?: boolean | undefined;
            readonly radiused?: boolean | undefined;
            readonly hoverTheme?: boolean | undefined;
            readonly pressTheme?: boolean | undefined;
            readonly focusTheme?: boolean | undefined;
            readonly circular?: boolean | undefined;
            readonly padded?: boolean | undefined;
            readonly elevate?: boolean | undefined;
            readonly bordered?: number | boolean | undefined;
            readonly transparent?: boolean | undefined;
            readonly chromeless?: boolean | "all" | undefined;
        }, string | number> & {
            [x: string]: undefined;
        }>> & {
            forceMount?: true | undefined;
            disablePassStyles?: boolean | undefined;
        }, "ref">) & import("react").RefAttributes<import("@tamagui/web").TamaguiElement>>;
    };
    Input: import("react").ForwardRefExoticComponent<Omit<import("react-native").TextInputProps & Omit<import("@tamagui/web").TextProps, keyof import("react-native").TextInputProps> & Omit<{}, "size" | "unstyled"> & {
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/web").SizeTokens | undefined;
    } & import("@tamagui/web").MediaProps<Partial<import("react-native").TextInputProps & Omit<import("@tamagui/web").TextProps, keyof import("react-native").TextInputProps> & Omit<{}, "size" | "unstyled"> & {
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/web").SizeTokens | undefined;
    }>> & import("@tamagui/web").PseudoProps<Partial<import("react-native").TextInputProps & Omit<import("@tamagui/web").TextProps, keyof import("react-native").TextInputProps> & Omit<{}, "size" | "unstyled"> & {
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/web").SizeTokens | undefined;
    }>> & import("react").RefAttributes<import("@tamagui/web").TamaguiElement> & Omit<import("react-hook-form").ControllerProps<FieldValues, string>, "render" | "control">, "ref"> & import("react").RefAttributes<unknown>>;
    RadioGroup: import("react").ForwardRefExoticComponent<Omit<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: import("@tamagui/web").SizeTokens | undefined;
    } & {
        readonly backgrounded?: boolean | undefined;
        readonly radiused?: boolean | undefined;
        readonly hoverTheme?: boolean | undefined;
        readonly pressTheme?: boolean | undefined;
        readonly focusTheme?: boolean | undefined;
        readonly circular?: boolean | undefined;
        readonly padded?: boolean | undefined;
        readonly elevate?: boolean | undefined;
        readonly bordered?: number | boolean | undefined;
        readonly transparent?: boolean | undefined;
        readonly chromeless?: boolean | "all" | undefined;
    }, "orientation"> & {
        readonly orientation?: "vertical" | "horizontal" | undefined;
    } & import("@tamagui/web").MediaProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: import("@tamagui/web").SizeTokens | undefined;
    } & {
        readonly backgrounded?: boolean | undefined;
        readonly radiused?: boolean | undefined;
        readonly hoverTheme?: boolean | undefined;
        readonly pressTheme?: boolean | undefined;
        readonly focusTheme?: boolean | undefined;
        readonly circular?: boolean | undefined;
        readonly padded?: boolean | undefined;
        readonly elevate?: boolean | undefined;
        readonly bordered?: number | boolean | undefined;
        readonly transparent?: boolean | undefined;
        readonly chromeless?: boolean | "all" | undefined;
    }, "orientation"> & {
        readonly orientation?: "vertical" | "horizontal" | undefined;
    }>> & import("@tamagui/web").PseudoProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: import("@tamagui/web").SizeTokens | undefined;
    } & {
        readonly backgrounded?: boolean | undefined;
        readonly radiused?: boolean | undefined;
        readonly hoverTheme?: boolean | undefined;
        readonly pressTheme?: boolean | undefined;
        readonly focusTheme?: boolean | undefined;
        readonly circular?: boolean | undefined;
        readonly padded?: boolean | undefined;
        readonly elevate?: boolean | undefined;
        readonly bordered?: number | boolean | undefined;
        readonly transparent?: boolean | undefined;
        readonly chromeless?: boolean | "all" | undefined;
    }, "orientation"> & {
        readonly orientation?: "vertical" | "horizontal" | undefined;
    }>> & {
        value?: string | undefined;
        defaultValue?: string | undefined;
        onValueChange?: ((value: string) => void) | undefined;
        required?: boolean | undefined;
        disabled?: boolean | undefined;
        name?: string | undefined;
        native?: boolean | undefined;
        accentColor?: string | undefined;
    } & import("react").RefAttributes<HTMLElement | import("react-native").View> & Omit<import("react-hook-form").ControllerProps<FieldValues, string>, "render" | "control">, "ref"> & import("react").RefAttributes<unknown>> & {
        Item: import("react").ForwardRefExoticComponent<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
            readonly fullscreen?: boolean | undefined;
            readonly elevation?: import("@tamagui/web").SizeTokens | undefined;
        } & {
            readonly backgrounded?: boolean | undefined;
            readonly radiused?: boolean | undefined;
            readonly hoverTheme?: boolean | undefined;
            readonly pressTheme?: boolean | undefined;
            readonly focusTheme?: boolean | undefined;
            readonly circular?: boolean | undefined;
            readonly padded?: boolean | undefined;
            readonly elevate?: boolean | undefined;
            readonly bordered?: number | boolean | undefined;
            readonly transparent?: boolean | undefined;
            readonly chromeless?: boolean | "all" | undefined;
        }, "size" | "unstyled"> & {
            readonly unstyled?: boolean | undefined;
            readonly size?: import("@tamagui/web").SizeTokens | undefined;
        } & import("@tamagui/web").MediaProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
            readonly fullscreen?: boolean | undefined;
            readonly elevation?: import("@tamagui/web").SizeTokens | undefined;
        } & {
            readonly backgrounded?: boolean | undefined;
            readonly radiused?: boolean | undefined;
            readonly hoverTheme?: boolean | undefined;
            readonly pressTheme?: boolean | undefined;
            readonly focusTheme?: boolean | undefined;
            readonly circular?: boolean | undefined;
            readonly padded?: boolean | undefined;
            readonly elevate?: boolean | undefined;
            readonly bordered?: number | boolean | undefined;
            readonly transparent?: boolean | undefined;
            readonly chromeless?: boolean | "all" | undefined;
        }, "size" | "unstyled"> & {
            readonly unstyled?: boolean | undefined;
            readonly size?: import("@tamagui/web").SizeTokens | undefined;
        }>> & import("@tamagui/web").PseudoProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
            readonly fullscreen?: boolean | undefined;
            readonly elevation?: import("@tamagui/web").SizeTokens | undefined;
        } & {
            readonly backgrounded?: boolean | undefined;
            readonly radiused?: boolean | undefined;
            readonly hoverTheme?: boolean | undefined;
            readonly pressTheme?: boolean | undefined;
            readonly focusTheme?: boolean | undefined;
            readonly circular?: boolean | undefined;
            readonly padded?: boolean | undefined;
            readonly elevate?: boolean | undefined;
            readonly bordered?: number | boolean | undefined;
            readonly transparent?: boolean | undefined;
            readonly chromeless?: boolean | "all" | undefined;
        }, "size" | "unstyled"> & {
            readonly unstyled?: boolean | undefined;
            readonly size?: import("@tamagui/web").SizeTokens | undefined;
        }>> & {
            value: string;
            id?: string | undefined;
            labelledBy?: string | undefined;
            disabled?: boolean | undefined;
        } & import("react").RefAttributes<HTMLButtonElement>>;
        Indicator: import("react").ForwardRefExoticComponent<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
            readonly fullscreen?: boolean | undefined;
            readonly elevation?: import("@tamagui/web").SizeTokens | undefined;
        } & {
            readonly backgrounded?: boolean | undefined;
            readonly radiused?: boolean | undefined;
            readonly hoverTheme?: boolean | undefined;
            readonly pressTheme?: boolean | undefined;
            readonly focusTheme?: boolean | undefined;
            readonly circular?: boolean | undefined;
            readonly padded?: boolean | undefined;
            readonly elevate?: boolean | undefined;
            readonly bordered?: number | boolean | undefined;
            readonly transparent?: boolean | undefined;
            readonly chromeless?: boolean | "all" | undefined;
        }, "unstyled"> & {
            readonly unstyled?: boolean | undefined;
        } & import("@tamagui/web").MediaProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
            readonly fullscreen?: boolean | undefined;
            readonly elevation?: import("@tamagui/web").SizeTokens | undefined;
        } & {
            readonly backgrounded?: boolean | undefined;
            readonly radiused?: boolean | undefined;
            readonly hoverTheme?: boolean | undefined;
            readonly pressTheme?: boolean | undefined;
            readonly focusTheme?: boolean | undefined;
            readonly circular?: boolean | undefined;
            readonly padded?: boolean | undefined;
            readonly elevate?: boolean | undefined;
            readonly bordered?: number | boolean | undefined;
            readonly transparent?: boolean | undefined;
            readonly chromeless?: boolean | "all" | undefined;
        }, "unstyled"> & {
            readonly unstyled?: boolean | undefined;
        }>> & import("@tamagui/web").PseudoProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
            readonly fullscreen?: boolean | undefined;
            readonly elevation?: import("@tamagui/web").SizeTokens | undefined;
        } & {
            readonly backgrounded?: boolean | undefined;
            readonly radiused?: boolean | undefined;
            readonly hoverTheme?: boolean | undefined;
            readonly pressTheme?: boolean | undefined;
            readonly focusTheme?: boolean | undefined;
            readonly circular?: boolean | undefined;
            readonly padded?: boolean | undefined;
            readonly elevate?: boolean | undefined;
            readonly bordered?: number | boolean | undefined;
            readonly transparent?: boolean | undefined;
            readonly chromeless?: boolean | "all" | undefined;
        }, "unstyled"> & {
            readonly unstyled?: boolean | undefined;
        }>> & {
            forceMount?: boolean | undefined;
            unstyled?: boolean | undefined;
        } & import("react").RefAttributes<HTMLElement | import("react-native").View>>;
    };
    Select: import("react").ForwardRefExoticComponent<import("tamagui").SelectProps & {
        __scopeSelect?: import("tamagui").Scope<any>;
    } & Omit<import("react-hook-form").ControllerProps<FieldValues, string>, "render" | "control"> & import("react").RefAttributes<unknown>> & {
        Trigger: import("react").ForwardRefExoticComponent<Omit<import("tamagui").TextParentStyles, "TextComponent" | "noTextWrap"> & Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
            readonly fullscreen?: boolean | undefined;
            readonly elevation?: import("@tamagui/web").SizeTokens | undefined;
        } & {
            readonly backgrounded?: boolean | undefined;
            readonly radiused?: boolean | undefined;
            readonly hoverTheme?: boolean | undefined;
            readonly pressTheme?: boolean | undefined;
            readonly focusTheme?: boolean | undefined;
            readonly circular?: boolean | undefined;
            readonly padded?: boolean | undefined;
            readonly elevate?: boolean | undefined;
            readonly bordered?: number | boolean | undefined;
            readonly transparent?: boolean | undefined;
            readonly chromeless?: boolean | "all" | undefined;
        }, "disabled" | "size" | "unstyled" | "active"> & {
            readonly unstyled?: boolean | undefined;
            readonly size?: import("@tamagui/web").SizeTokens | undefined;
            readonly active?: boolean | undefined;
            readonly disabled?: boolean | undefined;
        } & import("@tamagui/web").MediaProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
            readonly fullscreen?: boolean | undefined;
            readonly elevation?: import("@tamagui/web").SizeTokens | undefined;
        } & {
            readonly backgrounded?: boolean | undefined;
            readonly radiused?: boolean | undefined;
            readonly hoverTheme?: boolean | undefined;
            readonly pressTheme?: boolean | undefined;
            readonly focusTheme?: boolean | undefined;
            readonly circular?: boolean | undefined;
            readonly padded?: boolean | undefined;
            readonly elevate?: boolean | undefined;
            readonly bordered?: number | boolean | undefined;
            readonly transparent?: boolean | undefined;
            readonly chromeless?: boolean | "all" | undefined;
        }, "disabled" | "size" | "unstyled" | "active"> & {
            readonly unstyled?: boolean | undefined;
            readonly size?: import("@tamagui/web").SizeTokens | undefined;
            readonly active?: boolean | undefined;
            readonly disabled?: boolean | undefined;
        }>> & import("@tamagui/web").PseudoProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
            readonly fullscreen?: boolean | undefined;
            readonly elevation?: import("@tamagui/web").SizeTokens | undefined;
        } & {
            readonly backgrounded?: boolean | undefined;
            readonly radiused?: boolean | undefined;
            readonly hoverTheme?: boolean | undefined;
            readonly pressTheme?: boolean | undefined;
            readonly focusTheme?: boolean | undefined;
            readonly circular?: boolean | undefined;
            readonly padded?: boolean | undefined;
            readonly elevate?: boolean | undefined;
            readonly bordered?: number | boolean | undefined;
            readonly transparent?: boolean | undefined;
            readonly chromeless?: boolean | "all" | undefined;
        }, "disabled" | "size" | "unstyled" | "active"> & {
            readonly unstyled?: boolean | undefined;
            readonly size?: import("@tamagui/web").SizeTokens | undefined;
            readonly active?: boolean | undefined;
            readonly disabled?: boolean | undefined;
        }>> & import("@tamagui/web").ThemeableProps & {
            icon?: JSX.Element | import("react").FunctionComponent<{
                color?: string | undefined;
                size?: number | undefined;
            }> | null | undefined;
            iconAfter?: JSX.Element | import("react").FunctionComponent<{
                color?: string | undefined;
                size?: number | undefined;
            }> | null | undefined;
            scaleIcon?: number | undefined;
            spaceFlex?: number | boolean | undefined;
            scaleSpace?: number | undefined;
            title?: import("react").ReactNode;
            subTitle?: import("react").ReactNode;
            noTextWrap?: boolean | "all" | undefined;
        } & import("react").RefAttributes<import("@tamagui/web").TamaguiElement>>;
        Value: import("react").ForwardRefExoticComponent<((Omit<import("react-native").TextProps, "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendsBaseTextProps & import("@tamagui/web").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & Omit<{}, "size"> & {
            readonly size?: import("@tamagui/web").FontSizeTokens | undefined;
        } & import("@tamagui/web").MediaProps<Partial<Omit<import("react-native").TextProps, "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendsBaseTextProps & import("@tamagui/web").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & Omit<{}, "size"> & {
            readonly size?: import("@tamagui/web").FontSizeTokens | undefined;
        }>> & import("@tamagui/web").PseudoProps<Partial<Omit<import("react-native").TextProps, "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendsBaseTextProps & import("@tamagui/web").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & Omit<{}, "size"> & {
            readonly size?: import("@tamagui/web").FontSizeTokens | undefined;
        }>> & {
            placeholder?: import("react").ReactNode;
        }) | Omit<Omit<import("react-native").TextProps, "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendsBaseTextProps & import("@tamagui/web").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & Omit<{
            readonly size?: import("@tamagui/web").FontSizeTokens | undefined;
        }, string | number> & {
            [x: string]: undefined;
        } & import("@tamagui/web").MediaProps<Partial<Omit<import("react-native").TextProps, "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendsBaseTextProps & import("@tamagui/web").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & Omit<{
            readonly size?: import("@tamagui/web").FontSizeTokens | undefined;
        }, string | number> & {
            [x: string]: undefined;
        }>> & import("@tamagui/web").PseudoProps<Partial<Omit<import("react-native").TextProps, "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendsBaseTextProps & import("@tamagui/web").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & Omit<{
            readonly size?: import("@tamagui/web").FontSizeTokens | undefined;
        }, string | number> & {
            [x: string]: undefined;
        }>> & {
            placeholder?: import("react").ReactNode;
        }, "ref"> | Omit<Omit<import("react-native").TextProps, "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendsBaseTextProps & import("@tamagui/web").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & Omit<{
            readonly size?: import("@tamagui/web").FontSizeTokens | undefined;
        } | ({
            readonly size?: import("@tamagui/web").FontSizeTokens | undefined;
        } & {
            [x: string]: undefined;
        }), string | number> & {
            [x: string]: undefined;
        } & import("@tamagui/web").MediaProps<Partial<Omit<import("react-native").TextProps, "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendsBaseTextProps & import("@tamagui/web").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & Omit<{
            readonly size?: import("@tamagui/web").FontSizeTokens | undefined;
        } | ({
            readonly size?: import("@tamagui/web").FontSizeTokens | undefined;
        } & {
            [x: string]: undefined;
        }), string | number> & {
            [x: string]: undefined;
        }>> & import("@tamagui/web").PseudoProps<Partial<Omit<import("react-native").TextProps, "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendsBaseTextProps & import("@tamagui/web").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & Omit<{
            readonly size?: import("@tamagui/web").FontSizeTokens | undefined;
        } | ({
            readonly size?: import("@tamagui/web").FontSizeTokens | undefined;
        } & {
            [x: string]: undefined;
        }), string | number> & {
            [x: string]: undefined;
        }>> & {
            placeholder?: import("react").ReactNode;
        }, "ref"> | Omit<Omit<import("react-native").TextProps, "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendsBaseTextProps & import("@tamagui/web").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & Omit<{
            readonly size?: import("@tamagui/web").FontSizeTokens | undefined;
        } | ({
            readonly size?: import("@tamagui/web").FontSizeTokens | undefined;
        } & {
            [x: string]: undefined;
        }), string | number> & {
            [x: string]: undefined;
        } & import("@tamagui/web").MediaProps<Partial<Omit<import("react-native").TextProps, "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendsBaseTextProps & import("@tamagui/web").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & Omit<{
            readonly size?: import("@tamagui/web").FontSizeTokens | undefined;
        } | ({
            readonly size?: import("@tamagui/web").FontSizeTokens | undefined;
        } & {
            [x: string]: undefined;
        }), string | number> & {
            [x: string]: undefined;
        }>> & import("@tamagui/web").PseudoProps<Partial<Omit<import("react-native").TextProps, "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendsBaseTextProps & import("@tamagui/web").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & Omit<{
            readonly size?: import("@tamagui/web").FontSizeTokens | undefined;
        } | ({
            readonly size?: import("@tamagui/web").FontSizeTokens | undefined;
        } & {
            [x: string]: undefined;
        }), string | number> & {
            [x: string]: undefined;
        }>> & {
            placeholder?: import("react").ReactNode;
        }, "ref">) & import("react").RefAttributes<import("@tamagui/web").TamaguiElement>>;
        Content: ({ children, __scopeSelect, zIndex, ...focusScopeProps }: {
            children?: import("react").ReactNode;
            zIndex?: number | undefined;
        } & {
            __scopeSelect?: import("tamagui").Scope<any>;
        } & import("@tamagui/focus-scope").FocusScopeProps) => JSX.Element | null;
        Viewport: import("react").ForwardRefExoticComponent<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
            readonly fullscreen?: boolean | undefined;
            readonly elevation?: import("@tamagui/web").SizeTokens | undefined;
        }, "transparent" | "hoverTheme" | "pressTheme" | "focusTheme" | "elevate" | "bordered" | "circular" | "backgrounded" | "radiused" | "padded" | "chromeless"> & {
            readonly backgrounded?: boolean | undefined;
            readonly radiused?: boolean | undefined;
            readonly hoverTheme?: boolean | undefined;
            readonly pressTheme?: boolean | undefined;
            readonly focusTheme?: boolean | undefined;
            readonly circular?: boolean | undefined;
            readonly padded?: boolean | undefined;
            readonly elevate?: boolean | undefined;
            readonly bordered?: number | boolean | undefined;
            readonly transparent?: boolean | undefined;
            readonly chromeless?: boolean | "all" | undefined;
        } & import("@tamagui/web").MediaProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
            readonly fullscreen?: boolean | undefined;
            readonly elevation?: import("@tamagui/web").SizeTokens | undefined;
        }, "transparent" | "hoverTheme" | "pressTheme" | "focusTheme" | "elevate" | "bordered" | "circular" | "backgrounded" | "radiused" | "padded" | "chromeless"> & {
            readonly backgrounded?: boolean | undefined;
            readonly radiused?: boolean | undefined;
            readonly hoverTheme?: boolean | undefined;
            readonly pressTheme?: boolean | undefined;
            readonly focusTheme?: boolean | undefined;
            readonly circular?: boolean | undefined;
            readonly padded?: boolean | undefined;
            readonly elevate?: boolean | undefined;
            readonly bordered?: number | boolean | undefined;
            readonly transparent?: boolean | undefined;
            readonly chromeless?: boolean | "all" | undefined;
        }>> & import("@tamagui/web").PseudoProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
            readonly fullscreen?: boolean | undefined;
            readonly elevation?: import("@tamagui/web").SizeTokens | undefined;
        }, "transparent" | "hoverTheme" | "pressTheme" | "focusTheme" | "elevate" | "bordered" | "circular" | "backgrounded" | "radiused" | "padded" | "chromeless"> & {
            readonly backgrounded?: boolean | undefined;
            readonly radiused?: boolean | undefined;
            readonly hoverTheme?: boolean | undefined;
            readonly pressTheme?: boolean | undefined;
            readonly focusTheme?: boolean | undefined;
            readonly circular?: boolean | undefined;
            readonly padded?: boolean | undefined;
            readonly elevate?: boolean | undefined;
            readonly bordered?: number | boolean | undefined;
            readonly transparent?: boolean | undefined;
            readonly chromeless?: boolean | "all" | undefined;
        }>> & {
            size?: import("@tamagui/web").SizeTokens | undefined;
            disableScroll?: boolean | undefined;
        } & import("react").RefAttributes<import("@tamagui/web").TamaguiElement>>;
        Group: import("react").ForwardRefExoticComponent<((Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{}, "elevation" | "fullscreen"> & {
            readonly fullscreen?: boolean | undefined;
            readonly elevation?: import("@tamagui/web").SizeTokens | undefined;
        } & import("@tamagui/web").MediaProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{}, "elevation" | "fullscreen"> & {
            readonly fullscreen?: boolean | undefined;
            readonly elevation?: import("@tamagui/web").SizeTokens | undefined;
        }>> & import("@tamagui/web").PseudoProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{}, "elevation" | "fullscreen"> & {
            readonly fullscreen?: boolean | undefined;
            readonly elevation?: import("@tamagui/web").SizeTokens | undefined;
        }>>) | Omit<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
            readonly fullscreen?: boolean | undefined;
            readonly elevation?: import("@tamagui/web").SizeTokens | undefined;
        }, string | number> & {
            [x: string]: undefined;
        } & import("@tamagui/web").MediaProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
            readonly fullscreen?: boolean | undefined;
            readonly elevation?: import("@tamagui/web").SizeTokens | undefined;
        }, string | number> & {
            [x: string]: undefined;
        }>> & import("@tamagui/web").PseudoProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
            readonly fullscreen?: boolean | undefined;
            readonly elevation?: import("@tamagui/web").SizeTokens | undefined;
        }, string | number> & {
            [x: string]: undefined;
        }>>, "ref">) & import("react").RefAttributes<import("@tamagui/web").TamaguiElement>>;
        Item: import("react").ForwardRefExoticComponent<import("tamagui").SelectItemProps & import("react").RefAttributes<import("@tamagui/web").TamaguiElement>>;
        ItemText: import("react").ForwardRefExoticComponent<((Omit<import("react-native").TextProps, "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendsBaseTextProps & import("@tamagui/web").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & Omit<{}, "size"> & {
            readonly size?: import("@tamagui/web").FontSizeTokens | undefined;
        } & import("@tamagui/web").MediaProps<Partial<Omit<import("react-native").TextProps, "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendsBaseTextProps & import("@tamagui/web").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & Omit<{}, "size"> & {
            readonly size?: import("@tamagui/web").FontSizeTokens | undefined;
        }>> & import("@tamagui/web").PseudoProps<Partial<Omit<import("react-native").TextProps, "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendsBaseTextProps & import("@tamagui/web").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & Omit<{}, "size"> & {
            readonly size?: import("@tamagui/web").FontSizeTokens | undefined;
        }>>) | Omit<Omit<import("react-native").TextProps, "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendsBaseTextProps & import("@tamagui/web").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & Omit<{
            readonly size?: import("@tamagui/web").FontSizeTokens | undefined;
        }, string | number> & {
            [x: string]: undefined;
        } & import("@tamagui/web").MediaProps<Partial<Omit<import("react-native").TextProps, "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendsBaseTextProps & import("@tamagui/web").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & Omit<{
            readonly size?: import("@tamagui/web").FontSizeTokens | undefined;
        }, string | number> & {
            [x: string]: undefined;
        }>> & import("@tamagui/web").PseudoProps<Partial<Omit<import("react-native").TextProps, "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendsBaseTextProps & import("@tamagui/web").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & Omit<{
            readonly size?: import("@tamagui/web").FontSizeTokens | undefined;
        }, string | number> & {
            [x: string]: undefined;
        }>>, "ref">) & import("react").RefAttributes<import("@tamagui/web").TamaguiElement>>;
        ItemIndicator: import("react").ForwardRefExoticComponent<((Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{}, "elevation" | "fullscreen"> & {
            readonly fullscreen?: boolean | undefined;
            readonly elevation?: import("@tamagui/web").SizeTokens | undefined;
        } & import("@tamagui/web").MediaProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{}, "elevation" | "fullscreen"> & {
            readonly fullscreen?: boolean | undefined;
            readonly elevation?: import("@tamagui/web").SizeTokens | undefined;
        }>> & import("@tamagui/web").PseudoProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{}, "elevation" | "fullscreen"> & {
            readonly fullscreen?: boolean | undefined;
            readonly elevation?: import("@tamagui/web").SizeTokens | undefined;
        }>>) | Omit<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
            readonly fullscreen?: boolean | undefined;
            readonly elevation?: import("@tamagui/web").SizeTokens | undefined;
        }, string | number> & {
            [x: string]: undefined;
        } & import("@tamagui/web").MediaProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
            readonly fullscreen?: boolean | undefined;
            readonly elevation?: import("@tamagui/web").SizeTokens | undefined;
        }, string | number> & {
            [x: string]: undefined;
        }>> & import("@tamagui/web").PseudoProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
            readonly fullscreen?: boolean | undefined;
            readonly elevation?: import("@tamagui/web").SizeTokens | undefined;
        }, string | number> & {
            [x: string]: undefined;
        }>>, "ref">) & import("react").RefAttributes<import("@tamagui/web").TamaguiElement>>;
    };
    Slider: import("react").ForwardRefExoticComponent<Omit<import("tamagui").SliderProps & import("react").RefAttributes<import("react-native").View> & Omit<import("react-hook-form").ControllerProps<FieldValues, string>, "render" | "control">, "ref"> & import("react").RefAttributes<unknown>> & {
        Track: import("react").ForwardRefExoticComponent<import("tamagui").SliderTrackProps & import("react").RefAttributes<HTMLElement | import("react-native").View>>;
        TrackActive: import("react").ForwardRefExoticComponent<((Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
            readonly fullscreen?: boolean | undefined;
            readonly elevation?: import("@tamagui/web").SizeTokens | undefined;
        } & {
            readonly orientation?: "vertical" | "horizontal" | undefined;
        }, "size"> & {
            readonly size?: any;
        } & import("@tamagui/web").MediaProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
            readonly fullscreen?: boolean | undefined;
            readonly elevation?: import("@tamagui/web").SizeTokens | undefined;
        } & {
            readonly orientation?: "vertical" | "horizontal" | undefined;
        }, "size"> & {
            readonly size?: any;
        }>> & import("@tamagui/web").PseudoProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
            readonly fullscreen?: boolean | undefined;
            readonly elevation?: import("@tamagui/web").SizeTokens | undefined;
        } & {
            readonly orientation?: "vertical" | "horizontal" | undefined;
        }, "size"> & {
            readonly size?: any;
        }>>) | Omit<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
            readonly fullscreen?: boolean | undefined;
            readonly elevation?: import("@tamagui/web").SizeTokens | undefined;
        } & {
            readonly orientation?: "vertical" | "horizontal" | undefined;
        } & {
            readonly size?: any;
        }, string | number> & {
            [x: string]: undefined;
        } & import("@tamagui/web").MediaProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
            readonly fullscreen?: boolean | undefined;
            readonly elevation?: import("@tamagui/web").SizeTokens | undefined;
        } & {
            readonly orientation?: "vertical" | "horizontal" | undefined;
        } & {
            readonly size?: any;
        }, string | number> & {
            [x: string]: undefined;
        }>> & import("@tamagui/web").PseudoProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
            readonly fullscreen?: boolean | undefined;
            readonly elevation?: import("@tamagui/web").SizeTokens | undefined;
        } & {
            readonly orientation?: "vertical" | "horizontal" | undefined;
        } & {
            readonly size?: any;
        }, string | number> & {
            [x: string]: undefined;
        }>>, "ref">) & import("react").RefAttributes<import("react-native").View>>;
        Thumb: import("react").ForwardRefExoticComponent<import("@tamagui/slider/types/Slider").SliderThumbProps & import("react").RefAttributes<import("react-native").View>>;
    };
    Switch: import("react").ForwardRefExoticComponent<Omit<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: import("@tamagui/web").SizeTokens | undefined;
    }, "size" | "unstyled"> & {
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/web").SizeTokens | undefined;
    } & import("@tamagui/web").MediaProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: import("@tamagui/web").SizeTokens | undefined;
    }, "size" | "unstyled"> & {
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/web").SizeTokens | undefined;
    }>> & import("@tamagui/web").PseudoProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: import("@tamagui/web").SizeTokens | undefined;
    }, "size" | "unstyled"> & {
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/web").SizeTokens | undefined;
    }>> & {
        labeledBy?: string | undefined;
        name?: string | undefined;
        value?: string | undefined;
        checked?: boolean | undefined;
        defaultChecked?: boolean | undefined;
        required?: boolean | undefined;
        onCheckedChange?(checked: boolean): void;
    } & import("react").RefAttributes<HTMLButtonElement | import("react-native").View> & Omit<import("react-hook-form").ControllerProps<FieldValues, string>, "render" | "control">, "ref"> & import("react").RefAttributes<unknown>> & {
        Thumb: import("react").ForwardRefExoticComponent<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
            readonly fullscreen?: boolean | undefined;
            readonly elevation?: import("@tamagui/web").SizeTokens | undefined;
        } & {
            readonly backgrounded?: boolean | undefined;
            readonly radiused?: boolean | undefined;
            readonly hoverTheme?: boolean | undefined;
            readonly pressTheme?: boolean | undefined;
            readonly focusTheme?: boolean | undefined;
            readonly circular?: boolean | undefined;
            readonly padded?: boolean | undefined;
            readonly elevate?: boolean | undefined;
            readonly bordered?: number | boolean | undefined;
            readonly transparent?: boolean | undefined;
            readonly chromeless?: boolean | "all" | undefined;
        }, "size" | "unstyled"> & {
            readonly unstyled?: boolean | undefined;
            readonly size?: import("@tamagui/web").SizeTokens | undefined;
        } & import("@tamagui/web").MediaProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
            readonly fullscreen?: boolean | undefined;
            readonly elevation?: import("@tamagui/web").SizeTokens | undefined;
        } & {
            readonly backgrounded?: boolean | undefined;
            readonly radiused?: boolean | undefined;
            readonly hoverTheme?: boolean | undefined;
            readonly pressTheme?: boolean | undefined;
            readonly focusTheme?: boolean | undefined;
            readonly circular?: boolean | undefined;
            readonly padded?: boolean | undefined;
            readonly elevate?: boolean | undefined;
            readonly bordered?: number | boolean | undefined;
            readonly transparent?: boolean | undefined;
            readonly chromeless?: boolean | "all" | undefined;
        }, "size" | "unstyled"> & {
            readonly unstyled?: boolean | undefined;
            readonly size?: import("@tamagui/web").SizeTokens | undefined;
        }>> & import("@tamagui/web").PseudoProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
            readonly fullscreen?: boolean | undefined;
            readonly elevation?: import("@tamagui/web").SizeTokens | undefined;
        } & {
            readonly backgrounded?: boolean | undefined;
            readonly radiused?: boolean | undefined;
            readonly hoverTheme?: boolean | undefined;
            readonly pressTheme?: boolean | undefined;
            readonly focusTheme?: boolean | undefined;
            readonly circular?: boolean | undefined;
            readonly padded?: boolean | undefined;
            readonly elevate?: boolean | undefined;
            readonly bordered?: number | boolean | undefined;
            readonly transparent?: boolean | undefined;
            readonly chromeless?: boolean | "all" | undefined;
        }, "size" | "unstyled"> & {
            readonly unstyled?: boolean | undefined;
            readonly size?: import("@tamagui/web").SizeTokens | undefined;
        }>> & import("react").RefAttributes<HTMLSpanElement>>;
    };
    TextArea: import("react").ForwardRefExoticComponent<Omit<import("react-native").TextInputProps & Omit<import("@tamagui/web").TextProps, keyof import("react-native").TextInputProps> & Omit<{
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/web").SizeTokens | undefined;
    }, "size" | "unstyled"> & {
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/web").SizeTokens | undefined;
    } & import("@tamagui/web").MediaProps<Partial<import("react-native").TextInputProps & Omit<import("@tamagui/web").TextProps, keyof import("react-native").TextInputProps> & Omit<{
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/web").SizeTokens | undefined;
    }, "size" | "unstyled"> & {
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/web").SizeTokens | undefined;
    }>> & import("@tamagui/web").PseudoProps<Partial<import("react-native").TextInputProps & Omit<import("@tamagui/web").TextProps, keyof import("react-native").TextInputProps> & Omit<{
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/web").SizeTokens | undefined;
    }, "size" | "unstyled"> & {
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/web").SizeTokens | undefined;
    }>> & import("react").RefAttributes<import("@tamagui/web").TamaguiElement> & Omit<import("react-hook-form").ControllerProps<FieldValues, string>, "render" | "control">, "ref"> & import("react").RefAttributes<unknown>>;
    Trigger: import("react").ForwardRefExoticComponent<import("@tamagui/form").FormTriggerProps & import("react").RefAttributes<import("@tamagui/web").TamaguiElement>>;
    Message: ({ name, ...props }: Omit<import("react-native").TextProps, "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/web").ExtendsBaseTextProps & import("@tamagui/web").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & import("@tamagui/web").PseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>>> & import("@tamagui/web").MediaProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & import("@tamagui/web").PseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>>>> & {
        name: string;
    }) => JSX.Element | null;
};
//# sourceMappingURL=Form.d.ts.map
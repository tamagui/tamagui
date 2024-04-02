import React from 'react';
import type { TextInputProps } from 'react-native';
export declare const Input: React.ForwardRefExoticComponent<Omit<React.InputHTMLAttributes<HTMLInputElement>, "style" | "className" | "children" | "value"> & React.CSSProperties & {
    value?: string | undefined;
} & Omit<TextInputProps, "enterKeyHint" | "inputMode" | "secureTextEntry" | "onChangeText" | "editable" | "keyboardType" | "placeholderTextColor" | "selectionColor"> & {
    secureTextEntry?: boolean | undefined;
    onChangeText?: ((e: import("react-native").NativeSyntheticEvent<import("react-native").TextInputChangeEventData>) => void) | undefined;
    editable?: boolean | undefined;
    enterKeyHint?: "done" | "go" | "next" | "search" | "send" | "enter" | "previous" | undefined;
    keyboardType?: import("react-native").KeyboardTypeOptions | undefined;
    inputMode?: import("react-native").InputModeOptions | undefined;
    placeholderTextColor?: import("@tamagui/core").ColorTokens | undefined;
    selectionColor?: import("@tamagui/core").ColorTokens | undefined;
} & React.RefAttributes<HTMLInputElement>>;
//# sourceMappingURL=Input.native.d.ts.map
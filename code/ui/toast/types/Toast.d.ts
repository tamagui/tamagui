import type { GetProps, NativePlatform, NativeValue, TamaguiElement } from '@tamagui/core';
import * as React from 'react';
import type { CustomData } from './ToastImperative';
import { useToast, useToastController, useToastState } from './ToastImperative';
import type { ToastExtraProps, ToastProps } from './ToastImpl';
import type { ScopedProps, ToastProviderProps } from './ToastProvider';
import { ToastProvider } from './ToastProvider';
import type { ToastViewportProps } from './ToastViewport';
import { ToastViewport } from './ToastViewport';
declare const ToastTitle: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiTextElement, import("@tamagui/core").TextNonStyleProps, import("@tamagui/core").TextStylePropsBase, {
    unstyled?: boolean | undefined;
    size?: import("@tamagui/core").FontSizeTokens | undefined;
}, import("@tamagui/core").StaticConfigPublic>;
type ToastTitleProps = GetProps<typeof ToastTitle>;
declare const ToastDescription: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiTextElement, import("@tamagui/core").TextNonStyleProps, import("@tamagui/core").TextStylePropsBase, {
    unstyled?: boolean | undefined;
    size?: import("@tamagui/core").FontSizeTokens | undefined;
}, import("@tamagui/core").StaticConfigPublic>;
type ToastDescriptionProps = GetProps<typeof ToastDescription>;
type ToastActionProps = ScopedProps<ToastCloseProps & {
    /**
     * A short description for an alternate way to carry out the action. For screen reader users
     * who will not be able to navigate to the button easily/quickly.
     * @example <ToastAction altText="Goto account settings to updgrade">Upgrade</ToastAction>
     * @example <ToastAction altText="Undo (Alt+U)">Undo</ToastAction>
     */
    altText: string;
}>;
declare const ToastCloseFrame: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    elevation?: number | import("@tamagui/core").SizeTokens | undefined;
}, import("@tamagui/core").StaticConfigPublic>;
type ToastCloseFrameProps = GetProps<typeof ToastCloseFrame>;
type ToastCloseProps = ScopedProps<ToastCloseFrameProps & {}>;
declare const Toast: React.FunctionComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    unstyled?: boolean | undefined;
    elevation?: number | import("@tamagui/core").SizeTokens | undefined;
}>, keyof ToastExtraProps> & ToastExtraProps & {
    ref?: React.Ref<TamaguiElement> | undefined;
}> & import("@tamagui/core").StaticComponentObject<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    unstyled?: boolean | undefined;
    elevation?: number | import("@tamagui/core").SizeTokens | undefined;
}>, keyof ToastExtraProps> & ToastExtraProps, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & ToastExtraProps, import("@tamagui/core").StackStyleBase, {
    unstyled?: boolean | undefined;
    elevation?: number | import("@tamagui/core").SizeTokens | undefined;
}, import("@tamagui/core").StaticConfigPublic> & Omit<import("@tamagui/core").StaticConfigPublic, "staticConfig"> & {
    __tama: [Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
        unstyled?: boolean | undefined;
        elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    }>, keyof ToastExtraProps> & ToastExtraProps, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & ToastExtraProps, import("@tamagui/core").StackStyleBase, {
        unstyled?: boolean | undefined;
        elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    }, import("@tamagui/core").StaticConfigPublic];
} & {
    Title: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiTextElement, import("@tamagui/core").TextNonStyleProps, import("@tamagui/core").TextStylePropsBase, {
        unstyled?: boolean | undefined;
        size?: import("@tamagui/core").FontSizeTokens | undefined;
    }, import("@tamagui/core").StaticConfigPublic>;
    Description: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiTextElement, import("@tamagui/core").TextNonStyleProps, import("@tamagui/core").TextStylePropsBase, {
        unstyled?: boolean | undefined;
        size?: import("@tamagui/core").FontSizeTokens | undefined;
    }, import("@tamagui/core").StaticConfigPublic>;
    Action: import("@tamagui/core").RefComponent<TamaguiElement, ScopedProps<ToastActionProps>>;
    Close: import("@tamagui/core").RefComponent<TamaguiElement, ToastCloseProps>;
};
export { Toast, ToastProvider, ToastViewport, useToast, useToastController, useToastState, };
export type { CustomData, ToastActionProps, ToastCloseProps, ToastDescriptionProps, NativePlatform as ToastNativePlatform, NativeValue as ToastNativeValue, ToastProps, ToastProviderProps, ToastTitleProps, ToastViewportProps, };
//# sourceMappingURL=Toast.d.ts.map
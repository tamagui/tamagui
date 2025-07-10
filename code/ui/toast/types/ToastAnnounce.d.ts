import type { GetProps, TamaguiElement } from '@tamagui/core';
import { VisuallyHidden } from '@tamagui/visually-hidden';
import * as React from 'react';
import type { ScopedProps } from './ToastProvider';
declare const ToastAnnounceExcludeFrame: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {}, import("@tamagui/core").StaticConfigPublic>;
type ToastAnnounceExcludeFrameProps = GetProps<typeof ToastAnnounceExcludeFrame>;
type ToastAnnounceExcludeExtraProps = {
    altText?: string;
};
type ToastAnnounceExcludeProps = ToastAnnounceExcludeFrameProps & ToastAnnounceExcludeExtraProps;
declare const ToastAnnounceExclude: React.ForwardRefExoticComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, keyof import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {}>> & ToastAnnounceExcludeExtraProps & React.RefAttributes<TamaguiElement>>;
interface ToastAnnounceProps extends Omit<GetProps<typeof VisuallyHidden>, 'children'>, ScopedProps<{
    children: string[];
}> {
}
declare const ToastAnnounce: React.FC<ToastAnnounceProps>;
export { ToastAnnounce, ToastAnnounceExclude, type ToastAnnounceExcludeProps, type ToastAnnounceProps, };
//# sourceMappingURL=ToastAnnounce.d.ts.map
import { GetProps, TamaguiElement } from '@tamagui/core';
import { VisuallyHidden } from '@tamagui/visually-hidden';
import * as React from 'react';
import { ScopedProps } from './ToastProvider';
declare const ToastAnnounceExcludeFrame: import("@tamagui/core").TamaguiComponent<{
    __tamaDefer: true;
}, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStylePropsBase, void, {}>;
type ToastAnnounceExcludeFrameProps = GetProps<typeof ToastAnnounceExcludeFrame>;
type ToastAnnounceExcludeProps = ToastAnnounceExcludeFrameProps & {
    altText?: string;
};
declare const ToastAnnounceExclude: React.ForwardRefExoticComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, keyof import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase & void> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase & void>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase & void> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase & void>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStylePropsBase & void>> & {
    altText?: string | undefined;
} & {
    __scopeToast?: string | undefined;
} & React.RefAttributes<TamaguiElement>>;
interface ToastAnnounceProps extends Omit<GetProps<typeof VisuallyHidden>, 'children'>, ScopedProps<{
    children: string[];
}> {
}
declare const ToastAnnounce: React.FC<ScopedProps<ToastAnnounceProps>>;
export { ToastAnnounce, ToastAnnounceProps, ToastAnnounceExclude, ToastAnnounceExcludeProps, };
//# sourceMappingURL=ToastAnnounce.d.ts.map
import type { GetProps, TamaguiElement } from '@tamagui/core';
import * as React from 'react';
declare const VIEWPORT_DEFAULT_HOTKEY: string[];
declare const VIEWPORT_PAUSE = "toast.viewportPause";
declare const VIEWPORT_RESUME = "toast.viewportResume";
declare const ToastViewportFrame: React.FunctionComponent<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase | (import("@tamagui/core").StackStyleBase & {
    [x: string]: `$${string}` | `$${number}` | undefined;
}), {
    unstyled?: boolean | undefined;
    elevation?: number | import("@tamagui/core").Size | undefined;
}> & {
    ref?: React.Ref<TamaguiElement> | undefined;
}> & import("@tamagui/core").StaticComponentObject<import("@tamagui/core").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase | (import("@tamagui/core").StackStyleBase & {
    [x: string]: `$${string}` | `$${number}` | undefined;
}), {
    unstyled?: boolean | undefined;
    elevation?: number | import("@tamagui/core").Size | undefined;
}, import("@tamagui/core").StaticConfigPublic> & Omit<import("@tamagui/core").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/core").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase | (import("@tamagui/core").StackStyleBase & {
        [x: string]: `$${string}` | `$${number}` | undefined;
    }), {
        unstyled?: boolean | undefined;
        elevation?: number | import("@tamagui/core").Size | undefined;
    }, import("@tamagui/core").StaticConfigPublic];
};
type ToastViewportFrameProps = GetProps<typeof ToastViewportFrame>;
type ToastViewportProps = ToastViewportFrameProps & {
    /**
     * The keys to use as the keyboard shortcut that will move focus to the toast viewport.
     * @defaultValue ['F8']
     */
    hotkey?: string[];
    /**
     * An author-localized label for the toast viewport to provide context for screen reader users
     * when navigating page landmarks. The available `{hotkey}` placeholder will be replaced for you.
     * @defaultValue 'Notifications ({hotkey})'
     */
    label?: string;
    /**
     * Used to reference the viewport if you want to have multiple viewports in the same provider.
     */
    name?: string;
    /**
     * Pass this when you want to have multiple/duplicated toasts.
     */
    multipleToasts?: boolean;
    /**
     * When true, uses a portal to render at the very top of the root TamaguiProvider.
     */
    portalToRoot?: boolean;
};
declare const ToastViewport: React.NamedExoticComponent<ToastViewportProps & import("@tamagui/core").RefProp<HTMLDivElement>>;
export { ToastViewport, VIEWPORT_DEFAULT_HOTKEY, VIEWPORT_PAUSE, VIEWPORT_RESUME, type ToastViewportProps, };
//# sourceMappingURL=ToastViewport.d.ts.map
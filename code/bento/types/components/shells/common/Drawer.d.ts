import type { Dispatch, SetStateAction } from 'react';
import React from 'react';
import type { TamaguiElement } from 'tamagui';
export declare const DrawerContext: import("@tamagui/web").StyledContext<{
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}>;
type DrawerProps = {
    open: boolean;
    onOpenChange?: (open: boolean) => void;
    /**
     * When true, uses a portal to render at the very top of the root TamaguiProvider.
     */
    portalToRoot?: boolean;
};
export declare const Drawer: (({ open, onOpenChange, children, portalToRoot, ...rest }: DrawerProps & {
    children?: React.ReactNode;
}) => import("react/jsx-runtime").JSX.Element) & {
    Content: import("tamagui").TamaguiComponent<import("@tamagui/web").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
        elevation?: number | import("tamagui").SizeTokens | undefined;
        inset?: number | import("tamagui").SizeTokens | {
            top?: number;
            bottom?: number;
            left?: number;
            right?: number;
        } | null | undefined;
        fullscreen?: boolean | undefined;
        unstyled?: boolean | undefined;
    }>, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & void, import("@tamagui/web").StackStyleBase, {
        elevation?: number | import("tamagui").SizeTokens | undefined;
        inset?: number | import("tamagui").SizeTokens | {
            top?: number;
            bottom?: number;
            left?: number;
            right?: number;
        } | null | undefined;
        fullscreen?: boolean | undefined;
        unstyled?: boolean | undefined;
    }, import("@tamagui/web").StaticConfigPublic>;
    Overlay: import("tamagui").TamaguiComponent<import("@tamagui/web").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
        elevation?: number | import("tamagui").SizeTokens | undefined;
        inset?: number | import("tamagui").SizeTokens | {
            top?: number;
            bottom?: number;
            left?: number;
            right?: number;
        } | null | undefined;
        fullscreen?: boolean | undefined;
        unstyled?: boolean | undefined;
    }>, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & void, import("@tamagui/web").StackStyleBase, {
        elevation?: number | import("tamagui").SizeTokens | undefined;
        inset?: number | import("tamagui").SizeTokens | {
            top?: number;
            bottom?: number;
            left?: number;
            right?: number;
        } | null | undefined;
        fullscreen?: boolean | undefined;
        unstyled?: boolean | undefined;
    }, import("@tamagui/web").StaticConfigPublic>;
    Swipeable: React.ForwardRefExoticComponent<Omit<Omit<import("tamagui").StackNonStyleProps & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {}>> & {
        onDismiss: () => void;
        children: any;
        dismissAfter?: number;
    } & React.RefAttributes<TamaguiElement>, "onDismiss">, "ref"> & React.RefAttributes<TamaguiElement>>;
    Portal: ({ children }: {
        children: any;
    }) => any;
};
export {};
//# sourceMappingURL=Drawer.d.ts.map
import { type ViewProps } from '@tamagui/core';
import type { FunctionComponent, Ref } from 'react';
import type { View as RNView } from 'react-native';
import type { SheetProps } from './types';
export * from './types';
type SheetStyleShorthandProps = {
    h?: ViewProps['height'];
    o?: ViewProps['opacity'];
    pos?: ViewProps['position'];
};
export declare const SheetHandle: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    open?: boolean | undefined;
    elevation?: number | import("@tamagui/core").Size | undefined;
}>, "scope" | keyof import("@tamagui/core").StackStyleBase | keyof import("@tamagui/core").StackNonStyleProps | "$native" | "$web" | "$ios" | "$android" | "$tv" | "$androidtv" | "$tvos" | import("@tamagui/core").GroupMediaKeys | keyof import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>> | keyof SheetStyleShorthandProps> & Omit<import("@tamagui/core").StackNonStyleProps & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {}>> & SheetStyleShorthandProps, "scope"> & {
    scope?: import("./types").SheetScopes;
}, RNView | (HTMLElement & import("@tamagui/core").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/core").StackNonStyleProps & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {}>> & SheetStyleShorthandProps, "scope"> & {
    scope?: import("./types").SheetScopes;
}, import("@tamagui/core").StackStyleBase, {
    open?: boolean | undefined;
    elevation?: number | import("@tamagui/core").Size | undefined;
}, import("@tamagui/core").StaticConfigPublic>;
export declare const SheetOverlay: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    open?: boolean | undefined;
    elevation?: number | import("@tamagui/core").Size | undefined;
}>, "scope" | keyof import("@tamagui/core").StackStyleBase | keyof import("@tamagui/core").StackNonStyleProps | "$native" | "$web" | "$ios" | "$android" | "$tv" | "$androidtv" | "$tvos" | import("@tamagui/core").GroupMediaKeys | keyof import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>> | keyof SheetStyleShorthandProps> & Omit<import("@tamagui/core").StackNonStyleProps & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {}>> & SheetStyleShorthandProps, "scope"> & {
    scope?: import("./types").SheetScopes;
}, RNView | (HTMLElement & import("@tamagui/core").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/core").StackNonStyleProps & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {}>> & SheetStyleShorthandProps, "scope"> & {
    scope?: import("./types").SheetScopes;
}, import("@tamagui/core").StackStyleBase, {
    open?: boolean | undefined;
    elevation?: number | import("@tamagui/core").Size | undefined;
}, import("@tamagui/core").StaticConfigPublic>;
type ExtraContainerProps = {
    /**
     * Adds padding accounting for the currently offscreen content, so if you put a flex element inside
     * the sheet, it will always flex to the height of the visible amount of the sheet. If this is not
     * turned on, the inner content is always set to the max height of the sheet.
     */
    adjustPaddingForOffscreenContent?: boolean;
};
export declare const SheetContainer: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    elevation?: number | import("@tamagui/core").Size | undefined;
}>, "scope" | keyof import("@tamagui/core").StackStyleBase | keyof import("@tamagui/core").StackNonStyleProps | "$native" | "$web" | "$ios" | "$android" | "$tv" | "$androidtv" | "$tvos" | import("@tamagui/core").GroupMediaKeys | keyof import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>> | keyof SheetStyleShorthandProps | "adjustPaddingForOffscreenContent"> & Omit<import("@tamagui/core").StackNonStyleProps & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {}>> & SheetStyleShorthandProps & ExtraContainerProps, "scope"> & {
    scope?: import("./types").SheetScopes;
}, RNView | (HTMLElement & import("@tamagui/core").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/core").StackNonStyleProps & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {}>> & SheetStyleShorthandProps & ExtraContainerProps, "scope"> & {
    scope?: import("./types").SheetScopes;
}, import("@tamagui/core").StackStyleBase, {
    elevation?: number | import("@tamagui/core").Size | undefined;
}, import("@tamagui/core").StaticConfigPublic>;
type ExtraBackgroundProps = {
    /**
     * Disables the default background extension below the sheet. Leave this off
     * when a spring can overshoot on open so page content never shows through.
     */
    disableHideBottomOverflow?: boolean;
};
export declare const SheetBackground: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    elevation?: number | import("@tamagui/core").Size | undefined;
}>, "scope" | keyof import("@tamagui/core").StackStyleBase | keyof import("@tamagui/core").StackNonStyleProps | "$native" | "$web" | "$ios" | "$android" | "$tv" | "$androidtv" | "$tvos" | import("@tamagui/core").GroupMediaKeys | keyof import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>> | keyof SheetStyleShorthandProps | "disableHideBottomOverflow"> & Omit<import("@tamagui/core").StackNonStyleProps & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {}>> & SheetStyleShorthandProps & ExtraBackgroundProps, "scope"> & {
    scope?: import("./types").SheetScopes;
}, RNView | (HTMLElement & import("@tamagui/core").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/core").StackNonStyleProps & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {}>> & SheetStyleShorthandProps & ExtraBackgroundProps, "scope"> & {
    scope?: import("./types").SheetScopes;
}, import("@tamagui/core").StackStyleBase, {
    elevation?: number | import("@tamagui/core").Size | undefined;
}, import("@tamagui/core").StaticConfigPublic>;
export declare const SheetRoot: import("@tamagui/compose-refs").RefComponent<RNView, SheetProps>;
export declare const SheetControlled: FunctionComponent<Omit<SheetProps, "open" | "onOpenChange"> & {
    ref?: Ref<RNView>;
}> & {
    Container: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
        elevation?: number | import("@tamagui/core").Size | undefined;
    }>, "scope" | keyof import("@tamagui/core").StackStyleBase | keyof import("@tamagui/core").StackNonStyleProps | "$native" | "$web" | "$ios" | "$android" | "$tv" | "$androidtv" | "$tvos" | import("@tamagui/core").GroupMediaKeys | keyof import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>> | keyof SheetStyleShorthandProps | "adjustPaddingForOffscreenContent"> & Omit<import("@tamagui/core").StackNonStyleProps & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {}>> & SheetStyleShorthandProps & ExtraContainerProps, "scope"> & {
        scope?: import("./types").SheetScopes;
    }, RNView | (HTMLElement & import("@tamagui/core").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/core").StackNonStyleProps & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {}>> & SheetStyleShorthandProps & ExtraContainerProps, "scope"> & {
        scope?: import("./types").SheetScopes;
    }, import("@tamagui/core").StackStyleBase, {
        elevation?: number | import("@tamagui/core").Size | undefined;
    }, import("@tamagui/core").StaticConfigPublic>;
    Background: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
        elevation?: number | import("@tamagui/core").Size | undefined;
    }>, "scope" | keyof import("@tamagui/core").StackStyleBase | keyof import("@tamagui/core").StackNonStyleProps | "$native" | "$web" | "$ios" | "$android" | "$tv" | "$androidtv" | "$tvos" | import("@tamagui/core").GroupMediaKeys | keyof import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>> | keyof SheetStyleShorthandProps | "disableHideBottomOverflow"> & Omit<import("@tamagui/core").StackNonStyleProps & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {}>> & SheetStyleShorthandProps & ExtraBackgroundProps, "scope"> & {
        scope?: import("./types").SheetScopes;
    }, RNView | (HTMLElement & import("@tamagui/core").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/core").StackNonStyleProps & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {}>> & SheetStyleShorthandProps & ExtraBackgroundProps, "scope"> & {
        scope?: import("./types").SheetScopes;
    }, import("@tamagui/core").StackStyleBase, {
        elevation?: number | import("@tamagui/core").Size | undefined;
    }, import("@tamagui/core").StaticConfigPublic>;
    Overlay: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
        open?: boolean | undefined;
        elevation?: number | import("@tamagui/core").Size | undefined;
    }>, "scope" | keyof import("@tamagui/core").StackStyleBase | keyof import("@tamagui/core").StackNonStyleProps | "$native" | "$web" | "$ios" | "$android" | "$tv" | "$androidtv" | "$tvos" | import("@tamagui/core").GroupMediaKeys | keyof import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>> | keyof SheetStyleShorthandProps> & Omit<import("@tamagui/core").StackNonStyleProps & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {}>> & SheetStyleShorthandProps, "scope"> & {
        scope?: import("./types").SheetScopes;
    }, RNView | (HTMLElement & import("@tamagui/core").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/core").StackNonStyleProps & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {}>> & SheetStyleShorthandProps, "scope"> & {
        scope?: import("./types").SheetScopes;
    }, import("@tamagui/core").StackStyleBase, {
        open?: boolean | undefined;
        elevation?: number | import("@tamagui/core").Size | undefined;
    }, import("@tamagui/core").StaticConfigPublic>;
    Handle: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
        open?: boolean | undefined;
        elevation?: number | import("@tamagui/core").Size | undefined;
    }>, "scope" | keyof import("@tamagui/core").StackStyleBase | keyof import("@tamagui/core").StackNonStyleProps | "$native" | "$web" | "$ios" | "$android" | "$tv" | "$androidtv" | "$tvos" | import("@tamagui/core").GroupMediaKeys | keyof import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>> | keyof SheetStyleShorthandProps> & Omit<import("@tamagui/core").StackNonStyleProps & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {}>> & SheetStyleShorthandProps, "scope"> & {
        scope?: import("./types").SheetScopes;
    }, RNView | (HTMLElement & import("@tamagui/core").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/core").StackNonStyleProps & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {}>> & SheetStyleShorthandProps, "scope"> & {
        scope?: import("./types").SheetScopes;
    }, import("@tamagui/core").StackStyleBase, {
        open?: boolean | undefined;
        elevation?: number | import("@tamagui/core").Size | undefined;
    }, import("@tamagui/core").StaticConfigPublic>;
    ScrollView: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").TamaguiComponentPropsBaseBase & Omit<any, "ref"> & import("react").RefAttributes<import("@tamagui/scroll-view").ScrollViewRef>, import("@tamagui/core").StackStyleBase & {
        readonly contentContainerStyle?: Partial<import("@tamagui/core").InferStyleProps<import("react").ForwardRefExoticComponent<Omit<any, "ref"> & import("react").RefAttributes<import("@tamagui/scroll-view").ScrollViewRef>>, {
            acceptsClassName: true;
            accept: {
                readonly contentContainerStyle: "style";
            };
        }>> | undefined;
    }, {}>, string | number | symbol> & Omit<Omit<import("@tamagui/core").TamaguiComponentPropsBaseBase & Omit<any, "ref"> & import("react").RefAttributes<import("@tamagui/scroll-view").ScrollViewRef>, keyof import("@tamagui/core").StackStyleBase | "contentContainerStyle"> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase & {
        readonly contentContainerStyle?: Partial<import("@tamagui/core").InferStyleProps<import("react").ForwardRefExoticComponent<Omit<any, "ref"> & import("react").RefAttributes<import("@tamagui/scroll-view").ScrollViewRef>>, {
            acceptsClassName: true;
            accept: {
                readonly contentContainerStyle: "style";
            };
        }>> | undefined;
    }> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase & {
        readonly contentContainerStyle?: Partial<import("@tamagui/core").InferStyleProps<import("react").ForwardRefExoticComponent<Omit<any, "ref"> & import("react").RefAttributes<import("@tamagui/scroll-view").ScrollViewRef>>, {
            acceptsClassName: true;
            accept: {
                readonly contentContainerStyle: "style";
            };
        }>> | undefined;
    }>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase & {
        readonly contentContainerStyle?: Partial<import("@tamagui/core").InferStyleProps<import("react").ForwardRefExoticComponent<Omit<any, "ref"> & import("react").RefAttributes<import("@tamagui/scroll-view").ScrollViewRef>>, {
            acceptsClassName: true;
            accept: {
                readonly contentContainerStyle: "style";
            };
        }>> | undefined;
    }> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase & {
        readonly contentContainerStyle?: Partial<import("@tamagui/core").InferStyleProps<import("react").ForwardRefExoticComponent<Omit<any, "ref"> & import("react").RefAttributes<import("@tamagui/scroll-view").ScrollViewRef>>, {
            acceptsClassName: true;
            accept: {
                readonly contentContainerStyle: "style";
            };
        }>> | undefined;
    }>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase & {
        readonly contentContainerStyle?: Partial<import("@tamagui/core").InferStyleProps<import("react").ForwardRefExoticComponent<Omit<any, "ref"> & import("react").RefAttributes<import("@tamagui/scroll-view").ScrollViewRef>>, {
            acceptsClassName: true;
            accept: {
                readonly contentContainerStyle: "style";
            };
        }>> | undefined;
    }, {}>> & {
        h?: number | "unset" | import("react-native").Animated.AnimatedNode | import("@tamagui/core").GetThemeValueForKey<"height"> | null | undefined;
        o?: "unset" | import("@tamagui/core").GetThemeValueForKey<"opacity"> | import("react-native").AnimatableNumericValue | undefined;
        pos?: "fixed" | "absolute" | "unset" | "relative" | "static" | "sticky" | undefined;
    }, "scope"> & {
        scope?: import("./types").SheetScopes;
    }, import("@tamagui/scroll-view").ScrollViewRef, import("@tamagui/core").TamaguiComponentPropsBaseBase & Omit<any, "ref"> & import("react").RefAttributes<import("@tamagui/scroll-view").ScrollViewRef> & Omit<Omit<import("@tamagui/core").TamaguiComponentPropsBaseBase & Omit<any, "ref"> & import("react").RefAttributes<import("@tamagui/scroll-view").ScrollViewRef>, keyof import("@tamagui/core").StackStyleBase | "contentContainerStyle"> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase & {
        readonly contentContainerStyle?: Partial<import("@tamagui/core").InferStyleProps<import("react").ForwardRefExoticComponent<Omit<any, "ref"> & import("react").RefAttributes<import("@tamagui/scroll-view").ScrollViewRef>>, {
            acceptsClassName: true;
            accept: {
                readonly contentContainerStyle: "style";
            };
        }>> | undefined;
    }> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase & {
        readonly contentContainerStyle?: Partial<import("@tamagui/core").InferStyleProps<import("react").ForwardRefExoticComponent<Omit<any, "ref"> & import("react").RefAttributes<import("@tamagui/scroll-view").ScrollViewRef>>, {
            acceptsClassName: true;
            accept: {
                readonly contentContainerStyle: "style";
            };
        }>> | undefined;
    }>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase & {
        readonly contentContainerStyle?: Partial<import("@tamagui/core").InferStyleProps<import("react").ForwardRefExoticComponent<Omit<any, "ref"> & import("react").RefAttributes<import("@tamagui/scroll-view").ScrollViewRef>>, {
            acceptsClassName: true;
            accept: {
                readonly contentContainerStyle: "style";
            };
        }>> | undefined;
    }> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase & {
        readonly contentContainerStyle?: Partial<import("@tamagui/core").InferStyleProps<import("react").ForwardRefExoticComponent<Omit<any, "ref"> & import("react").RefAttributes<import("@tamagui/scroll-view").ScrollViewRef>>, {
            acceptsClassName: true;
            accept: {
                readonly contentContainerStyle: "style";
            };
        }>> | undefined;
    }>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase & {
        readonly contentContainerStyle?: Partial<import("@tamagui/core").InferStyleProps<import("react").ForwardRefExoticComponent<Omit<any, "ref"> & import("react").RefAttributes<import("@tamagui/scroll-view").ScrollViewRef>>, {
            acceptsClassName: true;
            accept: {
                readonly contentContainerStyle: "style";
            };
        }>> | undefined;
    }, {}>> & {
        h?: number | "unset" | import("react-native").Animated.AnimatedNode | import("@tamagui/core").GetThemeValueForKey<"height"> | null | undefined;
        o?: "unset" | import("@tamagui/core").GetThemeValueForKey<"opacity"> | import("react-native").AnimatableNumericValue | undefined;
        pos?: "fixed" | "absolute" | "unset" | "relative" | "static" | "sticky" | undefined;
    }, "scope"> & {
        scope?: import("./types").SheetScopes;
    }, import("@tamagui/core").StackStyleBase & {
        readonly contentContainerStyle?: Partial<import("@tamagui/core").InferStyleProps<import("react").ForwardRefExoticComponent<Omit<any, "ref"> & import("react").RefAttributes<import("@tamagui/scroll-view").ScrollViewRef>>, {
            acceptsClassName: true;
            accept: {
                readonly contentContainerStyle: "style";
            };
        }>> | undefined;
    }, {}, {
        acceptsClassName: true;
        accept: {
            readonly contentContainerStyle: "style";
        };
    }>;
};
export declare const Sheet: ((props: Omit<{
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: import("react").Dispatch<import("react").SetStateAction<boolean>> | ((open: boolean) => void);
    position?: number;
    defaultPosition?: number;
    snapPoints?: (string | number)[];
    snapPointsMode?: import("./types").SnapPointsMode;
    onPositionChange?: import("./types").PositionChangeHandler;
    children?: import("react").ReactNode;
    dismissOnOverlayPress?: boolean;
    dismissOnSnapToBottom?: boolean;
    disableRemoveScroll?: boolean;
    transitionConfig?: import("@tamagui/core").AnimatedNumberStrategy;
    preferAdaptParentOpenState?: boolean;
    unmountChildrenWhenHidden?: boolean;
    disableTransparencyHide?: boolean;
    native?: "ios"[] | boolean;
    transition?: import("@tamagui/core").TransitionProp;
    handleDisableScroll?: boolean;
    disableDrag?: boolean;
    modal?: boolean;
    zIndex?: number;
    portalProps?: import("@tamagui/portal").PortalProps;
    moveOnKeyboardChange?: boolean;
    containerComponent?: React.ComponentType<any>;
    onAnimationComplete?: (info: {
        open: boolean;
    }) => void;
}, "scope"> & {
    scope?: import("./types").SheetScopes;
} & import("@tamagui/compose-refs").RefProp<RNView>) => import("react").ReactNode) & {
    displayName?: string;
    propTypes?: any;
} & {
    Container: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
        elevation?: number | import("@tamagui/core").Size | undefined;
    }>, "scope" | keyof import("@tamagui/core").StackStyleBase | keyof import("@tamagui/core").StackNonStyleProps | "$native" | "$web" | "$ios" | "$android" | "$tv" | "$androidtv" | "$tvos" | import("@tamagui/core").GroupMediaKeys | keyof import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>> | keyof SheetStyleShorthandProps | "adjustPaddingForOffscreenContent"> & Omit<import("@tamagui/core").StackNonStyleProps & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {}>> & SheetStyleShorthandProps & ExtraContainerProps, "scope"> & {
        scope?: import("./types").SheetScopes;
    }, RNView | (HTMLElement & import("@tamagui/core").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/core").StackNonStyleProps & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {}>> & SheetStyleShorthandProps & ExtraContainerProps, "scope"> & {
        scope?: import("./types").SheetScopes;
    }, import("@tamagui/core").StackStyleBase, {
        elevation?: number | import("@tamagui/core").Size | undefined;
    }, import("@tamagui/core").StaticConfigPublic>;
    Background: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
        elevation?: number | import("@tamagui/core").Size | undefined;
    }>, "scope" | keyof import("@tamagui/core").StackStyleBase | keyof import("@tamagui/core").StackNonStyleProps | "$native" | "$web" | "$ios" | "$android" | "$tv" | "$androidtv" | "$tvos" | import("@tamagui/core").GroupMediaKeys | keyof import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>> | keyof SheetStyleShorthandProps | "disableHideBottomOverflow"> & Omit<import("@tamagui/core").StackNonStyleProps & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {}>> & SheetStyleShorthandProps & ExtraBackgroundProps, "scope"> & {
        scope?: import("./types").SheetScopes;
    }, RNView | (HTMLElement & import("@tamagui/core").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/core").StackNonStyleProps & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {}>> & SheetStyleShorthandProps & ExtraBackgroundProps, "scope"> & {
        scope?: import("./types").SheetScopes;
    }, import("@tamagui/core").StackStyleBase, {
        elevation?: number | import("@tamagui/core").Size | undefined;
    }, import("@tamagui/core").StaticConfigPublic>;
    Overlay: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
        open?: boolean | undefined;
        elevation?: number | import("@tamagui/core").Size | undefined;
    }>, "scope" | keyof import("@tamagui/core").StackStyleBase | keyof import("@tamagui/core").StackNonStyleProps | "$native" | "$web" | "$ios" | "$android" | "$tv" | "$androidtv" | "$tvos" | import("@tamagui/core").GroupMediaKeys | keyof import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>> | keyof SheetStyleShorthandProps> & Omit<import("@tamagui/core").StackNonStyleProps & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {}>> & SheetStyleShorthandProps, "scope"> & {
        scope?: import("./types").SheetScopes;
    }, RNView | (HTMLElement & import("@tamagui/core").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/core").StackNonStyleProps & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {}>> & SheetStyleShorthandProps, "scope"> & {
        scope?: import("./types").SheetScopes;
    }, import("@tamagui/core").StackStyleBase, {
        open?: boolean | undefined;
        elevation?: number | import("@tamagui/core").Size | undefined;
    }, import("@tamagui/core").StaticConfigPublic>;
    Handle: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
        open?: boolean | undefined;
        elevation?: number | import("@tamagui/core").Size | undefined;
    }>, "scope" | keyof import("@tamagui/core").StackStyleBase | keyof import("@tamagui/core").StackNonStyleProps | "$native" | "$web" | "$ios" | "$android" | "$tv" | "$androidtv" | "$tvos" | import("@tamagui/core").GroupMediaKeys | keyof import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>> | keyof SheetStyleShorthandProps> & Omit<import("@tamagui/core").StackNonStyleProps & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {}>> & SheetStyleShorthandProps, "scope"> & {
        scope?: import("./types").SheetScopes;
    }, RNView | (HTMLElement & import("@tamagui/core").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/core").StackNonStyleProps & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {}>> & SheetStyleShorthandProps, "scope"> & {
        scope?: import("./types").SheetScopes;
    }, import("@tamagui/core").StackStyleBase, {
        open?: boolean | undefined;
        elevation?: number | import("@tamagui/core").Size | undefined;
    }, import("@tamagui/core").StaticConfigPublic>;
    ScrollView: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").TamaguiComponentPropsBaseBase & Omit<any, "ref"> & import("react").RefAttributes<import("@tamagui/scroll-view").ScrollViewRef>, import("@tamagui/core").StackStyleBase & {
        readonly contentContainerStyle?: Partial<import("@tamagui/core").InferStyleProps<import("react").ForwardRefExoticComponent<Omit<any, "ref"> & import("react").RefAttributes<import("@tamagui/scroll-view").ScrollViewRef>>, {
            acceptsClassName: true;
            accept: {
                readonly contentContainerStyle: "style";
            };
        }>> | undefined;
    }, {}>, string | number | symbol> & Omit<Omit<import("@tamagui/core").TamaguiComponentPropsBaseBase & Omit<any, "ref"> & import("react").RefAttributes<import("@tamagui/scroll-view").ScrollViewRef>, keyof import("@tamagui/core").StackStyleBase | "contentContainerStyle"> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase & {
        readonly contentContainerStyle?: Partial<import("@tamagui/core").InferStyleProps<import("react").ForwardRefExoticComponent<Omit<any, "ref"> & import("react").RefAttributes<import("@tamagui/scroll-view").ScrollViewRef>>, {
            acceptsClassName: true;
            accept: {
                readonly contentContainerStyle: "style";
            };
        }>> | undefined;
    }> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase & {
        readonly contentContainerStyle?: Partial<import("@tamagui/core").InferStyleProps<import("react").ForwardRefExoticComponent<Omit<any, "ref"> & import("react").RefAttributes<import("@tamagui/scroll-view").ScrollViewRef>>, {
            acceptsClassName: true;
            accept: {
                readonly contentContainerStyle: "style";
            };
        }>> | undefined;
    }>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase & {
        readonly contentContainerStyle?: Partial<import("@tamagui/core").InferStyleProps<import("react").ForwardRefExoticComponent<Omit<any, "ref"> & import("react").RefAttributes<import("@tamagui/scroll-view").ScrollViewRef>>, {
            acceptsClassName: true;
            accept: {
                readonly contentContainerStyle: "style";
            };
        }>> | undefined;
    }> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase & {
        readonly contentContainerStyle?: Partial<import("@tamagui/core").InferStyleProps<import("react").ForwardRefExoticComponent<Omit<any, "ref"> & import("react").RefAttributes<import("@tamagui/scroll-view").ScrollViewRef>>, {
            acceptsClassName: true;
            accept: {
                readonly contentContainerStyle: "style";
            };
        }>> | undefined;
    }>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase & {
        readonly contentContainerStyle?: Partial<import("@tamagui/core").InferStyleProps<import("react").ForwardRefExoticComponent<Omit<any, "ref"> & import("react").RefAttributes<import("@tamagui/scroll-view").ScrollViewRef>>, {
            acceptsClassName: true;
            accept: {
                readonly contentContainerStyle: "style";
            };
        }>> | undefined;
    }, {}>> & {
        h?: number | "unset" | import("react-native").Animated.AnimatedNode | import("@tamagui/core").GetThemeValueForKey<"height"> | null | undefined;
        o?: "unset" | import("@tamagui/core").GetThemeValueForKey<"opacity"> | import("react-native").AnimatableNumericValue | undefined;
        pos?: "fixed" | "absolute" | "unset" | "relative" | "static" | "sticky" | undefined;
    }, "scope"> & {
        scope?: import("./types").SheetScopes;
    }, import("@tamagui/scroll-view").ScrollViewRef, import("@tamagui/core").TamaguiComponentPropsBaseBase & Omit<any, "ref"> & import("react").RefAttributes<import("@tamagui/scroll-view").ScrollViewRef> & Omit<Omit<import("@tamagui/core").TamaguiComponentPropsBaseBase & Omit<any, "ref"> & import("react").RefAttributes<import("@tamagui/scroll-view").ScrollViewRef>, keyof import("@tamagui/core").StackStyleBase | "contentContainerStyle"> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase & {
        readonly contentContainerStyle?: Partial<import("@tamagui/core").InferStyleProps<import("react").ForwardRefExoticComponent<Omit<any, "ref"> & import("react").RefAttributes<import("@tamagui/scroll-view").ScrollViewRef>>, {
            acceptsClassName: true;
            accept: {
                readonly contentContainerStyle: "style";
            };
        }>> | undefined;
    }> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase & {
        readonly contentContainerStyle?: Partial<import("@tamagui/core").InferStyleProps<import("react").ForwardRefExoticComponent<Omit<any, "ref"> & import("react").RefAttributes<import("@tamagui/scroll-view").ScrollViewRef>>, {
            acceptsClassName: true;
            accept: {
                readonly contentContainerStyle: "style";
            };
        }>> | undefined;
    }>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase & {
        readonly contentContainerStyle?: Partial<import("@tamagui/core").InferStyleProps<import("react").ForwardRefExoticComponent<Omit<any, "ref"> & import("react").RefAttributes<import("@tamagui/scroll-view").ScrollViewRef>>, {
            acceptsClassName: true;
            accept: {
                readonly contentContainerStyle: "style";
            };
        }>> | undefined;
    }> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase & {
        readonly contentContainerStyle?: Partial<import("@tamagui/core").InferStyleProps<import("react").ForwardRefExoticComponent<Omit<any, "ref"> & import("react").RefAttributes<import("@tamagui/scroll-view").ScrollViewRef>>, {
            acceptsClassName: true;
            accept: {
                readonly contentContainerStyle: "style";
            };
        }>> | undefined;
    }>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase & {
        readonly contentContainerStyle?: Partial<import("@tamagui/core").InferStyleProps<import("react").ForwardRefExoticComponent<Omit<any, "ref"> & import("react").RefAttributes<import("@tamagui/scroll-view").ScrollViewRef>>, {
            acceptsClassName: true;
            accept: {
                readonly contentContainerStyle: "style";
            };
        }>> | undefined;
    }, {}>> & {
        h?: number | "unset" | import("react-native").Animated.AnimatedNode | import("@tamagui/core").GetThemeValueForKey<"height"> | null | undefined;
        o?: "unset" | import("@tamagui/core").GetThemeValueForKey<"opacity"> | import("react-native").AnimatableNumericValue | undefined;
        pos?: "fixed" | "absolute" | "unset" | "relative" | "static" | "sticky" | undefined;
    }, "scope"> & {
        scope?: import("./types").SheetScopes;
    }, import("@tamagui/core").StackStyleBase & {
        readonly contentContainerStyle?: Partial<import("@tamagui/core").InferStyleProps<import("react").ForwardRefExoticComponent<Omit<any, "ref"> & import("react").RefAttributes<import("@tamagui/scroll-view").ScrollViewRef>>, {
            acceptsClassName: true;
            accept: {
                readonly contentContainerStyle: "style";
            };
        }>> | undefined;
    }, {}, {
        acceptsClassName: true;
        accept: {
            readonly contentContainerStyle: "style";
        };
    }>;
    Root: import("@tamagui/compose-refs").RefComponent<RNView, SheetProps>;
    Controlled: FunctionComponent<Omit<SheetProps, "open" | "onOpenChange"> & {
        ref?: Ref<RNView>;
    }> & {
        Container: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
            elevation?: number | import("@tamagui/core").Size | undefined;
        }>, "scope" | keyof import("@tamagui/core").StackStyleBase | keyof import("@tamagui/core").StackNonStyleProps | "$native" | "$web" | "$ios" | "$android" | "$tv" | "$androidtv" | "$tvos" | import("@tamagui/core").GroupMediaKeys | keyof import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>> | keyof SheetStyleShorthandProps | "adjustPaddingForOffscreenContent"> & Omit<import("@tamagui/core").StackNonStyleProps & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {}>> & SheetStyleShorthandProps & ExtraContainerProps, "scope"> & {
            scope?: import("./types").SheetScopes;
        }, RNView | (HTMLElement & import("@tamagui/core").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/core").StackNonStyleProps & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {}>> & SheetStyleShorthandProps & ExtraContainerProps, "scope"> & {
            scope?: import("./types").SheetScopes;
        }, import("@tamagui/core").StackStyleBase, {
            elevation?: number | import("@tamagui/core").Size | undefined;
        }, import("@tamagui/core").StaticConfigPublic>;
        Background: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
            elevation?: number | import("@tamagui/core").Size | undefined;
        }>, "scope" | keyof import("@tamagui/core").StackStyleBase | keyof import("@tamagui/core").StackNonStyleProps | "$native" | "$web" | "$ios" | "$android" | "$tv" | "$androidtv" | "$tvos" | import("@tamagui/core").GroupMediaKeys | keyof import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>> | keyof SheetStyleShorthandProps | "disableHideBottomOverflow"> & Omit<import("@tamagui/core").StackNonStyleProps & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {}>> & SheetStyleShorthandProps & ExtraBackgroundProps, "scope"> & {
            scope?: import("./types").SheetScopes;
        }, RNView | (HTMLElement & import("@tamagui/core").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/core").StackNonStyleProps & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {}>> & SheetStyleShorthandProps & ExtraBackgroundProps, "scope"> & {
            scope?: import("./types").SheetScopes;
        }, import("@tamagui/core").StackStyleBase, {
            elevation?: number | import("@tamagui/core").Size | undefined;
        }, import("@tamagui/core").StaticConfigPublic>;
        Overlay: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
            open?: boolean | undefined;
            elevation?: number | import("@tamagui/core").Size | undefined;
        }>, "scope" | keyof import("@tamagui/core").StackStyleBase | keyof import("@tamagui/core").StackNonStyleProps | "$native" | "$web" | "$ios" | "$android" | "$tv" | "$androidtv" | "$tvos" | import("@tamagui/core").GroupMediaKeys | keyof import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>> | keyof SheetStyleShorthandProps> & Omit<import("@tamagui/core").StackNonStyleProps & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {}>> & SheetStyleShorthandProps, "scope"> & {
            scope?: import("./types").SheetScopes;
        }, RNView | (HTMLElement & import("@tamagui/core").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/core").StackNonStyleProps & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {}>> & SheetStyleShorthandProps, "scope"> & {
            scope?: import("./types").SheetScopes;
        }, import("@tamagui/core").StackStyleBase, {
            open?: boolean | undefined;
            elevation?: number | import("@tamagui/core").Size | undefined;
        }, import("@tamagui/core").StaticConfigPublic>;
        Handle: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
            open?: boolean | undefined;
            elevation?: number | import("@tamagui/core").Size | undefined;
        }>, "scope" | keyof import("@tamagui/core").StackStyleBase | keyof import("@tamagui/core").StackNonStyleProps | "$native" | "$web" | "$ios" | "$android" | "$tv" | "$androidtv" | "$tvos" | import("@tamagui/core").GroupMediaKeys | keyof import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>> | keyof SheetStyleShorthandProps> & Omit<import("@tamagui/core").StackNonStyleProps & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {}>> & SheetStyleShorthandProps, "scope"> & {
            scope?: import("./types").SheetScopes;
        }, RNView | (HTMLElement & import("@tamagui/core").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/core").StackNonStyleProps & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {}>> & SheetStyleShorthandProps, "scope"> & {
            scope?: import("./types").SheetScopes;
        }, import("@tamagui/core").StackStyleBase, {
            open?: boolean | undefined;
            elevation?: number | import("@tamagui/core").Size | undefined;
        }, import("@tamagui/core").StaticConfigPublic>;
        ScrollView: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").TamaguiComponentPropsBaseBase & Omit<any, "ref"> & import("react").RefAttributes<import("@tamagui/scroll-view").ScrollViewRef>, import("@tamagui/core").StackStyleBase & {
            readonly contentContainerStyle?: Partial<import("@tamagui/core").InferStyleProps<import("react").ForwardRefExoticComponent<Omit<any, "ref"> & import("react").RefAttributes<import("@tamagui/scroll-view").ScrollViewRef>>, {
                acceptsClassName: true;
                accept: {
                    readonly contentContainerStyle: "style";
                };
            }>> | undefined;
        }, {}>, string | number | symbol> & Omit<Omit<import("@tamagui/core").TamaguiComponentPropsBaseBase & Omit<any, "ref"> & import("react").RefAttributes<import("@tamagui/scroll-view").ScrollViewRef>, keyof import("@tamagui/core").StackStyleBase | "contentContainerStyle"> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase & {
            readonly contentContainerStyle?: Partial<import("@tamagui/core").InferStyleProps<import("react").ForwardRefExoticComponent<Omit<any, "ref"> & import("react").RefAttributes<import("@tamagui/scroll-view").ScrollViewRef>>, {
                acceptsClassName: true;
                accept: {
                    readonly contentContainerStyle: "style";
                };
            }>> | undefined;
        }> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase & {
            readonly contentContainerStyle?: Partial<import("@tamagui/core").InferStyleProps<import("react").ForwardRefExoticComponent<Omit<any, "ref"> & import("react").RefAttributes<import("@tamagui/scroll-view").ScrollViewRef>>, {
                acceptsClassName: true;
                accept: {
                    readonly contentContainerStyle: "style";
                };
            }>> | undefined;
        }>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase & {
            readonly contentContainerStyle?: Partial<import("@tamagui/core").InferStyleProps<import("react").ForwardRefExoticComponent<Omit<any, "ref"> & import("react").RefAttributes<import("@tamagui/scroll-view").ScrollViewRef>>, {
                acceptsClassName: true;
                accept: {
                    readonly contentContainerStyle: "style";
                };
            }>> | undefined;
        }> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase & {
            readonly contentContainerStyle?: Partial<import("@tamagui/core").InferStyleProps<import("react").ForwardRefExoticComponent<Omit<any, "ref"> & import("react").RefAttributes<import("@tamagui/scroll-view").ScrollViewRef>>, {
                acceptsClassName: true;
                accept: {
                    readonly contentContainerStyle: "style";
                };
            }>> | undefined;
        }>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase & {
            readonly contentContainerStyle?: Partial<import("@tamagui/core").InferStyleProps<import("react").ForwardRefExoticComponent<Omit<any, "ref"> & import("react").RefAttributes<import("@tamagui/scroll-view").ScrollViewRef>>, {
                acceptsClassName: true;
                accept: {
                    readonly contentContainerStyle: "style";
                };
            }>> | undefined;
        }, {}>> & {
            h?: number | "unset" | import("react-native").Animated.AnimatedNode | import("@tamagui/core").GetThemeValueForKey<"height"> | null | undefined;
            o?: "unset" | import("@tamagui/core").GetThemeValueForKey<"opacity"> | import("react-native").AnimatableNumericValue | undefined;
            pos?: "fixed" | "absolute" | "unset" | "relative" | "static" | "sticky" | undefined;
        }, "scope"> & {
            scope?: import("./types").SheetScopes;
        }, import("@tamagui/scroll-view").ScrollViewRef, import("@tamagui/core").TamaguiComponentPropsBaseBase & Omit<any, "ref"> & import("react").RefAttributes<import("@tamagui/scroll-view").ScrollViewRef> & Omit<Omit<import("@tamagui/core").TamaguiComponentPropsBaseBase & Omit<any, "ref"> & import("react").RefAttributes<import("@tamagui/scroll-view").ScrollViewRef>, keyof import("@tamagui/core").StackStyleBase | "contentContainerStyle"> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase & {
            readonly contentContainerStyle?: Partial<import("@tamagui/core").InferStyleProps<import("react").ForwardRefExoticComponent<Omit<any, "ref"> & import("react").RefAttributes<import("@tamagui/scroll-view").ScrollViewRef>>, {
                acceptsClassName: true;
                accept: {
                    readonly contentContainerStyle: "style";
                };
            }>> | undefined;
        }> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase & {
            readonly contentContainerStyle?: Partial<import("@tamagui/core").InferStyleProps<import("react").ForwardRefExoticComponent<Omit<any, "ref"> & import("react").RefAttributes<import("@tamagui/scroll-view").ScrollViewRef>>, {
                acceptsClassName: true;
                accept: {
                    readonly contentContainerStyle: "style";
                };
            }>> | undefined;
        }>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase & {
            readonly contentContainerStyle?: Partial<import("@tamagui/core").InferStyleProps<import("react").ForwardRefExoticComponent<Omit<any, "ref"> & import("react").RefAttributes<import("@tamagui/scroll-view").ScrollViewRef>>, {
                acceptsClassName: true;
                accept: {
                    readonly contentContainerStyle: "style";
                };
            }>> | undefined;
        }> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase & {
            readonly contentContainerStyle?: Partial<import("@tamagui/core").InferStyleProps<import("react").ForwardRefExoticComponent<Omit<any, "ref"> & import("react").RefAttributes<import("@tamagui/scroll-view").ScrollViewRef>>, {
                acceptsClassName: true;
                accept: {
                    readonly contentContainerStyle: "style";
                };
            }>> | undefined;
        }>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase & {
            readonly contentContainerStyle?: Partial<import("@tamagui/core").InferStyleProps<import("react").ForwardRefExoticComponent<Omit<any, "ref"> & import("react").RefAttributes<import("@tamagui/scroll-view").ScrollViewRef>>, {
                acceptsClassName: true;
                accept: {
                    readonly contentContainerStyle: "style";
                };
            }>> | undefined;
        }, {}>> & {
            h?: number | "unset" | import("react-native").Animated.AnimatedNode | import("@tamagui/core").GetThemeValueForKey<"height"> | null | undefined;
            o?: "unset" | import("@tamagui/core").GetThemeValueForKey<"opacity"> | import("react-native").AnimatableNumericValue | undefined;
            pos?: "fixed" | "absolute" | "unset" | "relative" | "static" | "sticky" | undefined;
        }, "scope"> & {
            scope?: import("./types").SheetScopes;
        }, import("@tamagui/core").StackStyleBase & {
            readonly contentContainerStyle?: Partial<import("@tamagui/core").InferStyleProps<import("react").ForwardRefExoticComponent<Omit<any, "ref"> & import("react").RefAttributes<import("@tamagui/scroll-view").ScrollViewRef>>, {
                acceptsClassName: true;
                accept: {
                    readonly contentContainerStyle: "style";
                };
            }>> | undefined;
        }, {}, {
            acceptsClassName: true;
            accept: {
                readonly contentContainerStyle: "style";
            };
        }>;
    };
};
//# sourceMappingURL=Sheet.d.ts.map
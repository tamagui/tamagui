import { type TamaguiElement, type ViewProps } from '@tamagui/core';
import type { FunctionComponent, Ref } from 'react';
import type { ViewInstance as RNView } from '@tamagui/react-native-types';
import { useAnimatedPosition } from './SheetContext';
import type { SheetProps } from './types';
export * from './types';
type SheetStyleShorthandProps = {
    h?: ViewProps['height'];
    o?: ViewProps['opacity'];
    pos?: ViewProps['position'];
};
export declare const SheetHandle: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "scope" | keyof import("@tamagui/core").RNTamaguiViewNonStyleProps | keyof SheetStyleShorthandProps | keyof import("@tamagui/core").StackStyleBase> & Omit<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, never> & Omit<import("@tamagui/core").WithThemeValues<Omit<import("@tamagui/core").StackStyleBase, never>> & import("@tamagui/core").WithFlatVariantValues<{}> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>, keyof import("@tamagui/core").RNTamaguiViewNonStyleProps> & SheetStyleShorthandProps, "scope"> & {
    scope?: import("./types").SheetScopes;
}, import("@tamagui/core").StackStyleBase, Omit<{
    open?: boolean | undefined;
}, "scope" | keyof import("@tamagui/core").RNTamaguiViewNonStyleProps | keyof SheetStyleShorthandProps | keyof import("@tamagui/core").StackStyleBase>, import("@tamagui/core").StaticConfigPublic>;
export declare const SheetOverlay: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "scope" | keyof import("@tamagui/core").RNTamaguiViewNonStyleProps | keyof SheetStyleShorthandProps | keyof import("@tamagui/core").StackStyleBase> & Omit<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, never> & Omit<import("@tamagui/core").WithThemeValues<Omit<import("@tamagui/core").StackStyleBase, never>> & import("@tamagui/core").WithFlatVariantValues<{}> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>, keyof import("@tamagui/core").RNTamaguiViewNonStyleProps> & SheetStyleShorthandProps, "scope"> & {
    scope?: import("./types").SheetScopes;
}, import("@tamagui/core").StackStyleBase, Omit<{
    open?: boolean | undefined;
}, "scope" | keyof import("@tamagui/core").RNTamaguiViewNonStyleProps | keyof SheetStyleShorthandProps | keyof import("@tamagui/core").StackStyleBase>, import("@tamagui/core").StaticConfigPublic>;
type ExtraContainerProps = {
    /**
     * Adds padding accounting for the currently offscreen content, so if you put a flex element inside
     * the sheet, it will always flex to the height of the visible amount of the sheet. If this is not
     * turned on, the inner content is always set to the max height of the sheet.
     */
    adjustPaddingForOffscreenContent?: boolean;
};
export declare const SheetContainer: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "adjustPaddingForOffscreenContent" | "scope" | keyof import("@tamagui/core").RNTamaguiViewNonStyleProps | keyof SheetStyleShorthandProps | keyof import("@tamagui/core").StackStyleBase> & Omit<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, never> & Omit<import("@tamagui/core").WithThemeValues<Omit<import("@tamagui/core").StackStyleBase, never>> & import("@tamagui/core").WithFlatVariantValues<{}> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>, keyof import("@tamagui/core").RNTamaguiViewNonStyleProps> & SheetStyleShorthandProps & ExtraContainerProps, "scope"> & {
    scope?: import("./types").SheetScopes;
}, import("@tamagui/core").StackStyleBase, Omit<{}, "adjustPaddingForOffscreenContent" | "scope" | keyof import("@tamagui/core").RNTamaguiViewNonStyleProps | keyof SheetStyleShorthandProps | keyof import("@tamagui/core").StackStyleBase>, import("@tamagui/core").StaticConfigPublic>;
type ExtraBackgroundProps = {
    /**
     * Disables the default background extension below the sheet. Leave this off
     * when a spring can overshoot on open so page content never shows through.
     */
    disableHideBottomOverflow?: boolean;
};
export declare const SheetBackground: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "disableHideBottomOverflow" | "scope" | keyof import("@tamagui/core").RNTamaguiViewNonStyleProps | keyof SheetStyleShorthandProps | keyof import("@tamagui/core").StackStyleBase> & Omit<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, never> & Omit<import("@tamagui/core").WithThemeValues<Omit<import("@tamagui/core").StackStyleBase, never>> & import("@tamagui/core").WithFlatVariantValues<{}> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>, keyof import("@tamagui/core").RNTamaguiViewNonStyleProps> & SheetStyleShorthandProps & ExtraBackgroundProps, "scope"> & {
    scope?: import("./types").SheetScopes;
}, import("@tamagui/core").StackStyleBase, Omit<{}, "disableHideBottomOverflow" | "scope" | keyof import("@tamagui/core").RNTamaguiViewNonStyleProps | keyof SheetStyleShorthandProps | keyof import("@tamagui/core").StackStyleBase>, import("@tamagui/core").StaticConfigPublic>;
export declare const SheetRoot: import("@tamagui/compose-refs").RefComponent<RNView, SheetProps>;
export declare const SheetControlled: import("@tamagui/helpers").Combined<FunctionComponent<Omit<SheetProps, "onOpenChange" | "open"> & {
    ref?: Ref<RNView>;
}>, {
    Container: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "adjustPaddingForOffscreenContent" | "scope" | keyof import("@tamagui/core").RNTamaguiViewNonStyleProps | keyof SheetStyleShorthandProps | keyof import("@tamagui/core").StackStyleBase> & Omit<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, never> & Omit<import("@tamagui/core").WithThemeValues<Omit<import("@tamagui/core").StackStyleBase, never>> & import("@tamagui/core").WithFlatVariantValues<{}> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>, keyof import("@tamagui/core").RNTamaguiViewNonStyleProps> & SheetStyleShorthandProps & ExtraContainerProps, "scope"> & {
        scope?: import("./types").SheetScopes;
    }, import("@tamagui/core").StackStyleBase, Omit<{}, "adjustPaddingForOffscreenContent" | "scope" | keyof import("@tamagui/core").RNTamaguiViewNonStyleProps | keyof SheetStyleShorthandProps | keyof import("@tamagui/core").StackStyleBase>, import("@tamagui/core").StaticConfigPublic>;
    Background: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "disableHideBottomOverflow" | "scope" | keyof import("@tamagui/core").RNTamaguiViewNonStyleProps | keyof SheetStyleShorthandProps | keyof import("@tamagui/core").StackStyleBase> & Omit<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, never> & Omit<import("@tamagui/core").WithThemeValues<Omit<import("@tamagui/core").StackStyleBase, never>> & import("@tamagui/core").WithFlatVariantValues<{}> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>, keyof import("@tamagui/core").RNTamaguiViewNonStyleProps> & SheetStyleShorthandProps & ExtraBackgroundProps, "scope"> & {
        scope?: import("./types").SheetScopes;
    }, import("@tamagui/core").StackStyleBase, Omit<{}, "disableHideBottomOverflow" | "scope" | keyof import("@tamagui/core").RNTamaguiViewNonStyleProps | keyof SheetStyleShorthandProps | keyof import("@tamagui/core").StackStyleBase>, import("@tamagui/core").StaticConfigPublic>;
    Overlay: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "scope" | keyof import("@tamagui/core").RNTamaguiViewNonStyleProps | keyof SheetStyleShorthandProps | keyof import("@tamagui/core").StackStyleBase> & Omit<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, never> & Omit<import("@tamagui/core").WithThemeValues<Omit<import("@tamagui/core").StackStyleBase, never>> & import("@tamagui/core").WithFlatVariantValues<{}> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>, keyof import("@tamagui/core").RNTamaguiViewNonStyleProps> & SheetStyleShorthandProps, "scope"> & {
        scope?: import("./types").SheetScopes;
    }, import("@tamagui/core").StackStyleBase, Omit<{
        open?: boolean | undefined;
    }, "scope" | keyof import("@tamagui/core").RNTamaguiViewNonStyleProps | keyof SheetStyleShorthandProps | keyof import("@tamagui/core").StackStyleBase>, import("@tamagui/core").StaticConfigPublic>;
    Handle: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "scope" | keyof import("@tamagui/core").RNTamaguiViewNonStyleProps | keyof SheetStyleShorthandProps | keyof import("@tamagui/core").StackStyleBase> & Omit<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, never> & Omit<import("@tamagui/core").WithThemeValues<Omit<import("@tamagui/core").StackStyleBase, never>> & import("@tamagui/core").WithFlatVariantValues<{}> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>, keyof import("@tamagui/core").RNTamaguiViewNonStyleProps> & SheetStyleShorthandProps, "scope"> & {
        scope?: import("./types").SheetScopes;
    }, import("@tamagui/core").StackStyleBase, Omit<{
        open?: boolean | undefined;
    }, "scope" | keyof import("@tamagui/core").RNTamaguiViewNonStyleProps | keyof SheetStyleShorthandProps | keyof import("@tamagui/core").StackStyleBase>, import("@tamagui/core").StaticConfigPublic>;
    ScrollView: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").TamaguiComponentPropsBaseBase & Omit<import("@tamagui/scroll-view/types/WebScrollView").WebScrollViewProps, "ref"> & import("react").RefAttributes<import("@tamagui/scroll-view").ScrollViewRef>, import("@tamagui/core").StackStyleBase, {}>, string | number> & Omit<Omit<import("@tamagui/core").TamaguiComponentPropsBaseBase & Omit<import("@tamagui/scroll-view/types/WebScrollView").WebScrollViewProps, "ref"> & import("react").RefAttributes<import("@tamagui/scroll-view").ScrollViewRef>, never> & Omit<import("@tamagui/core").WithThemeValues<Omit<import("@tamagui/core").StackStyleBase, never>> & import("@tamagui/core").WithFlatVariantValues<{}> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>, string | number> & {
        h?: any;
        o?: any;
        pos?: any;
    }, "scope"> & {
        scope?: import("./types").SheetScopes;
    }, import("@tamagui/scroll-view").ScrollViewRef, Omit<import("@tamagui/core").TamaguiComponentPropsBaseBase & Omit<import("@tamagui/scroll-view/types/WebScrollView").WebScrollViewProps, "ref"> & import("react").RefAttributes<import("@tamagui/scroll-view").ScrollViewRef>, string | number> & Omit<Omit<import("@tamagui/core").TamaguiComponentPropsBaseBase & Omit<import("@tamagui/scroll-view/types/WebScrollView").WebScrollViewProps, "ref"> & import("react").RefAttributes<import("@tamagui/scroll-view").ScrollViewRef>, never> & Omit<import("@tamagui/core").WithThemeValues<Omit<import("@tamagui/core").StackStyleBase, never>> & import("@tamagui/core").WithFlatVariantValues<{}> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>, string | number> & {
        h?: any;
        o?: any;
        pos?: any;
    }, "scope"> & {
        scope?: import("./types").SheetScopes;
    }, import("@tamagui/core").StackStyleBase, Omit<{}, string | number>, {
        acceptsClassName: true;
        neverFlatten: true;
    }>;
}>;
export declare const Sheet: import("@tamagui/helpers").Combined<import("@tamagui/compose-refs").RefComponent<RNView, SheetProps>, {
    Container: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "adjustPaddingForOffscreenContent" | "scope" | keyof import("@tamagui/core").RNTamaguiViewNonStyleProps | keyof SheetStyleShorthandProps | keyof import("@tamagui/core").StackStyleBase> & Omit<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, never> & Omit<import("@tamagui/core").WithThemeValues<Omit<import("@tamagui/core").StackStyleBase, never>> & import("@tamagui/core").WithFlatVariantValues<{}> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>, keyof import("@tamagui/core").RNTamaguiViewNonStyleProps> & SheetStyleShorthandProps & ExtraContainerProps, "scope"> & {
        scope?: import("./types").SheetScopes;
    }, import("@tamagui/core").StackStyleBase, Omit<{}, "adjustPaddingForOffscreenContent" | "scope" | keyof import("@tamagui/core").RNTamaguiViewNonStyleProps | keyof SheetStyleShorthandProps | keyof import("@tamagui/core").StackStyleBase>, import("@tamagui/core").StaticConfigPublic>;
    Background: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "disableHideBottomOverflow" | "scope" | keyof import("@tamagui/core").RNTamaguiViewNonStyleProps | keyof SheetStyleShorthandProps | keyof import("@tamagui/core").StackStyleBase> & Omit<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, never> & Omit<import("@tamagui/core").WithThemeValues<Omit<import("@tamagui/core").StackStyleBase, never>> & import("@tamagui/core").WithFlatVariantValues<{}> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>, keyof import("@tamagui/core").RNTamaguiViewNonStyleProps> & SheetStyleShorthandProps & ExtraBackgroundProps, "scope"> & {
        scope?: import("./types").SheetScopes;
    }, import("@tamagui/core").StackStyleBase, Omit<{}, "disableHideBottomOverflow" | "scope" | keyof import("@tamagui/core").RNTamaguiViewNonStyleProps | keyof SheetStyleShorthandProps | keyof import("@tamagui/core").StackStyleBase>, import("@tamagui/core").StaticConfigPublic>;
    Overlay: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "scope" | keyof import("@tamagui/core").RNTamaguiViewNonStyleProps | keyof SheetStyleShorthandProps | keyof import("@tamagui/core").StackStyleBase> & Omit<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, never> & Omit<import("@tamagui/core").WithThemeValues<Omit<import("@tamagui/core").StackStyleBase, never>> & import("@tamagui/core").WithFlatVariantValues<{}> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>, keyof import("@tamagui/core").RNTamaguiViewNonStyleProps> & SheetStyleShorthandProps, "scope"> & {
        scope?: import("./types").SheetScopes;
    }, import("@tamagui/core").StackStyleBase, Omit<{
        open?: boolean | undefined;
    }, "scope" | keyof import("@tamagui/core").RNTamaguiViewNonStyleProps | keyof SheetStyleShorthandProps | keyof import("@tamagui/core").StackStyleBase>, import("@tamagui/core").StaticConfigPublic>;
    Handle: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "scope" | keyof import("@tamagui/core").RNTamaguiViewNonStyleProps | keyof SheetStyleShorthandProps | keyof import("@tamagui/core").StackStyleBase> & Omit<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, never> & Omit<import("@tamagui/core").WithThemeValues<Omit<import("@tamagui/core").StackStyleBase, never>> & import("@tamagui/core").WithFlatVariantValues<{}> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>, keyof import("@tamagui/core").RNTamaguiViewNonStyleProps> & SheetStyleShorthandProps, "scope"> & {
        scope?: import("./types").SheetScopes;
    }, import("@tamagui/core").StackStyleBase, Omit<{
        open?: boolean | undefined;
    }, "scope" | keyof import("@tamagui/core").RNTamaguiViewNonStyleProps | keyof SheetStyleShorthandProps | keyof import("@tamagui/core").StackStyleBase>, import("@tamagui/core").StaticConfigPublic>;
    ScrollView: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").TamaguiComponentPropsBaseBase & Omit<import("@tamagui/scroll-view/types/WebScrollView").WebScrollViewProps, "ref"> & import("react").RefAttributes<import("@tamagui/scroll-view").ScrollViewRef>, import("@tamagui/core").StackStyleBase, {}>, string | number> & Omit<Omit<import("@tamagui/core").TamaguiComponentPropsBaseBase & Omit<import("@tamagui/scroll-view/types/WebScrollView").WebScrollViewProps, "ref"> & import("react").RefAttributes<import("@tamagui/scroll-view").ScrollViewRef>, never> & Omit<import("@tamagui/core").WithThemeValues<Omit<import("@tamagui/core").StackStyleBase, never>> & import("@tamagui/core").WithFlatVariantValues<{}> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>, string | number> & {
        h?: any;
        o?: any;
        pos?: any;
    }, "scope"> & {
        scope?: import("./types").SheetScopes;
    }, import("@tamagui/scroll-view").ScrollViewRef, Omit<import("@tamagui/core").TamaguiComponentPropsBaseBase & Omit<import("@tamagui/scroll-view/types/WebScrollView").WebScrollViewProps, "ref"> & import("react").RefAttributes<import("@tamagui/scroll-view").ScrollViewRef>, string | number> & Omit<Omit<import("@tamagui/core").TamaguiComponentPropsBaseBase & Omit<import("@tamagui/scroll-view/types/WebScrollView").WebScrollViewProps, "ref"> & import("react").RefAttributes<import("@tamagui/scroll-view").ScrollViewRef>, never> & Omit<import("@tamagui/core").WithThemeValues<Omit<import("@tamagui/core").StackStyleBase, never>> & import("@tamagui/core").WithFlatVariantValues<{}> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>, string | number> & {
        h?: any;
        o?: any;
        pos?: any;
    }, "scope"> & {
        scope?: import("./types").SheetScopes;
    }, import("@tamagui/core").StackStyleBase, Omit<{}, string | number>, {
        acceptsClassName: true;
        neverFlatten: true;
    }>;
    Root: import("@tamagui/compose-refs").RefComponent<RNView, SheetProps>;
    Controlled: import("@tamagui/helpers").Combined<FunctionComponent<Omit<SheetProps, "onOpenChange" | "open"> & {
        ref?: Ref<RNView>;
    }>, {
        Container: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "adjustPaddingForOffscreenContent" | "scope" | keyof import("@tamagui/core").RNTamaguiViewNonStyleProps | keyof SheetStyleShorthandProps | keyof import("@tamagui/core").StackStyleBase> & Omit<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, never> & Omit<import("@tamagui/core").WithThemeValues<Omit<import("@tamagui/core").StackStyleBase, never>> & import("@tamagui/core").WithFlatVariantValues<{}> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>, keyof import("@tamagui/core").RNTamaguiViewNonStyleProps> & SheetStyleShorthandProps & ExtraContainerProps, "scope"> & {
            scope?: import("./types").SheetScopes;
        }, import("@tamagui/core").StackStyleBase, Omit<{}, "adjustPaddingForOffscreenContent" | "scope" | keyof import("@tamagui/core").RNTamaguiViewNonStyleProps | keyof SheetStyleShorthandProps | keyof import("@tamagui/core").StackStyleBase>, import("@tamagui/core").StaticConfigPublic>;
        Background: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "disableHideBottomOverflow" | "scope" | keyof import("@tamagui/core").RNTamaguiViewNonStyleProps | keyof SheetStyleShorthandProps | keyof import("@tamagui/core").StackStyleBase> & Omit<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, never> & Omit<import("@tamagui/core").WithThemeValues<Omit<import("@tamagui/core").StackStyleBase, never>> & import("@tamagui/core").WithFlatVariantValues<{}> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>, keyof import("@tamagui/core").RNTamaguiViewNonStyleProps> & SheetStyleShorthandProps & ExtraBackgroundProps, "scope"> & {
            scope?: import("./types").SheetScopes;
        }, import("@tamagui/core").StackStyleBase, Omit<{}, "disableHideBottomOverflow" | "scope" | keyof import("@tamagui/core").RNTamaguiViewNonStyleProps | keyof SheetStyleShorthandProps | keyof import("@tamagui/core").StackStyleBase>, import("@tamagui/core").StaticConfigPublic>;
        Overlay: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "scope" | keyof import("@tamagui/core").RNTamaguiViewNonStyleProps | keyof SheetStyleShorthandProps | keyof import("@tamagui/core").StackStyleBase> & Omit<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, never> & Omit<import("@tamagui/core").WithThemeValues<Omit<import("@tamagui/core").StackStyleBase, never>> & import("@tamagui/core").WithFlatVariantValues<{}> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>, keyof import("@tamagui/core").RNTamaguiViewNonStyleProps> & SheetStyleShorthandProps, "scope"> & {
            scope?: import("./types").SheetScopes;
        }, import("@tamagui/core").StackStyleBase, Omit<{
            open?: boolean | undefined;
        }, "scope" | keyof import("@tamagui/core").RNTamaguiViewNonStyleProps | keyof SheetStyleShorthandProps | keyof import("@tamagui/core").StackStyleBase>, import("@tamagui/core").StaticConfigPublic>;
        Handle: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "scope" | keyof import("@tamagui/core").RNTamaguiViewNonStyleProps | keyof SheetStyleShorthandProps | keyof import("@tamagui/core").StackStyleBase> & Omit<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, never> & Omit<import("@tamagui/core").WithThemeValues<Omit<import("@tamagui/core").StackStyleBase, never>> & import("@tamagui/core").WithFlatVariantValues<{}> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>, keyof import("@tamagui/core").RNTamaguiViewNonStyleProps> & SheetStyleShorthandProps, "scope"> & {
            scope?: import("./types").SheetScopes;
        }, import("@tamagui/core").StackStyleBase, Omit<{
            open?: boolean | undefined;
        }, "scope" | keyof import("@tamagui/core").RNTamaguiViewNonStyleProps | keyof SheetStyleShorthandProps | keyof import("@tamagui/core").StackStyleBase>, import("@tamagui/core").StaticConfigPublic>;
        ScrollView: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").TamaguiComponentPropsBaseBase & Omit<import("@tamagui/scroll-view/types/WebScrollView").WebScrollViewProps, "ref"> & import("react").RefAttributes<import("@tamagui/scroll-view").ScrollViewRef>, import("@tamagui/core").StackStyleBase, {}>, string | number> & Omit<Omit<import("@tamagui/core").TamaguiComponentPropsBaseBase & Omit<import("@tamagui/scroll-view/types/WebScrollView").WebScrollViewProps, "ref"> & import("react").RefAttributes<import("@tamagui/scroll-view").ScrollViewRef>, never> & Omit<import("@tamagui/core").WithThemeValues<Omit<import("@tamagui/core").StackStyleBase, never>> & import("@tamagui/core").WithFlatVariantValues<{}> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>, string | number> & {
            h?: any;
            o?: any;
            pos?: any;
        }, "scope"> & {
            scope?: import("./types").SheetScopes;
        }, import("@tamagui/scroll-view").ScrollViewRef, Omit<import("@tamagui/core").TamaguiComponentPropsBaseBase & Omit<import("@tamagui/scroll-view/types/WebScrollView").WebScrollViewProps, "ref"> & import("react").RefAttributes<import("@tamagui/scroll-view").ScrollViewRef>, string | number> & Omit<Omit<import("@tamagui/core").TamaguiComponentPropsBaseBase & Omit<import("@tamagui/scroll-view/types/WebScrollView").WebScrollViewProps, "ref"> & import("react").RefAttributes<import("@tamagui/scroll-view").ScrollViewRef>, never> & Omit<import("@tamagui/core").WithThemeValues<Omit<import("@tamagui/core").StackStyleBase, never>> & import("@tamagui/core").WithFlatVariantValues<{}> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>, string | number> & {
            h?: any;
            o?: any;
            pos?: any;
        }, "scope"> & {
            scope?: import("./types").SheetScopes;
        }, import("@tamagui/core").StackStyleBase, Omit<{}, string | number>, {
            acceptsClassName: true;
            neverFlatten: true;
        }>;
    }>;
    useAnimatedPosition: typeof useAnimatedPosition;
}>;
//# sourceMappingURL=Sheet.d.ts.map
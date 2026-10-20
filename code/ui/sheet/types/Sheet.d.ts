import { type TamaguiElement } from '@tamagui/core';
import type { FunctionComponent, Ref } from 'react';
import type { ViewInstance as RNView } from '@tamagui/react-native-types';
import { useAnimatedPosition } from './SheetContext';
import type { SheetProps } from './types';
export * from './types';
export declare const SheetHandle: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "scope"> & Omit<{}, "scope"> & {
    scope?: import("./types").SheetScopes;
}, import("@tamagui/web").StackStyleBase, Omit<{
    open?: boolean | undefined;
}, "scope">, import("@tamagui/web").StaticConfigPublic>;
export declare const SheetOverlay: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "scope"> & Omit<{}, "scope"> & {
    scope?: import("./types").SheetScopes;
}, import("@tamagui/web").StackStyleBase, Omit<{
    open?: boolean | undefined;
}, "scope">, import("@tamagui/web").StaticConfigPublic>;
type ExtraContainerProps = {
    /**
     * Adds padding accounting for the currently offscreen content, so if you put a flex element inside
     * the sheet, it will always flex to the height of the visible amount of the sheet. If this is not
     * turned on, the inner content is always set to the max height of the sheet.
     */
    adjustPaddingForOffscreenContent?: boolean;
};
export declare const SheetContainer: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "adjustPaddingForOffscreenContent" | "scope"> & Omit<ExtraContainerProps, "scope"> & {
    scope?: import("./types").SheetScopes;
}, import("@tamagui/web").StackStyleBase, Omit<{}, "adjustPaddingForOffscreenContent" | "scope">, import("@tamagui/web").StaticConfigPublic>;
type ExtraBackgroundProps = {
    /**
     * Disables the default background extension below the sheet. Leave this off
     * when a spring can overshoot on open so page content never shows through.
     */
    disableHideBottomOverflow?: boolean;
};
export declare const SheetBackground: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "disableHideBottomOverflow" | "scope"> & Omit<ExtraBackgroundProps, "scope"> & {
    scope?: import("./types").SheetScopes;
}, import("@tamagui/web").StackStyleBase, Omit<{}, "disableHideBottomOverflow" | "scope">, import("@tamagui/web").StaticConfigPublic>;
export declare const SheetRoot: import("@tamagui/compose-refs").RefComponent<RNView, SheetProps>;
export declare const SheetControlled: import("@tamagui/helpers").Combined<FunctionComponent<Omit<SheetProps, "onOpenChange" | "open"> & {
    ref?: Ref<RNView>;
}>, {
    Container: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "adjustPaddingForOffscreenContent" | "scope"> & Omit<ExtraContainerProps, "scope"> & {
        scope?: import("./types").SheetScopes;
    }, import("@tamagui/web").StackStyleBase, Omit<{}, "adjustPaddingForOffscreenContent" | "scope">, import("@tamagui/web").StaticConfigPublic>;
    Background: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "disableHideBottomOverflow" | "scope"> & Omit<ExtraBackgroundProps, "scope"> & {
        scope?: import("./types").SheetScopes;
    }, import("@tamagui/web").StackStyleBase, Omit<{}, "disableHideBottomOverflow" | "scope">, import("@tamagui/web").StaticConfigPublic>;
    Overlay: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "scope"> & Omit<{}, "scope"> & {
        scope?: import("./types").SheetScopes;
    }, import("@tamagui/web").StackStyleBase, Omit<{
        open?: boolean | undefined;
    }, "scope">, import("@tamagui/web").StaticConfigPublic>;
    Handle: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "scope"> & Omit<{}, "scope"> & {
        scope?: import("./types").SheetScopes;
    }, import("@tamagui/web").StackStyleBase, Omit<{
        open?: boolean | undefined;
    }, "scope">, import("@tamagui/web").StaticConfigPublic>;
    ScrollView: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, import("@tamagui/scroll-view").ScrollViewRef, Omit<import("@tamagui/web").TamaguiComponentPropsBaseBase & Omit<import("@tamagui/web").StackNonStyleProps, keyof import("@tamagui/react-native-types").ScrollViewProps> & import("@tamagui/web").RNViewProps & Omit<import("@tamagui/react-native-types").ScrollViewProps, "contentContainerStyle" | "keyboardShouldPersistTaps" | "onMomentumScrollBegin" | "onMomentumScrollEnd" | "onScroll" | "onScrollBeginDrag" | "onScrollEndDrag" | "onScrollToTop" | "refreshControl" | "style"> & {
        style?: import("@tamagui/web").StackNonStyleProps['style'];
        contentContainerStyle?: import("@tamagui/web").StylePiece | import("@tamagui/web").StackNonStyleProps['style'];
        refreshControl?: React.ReactElement<{
            style?: import("@tamagui/web").StackNonStyleProps['style'];
        }>;
        keyboardShouldPersistTaps?: boolean | 'always' | 'never' | 'handled';
        onScroll?: import("@tamagui/scroll-view").WebScrollEventHandler;
        onScrollToTop?: import("@tamagui/scroll-view").WebScrollEventHandler;
        onScrollBeginDrag?: import("@tamagui/scroll-view").WebScrollEventHandler;
        onScrollEndDrag?: import("@tamagui/scroll-view").WebScrollEventHandler;
        onMomentumScrollBegin?: import("@tamagui/scroll-view").WebScrollEventHandler;
        onMomentumScrollEnd?: import("@tamagui/scroll-view").WebScrollEventHandler;
    } & import("react").RefAttributes<import("@tamagui/scroll-view").ScrollViewRef>, "scope"> & Omit<{}, "scope"> & {
        scope?: import("./types").SheetScopes;
    }, import("@tamagui/web").StackStyleBase, Omit<{}, "scope">, {
        acceptsClassName: true;
        neverFlatten: true;
    }>;
}>;
export declare const Sheet: import("@tamagui/helpers").Combined<import("@tamagui/compose-refs").RefComponent<RNView, SheetProps>, {
    Container: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "adjustPaddingForOffscreenContent" | "scope"> & Omit<ExtraContainerProps, "scope"> & {
        scope?: import("./types").SheetScopes;
    }, import("@tamagui/web").StackStyleBase, Omit<{}, "adjustPaddingForOffscreenContent" | "scope">, import("@tamagui/web").StaticConfigPublic>;
    Background: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "disableHideBottomOverflow" | "scope"> & Omit<ExtraBackgroundProps, "scope"> & {
        scope?: import("./types").SheetScopes;
    }, import("@tamagui/web").StackStyleBase, Omit<{}, "disableHideBottomOverflow" | "scope">, import("@tamagui/web").StaticConfigPublic>;
    Overlay: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "scope"> & Omit<{}, "scope"> & {
        scope?: import("./types").SheetScopes;
    }, import("@tamagui/web").StackStyleBase, Omit<{
        open?: boolean | undefined;
    }, "scope">, import("@tamagui/web").StaticConfigPublic>;
    Handle: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "scope"> & Omit<{}, "scope"> & {
        scope?: import("./types").SheetScopes;
    }, import("@tamagui/web").StackStyleBase, Omit<{
        open?: boolean | undefined;
    }, "scope">, import("@tamagui/web").StaticConfigPublic>;
    ScrollView: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, import("@tamagui/scroll-view").ScrollViewRef, Omit<import("@tamagui/web").TamaguiComponentPropsBaseBase & Omit<import("@tamagui/web").StackNonStyleProps, keyof import("@tamagui/react-native-types").ScrollViewProps> & import("@tamagui/web").RNViewProps & Omit<import("@tamagui/react-native-types").ScrollViewProps, "contentContainerStyle" | "keyboardShouldPersistTaps" | "onMomentumScrollBegin" | "onMomentumScrollEnd" | "onScroll" | "onScrollBeginDrag" | "onScrollEndDrag" | "onScrollToTop" | "refreshControl" | "style"> & {
        style?: import("@tamagui/web").StackNonStyleProps['style'];
        contentContainerStyle?: import("@tamagui/web").StylePiece | import("@tamagui/web").StackNonStyleProps['style'];
        refreshControl?: React.ReactElement<{
            style?: import("@tamagui/web").StackNonStyleProps['style'];
        }>;
        keyboardShouldPersistTaps?: boolean | 'always' | 'never' | 'handled';
        onScroll?: import("@tamagui/scroll-view").WebScrollEventHandler;
        onScrollToTop?: import("@tamagui/scroll-view").WebScrollEventHandler;
        onScrollBeginDrag?: import("@tamagui/scroll-view").WebScrollEventHandler;
        onScrollEndDrag?: import("@tamagui/scroll-view").WebScrollEventHandler;
        onMomentumScrollBegin?: import("@tamagui/scroll-view").WebScrollEventHandler;
        onMomentumScrollEnd?: import("@tamagui/scroll-view").WebScrollEventHandler;
    } & import("react").RefAttributes<import("@tamagui/scroll-view").ScrollViewRef>, "scope"> & Omit<{}, "scope"> & {
        scope?: import("./types").SheetScopes;
    }, import("@tamagui/web").StackStyleBase, Omit<{}, "scope">, {
        acceptsClassName: true;
        neverFlatten: true;
    }>;
    Root: import("@tamagui/compose-refs").RefComponent<RNView, SheetProps>;
    Controlled: import("@tamagui/helpers").Combined<FunctionComponent<Omit<SheetProps, "onOpenChange" | "open"> & {
        ref?: Ref<RNView>;
    }>, {
        Container: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "adjustPaddingForOffscreenContent" | "scope"> & Omit<ExtraContainerProps, "scope"> & {
            scope?: import("./types").SheetScopes;
        }, import("@tamagui/web").StackStyleBase, Omit<{}, "adjustPaddingForOffscreenContent" | "scope">, import("@tamagui/web").StaticConfigPublic>;
        Background: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "disableHideBottomOverflow" | "scope"> & Omit<ExtraBackgroundProps, "scope"> & {
            scope?: import("./types").SheetScopes;
        }, import("@tamagui/web").StackStyleBase, Omit<{}, "disableHideBottomOverflow" | "scope">, import("@tamagui/web").StaticConfigPublic>;
        Overlay: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "scope"> & Omit<{}, "scope"> & {
            scope?: import("./types").SheetScopes;
        }, import("@tamagui/web").StackStyleBase, Omit<{
            open?: boolean | undefined;
        }, "scope">, import("@tamagui/web").StaticConfigPublic>;
        Handle: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "scope"> & Omit<{}, "scope"> & {
            scope?: import("./types").SheetScopes;
        }, import("@tamagui/web").StackStyleBase, Omit<{
            open?: boolean | undefined;
        }, "scope">, import("@tamagui/web").StaticConfigPublic>;
        ScrollView: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, import("@tamagui/scroll-view").ScrollViewRef, Omit<import("@tamagui/web").TamaguiComponentPropsBaseBase & Omit<import("@tamagui/web").StackNonStyleProps, keyof import("@tamagui/react-native-types").ScrollViewProps> & import("@tamagui/web").RNViewProps & Omit<import("@tamagui/react-native-types").ScrollViewProps, "contentContainerStyle" | "keyboardShouldPersistTaps" | "onMomentumScrollBegin" | "onMomentumScrollEnd" | "onScroll" | "onScrollBeginDrag" | "onScrollEndDrag" | "onScrollToTop" | "refreshControl" | "style"> & {
            style?: import("@tamagui/web").StackNonStyleProps['style'];
            contentContainerStyle?: import("@tamagui/web").StylePiece | import("@tamagui/web").StackNonStyleProps['style'];
            refreshControl?: React.ReactElement<{
                style?: import("@tamagui/web").StackNonStyleProps['style'];
            }>;
            keyboardShouldPersistTaps?: boolean | 'always' | 'never' | 'handled';
            onScroll?: import("@tamagui/scroll-view").WebScrollEventHandler;
            onScrollToTop?: import("@tamagui/scroll-view").WebScrollEventHandler;
            onScrollBeginDrag?: import("@tamagui/scroll-view").WebScrollEventHandler;
            onScrollEndDrag?: import("@tamagui/scroll-view").WebScrollEventHandler;
            onMomentumScrollBegin?: import("@tamagui/scroll-view").WebScrollEventHandler;
            onMomentumScrollEnd?: import("@tamagui/scroll-view").WebScrollEventHandler;
        } & import("react").RefAttributes<import("@tamagui/scroll-view").ScrollViewRef>, "scope"> & Omit<{}, "scope"> & {
            scope?: import("./types").SheetScopes;
        }, import("@tamagui/web").StackStyleBase, Omit<{}, "scope">, {
            acceptsClassName: true;
            neverFlatten: true;
        }>;
    }>;
    useAnimatedPosition: typeof useAnimatedPosition;
}>;
//# sourceMappingURL=Sheet.d.ts.map
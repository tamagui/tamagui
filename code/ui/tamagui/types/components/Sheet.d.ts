import { type Combined } from '@tamagui/core';
import { Sheet as SheetBehavior, type SheetProps } from '@tamagui/sheet';
export declare const SheetHandle: import("@tamagui/core").RefComponent<import("@tamagui/core").TamaguiElement, import("@tamagui/core").GetFinalProps<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "scope"> & Omit<{}, "scope"> & {
    scope?: import("@tamagui/sheet").SheetScopes;
}, import("@tamagui/core").StackStyleBase, {
    open?: boolean | undefined;
}>>;
export declare const SheetOverlay: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "scope"> & Omit<{}, "scope"> & {
    scope?: import("@tamagui/sheet").SheetScopes;
}, import("@tamagui/core").StackStyleBase, Omit<{
    open?: boolean | undefined;
}, "scope">, import("@tamagui/core").StaticConfigPublic>;
export declare const SheetContainer: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "adjustPaddingForOffscreenContent" | "scope"> & Omit<{
    adjustPaddingForOffscreenContent?: boolean;
}, "scope"> & {
    scope?: import("@tamagui/sheet").SheetScopes;
}, import("@tamagui/core").StackStyleBase, Omit<{}, "adjustPaddingForOffscreenContent" | "scope">, import("@tamagui/core").StaticConfigPublic>;
export declare const SheetBackground: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "disableHideBottomOverflow" | "scope"> & Omit<{
    disableHideBottomOverflow?: boolean;
}, "scope"> & {
    scope?: import("@tamagui/sheet").SheetScopes;
}, import("@tamagui/core").StackStyleBase, Omit<{}, "disableHideBottomOverflow" | "scope">, import("@tamagui/core").StaticConfigPublic>;
export declare const SheetScrollView: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/scroll-view").ScrollViewRef, Omit<import("@tamagui/core").TamaguiComponentPropsBaseBase & Omit<import("@tamagui/core").StackNonStyleProps, "onScroll" | "style"> & import("@tamagui/core").RNViewProps & Omit<import("@tamagui/react-native-types/src").ScrollViewProps, "contentContainerStyle" | "keyboardShouldPersistTaps" | "onMomentumScrollBegin" | "onMomentumScrollEnd" | "onScrollBeginDrag" | "onScrollEndDrag" | "onScrollToTop" | "refreshControl" | keyof import("@tamagui/core").RNViewProps | keyof import("@tamagui/core").StackNonStyleProps> & {
    style?: import("@tamagui/core").StackNonStyleProps['style'];
    contentContainerStyle?: import("@tamagui/core").StylePiece | import("@tamagui/core").StackNonStyleProps['style'];
    refreshControl?: React.ReactElement<{
        style?: import("@tamagui/core").StackNonStyleProps['style'];
    }>;
    keyboardShouldPersistTaps?: boolean | 'always' | 'never' | 'handled';
    onScroll?: import("@tamagui/scroll-view").WebScrollEventHandler;
    onScrollToTop?: import("@tamagui/scroll-view").WebScrollEventHandler;
    onScrollBeginDrag?: import("@tamagui/scroll-view").WebScrollEventHandler;
    onScrollEndDrag?: import("@tamagui/scroll-view").WebScrollEventHandler;
    onMomentumScrollBegin?: import("@tamagui/scroll-view").WebScrollEventHandler;
    onMomentumScrollEnd?: import("@tamagui/scroll-view").WebScrollEventHandler;
} & import("react").RefAttributes<import("@tamagui/scroll-view").ScrollViewRef>, "scope"> & Omit<{}, "scope"> & {
    scope?: import("@tamagui/sheet").SheetScopes;
}, import("@tamagui/core").StackStyleBase, Omit<{}, "scope">, {
    acceptsClassName: true;
    neverFlatten: true;
} & import("@tamagui/core").StaticConfigPublic>;
declare const sheetParts: {
    Container: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "adjustPaddingForOffscreenContent" | "scope"> & Omit<{
        adjustPaddingForOffscreenContent?: boolean;
    }, "scope"> & {
        scope?: import("@tamagui/sheet").SheetScopes;
    }, import("@tamagui/core").StackStyleBase, Omit<{}, "adjustPaddingForOffscreenContent" | "scope">, import("@tamagui/core").StaticConfigPublic>;
    Background: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "disableHideBottomOverflow" | "scope"> & Omit<{
        disableHideBottomOverflow?: boolean;
    }, "scope"> & {
        scope?: import("@tamagui/sheet").SheetScopes;
    }, import("@tamagui/core").StackStyleBase, Omit<{}, "disableHideBottomOverflow" | "scope">, import("@tamagui/core").StaticConfigPublic>;
    Overlay: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "scope"> & Omit<{}, "scope"> & {
        scope?: import("@tamagui/sheet").SheetScopes;
    }, import("@tamagui/core").StackStyleBase, Omit<{
        open?: boolean | undefined;
    }, "scope">, import("@tamagui/core").StaticConfigPublic>;
    Handle: import("@tamagui/core").RefComponent<import("@tamagui/core").TamaguiElement, import("@tamagui/core").GetFinalProps<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "scope"> & Omit<{}, "scope"> & {
        scope?: import("@tamagui/sheet").SheetScopes;
    }, import("@tamagui/core").StackStyleBase, {
        open?: boolean | undefined;
    }>>;
    ScrollView: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/scroll-view").ScrollViewRef, Omit<import("@tamagui/core").TamaguiComponentPropsBaseBase & Omit<import("@tamagui/core").StackNonStyleProps, "onScroll" | "style"> & import("@tamagui/core").RNViewProps & Omit<import("@tamagui/react-native-types/src").ScrollViewProps, "contentContainerStyle" | "keyboardShouldPersistTaps" | "onMomentumScrollBegin" | "onMomentumScrollEnd" | "onScrollBeginDrag" | "onScrollEndDrag" | "onScrollToTop" | "refreshControl" | keyof import("@tamagui/core").RNViewProps | keyof import("@tamagui/core").StackNonStyleProps> & {
        style?: import("@tamagui/core").StackNonStyleProps['style'];
        contentContainerStyle?: import("@tamagui/core").StylePiece | import("@tamagui/core").StackNonStyleProps['style'];
        refreshControl?: React.ReactElement<{
            style?: import("@tamagui/core").StackNonStyleProps['style'];
        }>;
        keyboardShouldPersistTaps?: boolean | 'always' | 'never' | 'handled';
        onScroll?: import("@tamagui/scroll-view").WebScrollEventHandler;
        onScrollToTop?: import("@tamagui/scroll-view").WebScrollEventHandler;
        onScrollBeginDrag?: import("@tamagui/scroll-view").WebScrollEventHandler;
        onScrollEndDrag?: import("@tamagui/scroll-view").WebScrollEventHandler;
        onMomentumScrollBegin?: import("@tamagui/scroll-view").WebScrollEventHandler;
        onMomentumScrollEnd?: import("@tamagui/scroll-view").WebScrollEventHandler;
    } & import("react").RefAttributes<import("@tamagui/scroll-view").ScrollViewRef>, "scope"> & Omit<{}, "scope"> & {
        scope?: import("@tamagui/sheet").SheetScopes;
    }, import("@tamagui/core").StackStyleBase, Omit<{}, "scope">, {
        acceptsClassName: true;
        neverFlatten: true;
    } & import("@tamagui/core").StaticConfigPublic>;
};
export declare const SheetRoot: import("@tamagui/core").RefComponent<import("@tamagui/react-native-types/src").ViewInstance, SheetProps>;
export declare const SheetControlled: Combined<import("@tamagui/core").RefComponent<import("@tamagui/react-native-types/src").ViewInstance, Omit<SheetProps, "onOpenChange" | "open">>, {
    Container: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "adjustPaddingForOffscreenContent" | "scope"> & Omit<{
        adjustPaddingForOffscreenContent?: boolean;
    }, "scope"> & {
        scope?: import("@tamagui/sheet").SheetScopes;
    }, import("@tamagui/core").StackStyleBase, Omit<{}, "adjustPaddingForOffscreenContent" | "scope">, import("@tamagui/core").StaticConfigPublic>;
    Background: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "disableHideBottomOverflow" | "scope"> & Omit<{
        disableHideBottomOverflow?: boolean;
    }, "scope"> & {
        scope?: import("@tamagui/sheet").SheetScopes;
    }, import("@tamagui/core").StackStyleBase, Omit<{}, "disableHideBottomOverflow" | "scope">, import("@tamagui/core").StaticConfigPublic>;
    Overlay: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "scope"> & Omit<{}, "scope"> & {
        scope?: import("@tamagui/sheet").SheetScopes;
    }, import("@tamagui/core").StackStyleBase, Omit<{
        open?: boolean | undefined;
    }, "scope">, import("@tamagui/core").StaticConfigPublic>;
    Handle: import("@tamagui/core").RefComponent<import("@tamagui/core").TamaguiElement, import("@tamagui/core").GetFinalProps<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "scope"> & Omit<{}, "scope"> & {
        scope?: import("@tamagui/sheet").SheetScopes;
    }, import("@tamagui/core").StackStyleBase, {
        open?: boolean | undefined;
    }>>;
    ScrollView: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/scroll-view").ScrollViewRef, Omit<import("@tamagui/core").TamaguiComponentPropsBaseBase & Omit<import("@tamagui/core").StackNonStyleProps, "onScroll" | "style"> & import("@tamagui/core").RNViewProps & Omit<import("@tamagui/react-native-types/src").ScrollViewProps, "contentContainerStyle" | "keyboardShouldPersistTaps" | "onMomentumScrollBegin" | "onMomentumScrollEnd" | "onScrollBeginDrag" | "onScrollEndDrag" | "onScrollToTop" | "refreshControl" | keyof import("@tamagui/core").RNViewProps | keyof import("@tamagui/core").StackNonStyleProps> & {
        style?: import("@tamagui/core").StackNonStyleProps['style'];
        contentContainerStyle?: import("@tamagui/core").StylePiece | import("@tamagui/core").StackNonStyleProps['style'];
        refreshControl?: React.ReactElement<{
            style?: import("@tamagui/core").StackNonStyleProps['style'];
        }>;
        keyboardShouldPersistTaps?: boolean | 'always' | 'never' | 'handled';
        onScroll?: import("@tamagui/scroll-view").WebScrollEventHandler;
        onScrollToTop?: import("@tamagui/scroll-view").WebScrollEventHandler;
        onScrollBeginDrag?: import("@tamagui/scroll-view").WebScrollEventHandler;
        onScrollEndDrag?: import("@tamagui/scroll-view").WebScrollEventHandler;
        onMomentumScrollBegin?: import("@tamagui/scroll-view").WebScrollEventHandler;
        onMomentumScrollEnd?: import("@tamagui/scroll-view").WebScrollEventHandler;
    } & import("react").RefAttributes<import("@tamagui/scroll-view").ScrollViewRef>, "scope"> & Omit<{}, "scope"> & {
        scope?: import("@tamagui/sheet").SheetScopes;
    }, import("@tamagui/core").StackStyleBase, Omit<{}, "scope">, {
        acceptsClassName: true;
        neverFlatten: true;
    } & import("@tamagui/core").StaticConfigPublic>;
}>;
export declare const Sheet: Combined<typeof SheetRoot, typeof sheetParts & {
    Root: typeof SheetRoot;
    Controlled: typeof SheetControlled;
    useAnimatedPosition: typeof SheetBehavior.useAnimatedPosition;
}>;
export {};
//# sourceMappingURL=Sheet.d.ts.map
import { type Combined } from '@tamagui/core';
import { Sheet as SheetBehavior, type SheetProps } from '@tamagui/sheet';
export declare const SheetHandle: import("@tamagui/compose-refs").RefComponent<import("@tamagui/web").TamaguiElement, import("@tamagui/web").GetFinalProps<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "scope"> & Omit<{}, "scope"> & {
    scope?: import("@tamagui/sheet").SheetScopes;
}, import("@tamagui/web").StackStyleBase, {
    open?: boolean | undefined;
}>>;
export declare const SheetOverlay: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, import("@tamagui/web").TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "scope"> & Omit<{}, "scope"> & {
    scope?: import("@tamagui/sheet").SheetScopes;
}, import("@tamagui/web").StackStyleBase, Omit<{
    open?: boolean | undefined;
}, "scope">, import("@tamagui/web").StaticConfigPublic>;
export declare const SheetContainer: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, import("@tamagui/web").TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "adjustPaddingForOffscreenContent" | "scope"> & Omit<{
    adjustPaddingForOffscreenContent?: boolean;
}, "scope"> & {
    scope?: import("@tamagui/sheet").SheetScopes;
}, import("@tamagui/web").StackStyleBase, Omit<{}, "adjustPaddingForOffscreenContent" | "scope">, import("@tamagui/web").StaticConfigPublic>;
export declare const SheetBackground: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, import("@tamagui/web").TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "disableHideBottomOverflow" | "scope"> & Omit<{
    disableHideBottomOverflow?: boolean;
}, "scope"> & {
    scope?: import("@tamagui/sheet").SheetScopes;
}, import("@tamagui/web").StackStyleBase, Omit<{}, "disableHideBottomOverflow" | "scope">, import("@tamagui/web").StaticConfigPublic>;
export declare const SheetScrollView: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, import("@tamagui/scroll-view").ScrollViewRef, Omit<import("@tamagui/web").TamaguiComponentPropsBaseBase & Omit<import("@tamagui/web").StackNonStyleProps, keyof import("@tamagui/react-native-types").ScrollViewProps> & import("@tamagui/web").RNViewProps & Omit<import("@tamagui/react-native-types").ScrollViewProps, "contentContainerStyle" | "keyboardShouldPersistTaps" | "onMomentumScrollBegin" | "onMomentumScrollEnd" | "onScroll" | "onScrollBeginDrag" | "onScrollEndDrag" | "onScrollToTop" | "refreshControl" | "style"> & {
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
    scope?: import("@tamagui/sheet").SheetScopes;
}, import("@tamagui/web").StackStyleBase, Omit<{}, "scope">, {
    acceptsClassName: true;
    neverFlatten: true;
} & import("@tamagui/web").StaticConfigPublic>;
declare const sheetParts: {
    Container: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, import("@tamagui/web").TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "adjustPaddingForOffscreenContent" | "scope"> & Omit<{
        adjustPaddingForOffscreenContent?: boolean;
    }, "scope"> & {
        scope?: import("@tamagui/sheet").SheetScopes;
    }, import("@tamagui/web").StackStyleBase, Omit<{}, "adjustPaddingForOffscreenContent" | "scope">, import("@tamagui/web").StaticConfigPublic>;
    Background: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, import("@tamagui/web").TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "disableHideBottomOverflow" | "scope"> & Omit<{
        disableHideBottomOverflow?: boolean;
    }, "scope"> & {
        scope?: import("@tamagui/sheet").SheetScopes;
    }, import("@tamagui/web").StackStyleBase, Omit<{}, "disableHideBottomOverflow" | "scope">, import("@tamagui/web").StaticConfigPublic>;
    Overlay: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, import("@tamagui/web").TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "scope"> & Omit<{}, "scope"> & {
        scope?: import("@tamagui/sheet").SheetScopes;
    }, import("@tamagui/web").StackStyleBase, Omit<{
        open?: boolean | undefined;
    }, "scope">, import("@tamagui/web").StaticConfigPublic>;
    Handle: import("@tamagui/compose-refs").RefComponent<import("@tamagui/web").TamaguiElement, import("@tamagui/web").GetFinalProps<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "scope"> & Omit<{}, "scope"> & {
        scope?: import("@tamagui/sheet").SheetScopes;
    }, import("@tamagui/web").StackStyleBase, {
        open?: boolean | undefined;
    }>>;
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
        scope?: import("@tamagui/sheet").SheetScopes;
    }, import("@tamagui/web").StackStyleBase, Omit<{}, "scope">, {
        acceptsClassName: true;
        neverFlatten: true;
    } & import("@tamagui/web").StaticConfigPublic>;
};
export declare const SheetRoot: import("@tamagui/compose-refs").RefComponent<import("@tamagui/react-native-types").ViewInstance, SheetProps>;
export declare const SheetControlled: Combined<import("@tamagui/compose-refs").RefComponent<import("@tamagui/react-native-types").ViewInstance, Omit<SheetProps, "onOpenChange" | "open">>, {
    Container: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, import("@tamagui/web").TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "adjustPaddingForOffscreenContent" | "scope"> & Omit<{
        adjustPaddingForOffscreenContent?: boolean;
    }, "scope"> & {
        scope?: import("@tamagui/sheet").SheetScopes;
    }, import("@tamagui/web").StackStyleBase, Omit<{}, "adjustPaddingForOffscreenContent" | "scope">, import("@tamagui/web").StaticConfigPublic>;
    Background: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, import("@tamagui/web").TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "disableHideBottomOverflow" | "scope"> & Omit<{
        disableHideBottomOverflow?: boolean;
    }, "scope"> & {
        scope?: import("@tamagui/sheet").SheetScopes;
    }, import("@tamagui/web").StackStyleBase, Omit<{}, "disableHideBottomOverflow" | "scope">, import("@tamagui/web").StaticConfigPublic>;
    Overlay: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, import("@tamagui/web").TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "scope"> & Omit<{}, "scope"> & {
        scope?: import("@tamagui/sheet").SheetScopes;
    }, import("@tamagui/web").StackStyleBase, Omit<{
        open?: boolean | undefined;
    }, "scope">, import("@tamagui/web").StaticConfigPublic>;
    Handle: import("@tamagui/compose-refs").RefComponent<import("@tamagui/web").TamaguiElement, import("@tamagui/web").GetFinalProps<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "scope"> & Omit<{}, "scope"> & {
        scope?: import("@tamagui/sheet").SheetScopes;
    }, import("@tamagui/web").StackStyleBase, {
        open?: boolean | undefined;
    }>>;
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
        scope?: import("@tamagui/sheet").SheetScopes;
    }, import("@tamagui/web").StackStyleBase, Omit<{}, "scope">, {
        acceptsClassName: true;
        neverFlatten: true;
    } & import("@tamagui/web").StaticConfigPublic>;
}>;
export declare const Sheet: Combined<typeof SheetRoot, typeof sheetParts & {
    Root: typeof SheetRoot;
    Controlled: typeof SheetControlled;
    useAnimatedPosition: typeof SheetBehavior.useAnimatedPosition;
}>;
export {};
//# sourceMappingURL=Sheet.d.ts.map
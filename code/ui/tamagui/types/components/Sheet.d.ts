import { type SheetProps } from '@tamagui/sheet';
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
export declare const SheetScrollView: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/scroll-view").ScrollViewRef, Omit<import("@tamagui/core").TamaguiComponentPropsBaseBase & Omit<import("@tamagui/core").StackNonStyleProps, "onScroll" | "style"> & import("@tamagui/core").RNViewProps & {
    style?: import("@tamagui/core").StackNonStyleProps['style'];
    contentContainerStyle?: import("@tamagui/core").StylePiece | import("@tamagui/core").StackNonStyleProps['style'];
    horizontal?: boolean;
    onContentSizeChange?: (width: number, height: number) => void;
    onScroll?: (event: import("@tamagui/scroll-view").WebScrollEvent) => void;
    refreshControl?: React.ReactElement<{
        style?: import("@tamagui/core").StackNonStyleProps['style'];
    }>;
    stickyHeaderIndices?: number[];
    pagingEnabled?: boolean;
    centerContent?: boolean;
    scrollEnabled?: boolean;
    scrollEventThrottle?: number;
    showsHorizontalScrollIndicator?: boolean;
    showsVerticalScrollIndicator?: boolean;
    keyboardShouldPersistTaps?: boolean | 'always' | 'never' | 'handled';
    keyboardDismissMode?: 'none' | 'on-drag' | 'interactive';
    contentOffset?: {
        x: number;
        y: number;
    };
    contentInset?: import("@tamagui/core").Insets;
    contentInsetAdjustmentBehavior?: 'automatic' | 'scrollableAxes' | 'never' | 'always';
    decelerationRate?: number | 'normal' | 'fast';
    directionalLockEnabled?: boolean;
    disableIntervalMomentum?: boolean;
    disableScrollViewPanResponder?: boolean;
    endFillColor?: string;
    fadingEdgeLength?: number | {
        start: number;
        end: number;
    };
    indicatorStyle?: 'default' | 'black' | 'white';
    invertStickyHeaders?: boolean;
    maintainVisibleContentPosition?: {
        minIndexForVisible: number;
        autoscrollToTopThreshold?: number;
    };
    maximumZoomScale?: number;
    minimumZoomScale?: number;
    nestedScrollEnabled?: boolean;
    onScrollToTop?: (event: import("@tamagui/scroll-view").WebScrollEvent) => void;
    overScrollMode?: 'auto' | 'always' | 'never';
    pinchGestureEnabled?: boolean;
    removeClippedSubviews?: boolean;
    scrollIndicatorInsets?: import("@tamagui/core").Insets;
    scrollPerfTag?: string;
    scrollToOverflowEnabled?: boolean;
    snapToAlignment?: 'start' | 'center' | 'end';
    snapToEnd?: boolean;
    snapToInterval?: number;
    snapToOffsets?: number[];
    snapToStart?: boolean;
    bounces?: boolean;
    onScrollBeginDrag?: (event: import("@tamagui/scroll-view").WebScrollEvent) => void;
    onScrollEndDrag?: (event: import("@tamagui/scroll-view").WebScrollEvent) => void;
    onMomentumScrollBegin?: (event: import("@tamagui/scroll-view").WebScrollEvent) => void;
    onMomentumScrollEnd?: (event: import("@tamagui/scroll-view").WebScrollEvent) => void;
} & import("react").RefAttributes<import("@tamagui/scroll-view").ScrollViewRef>, "scope"> & Omit<{}, "scope"> & {
    scope?: import("@tamagui/sheet").SheetScopes;
}, import("@tamagui/core").StackStyleBase, Omit<{}, "scope">, {
    acceptsClassName: true;
    neverFlatten: true;
} & import("@tamagui/core").StaticConfigPublic>;
export declare const SheetRoot: import("@tamagui/core").RefComponent<import("@tamagui/react-native-types/src").ViewInstance, SheetProps>;
export declare const SheetControlled: import("@tamagui/core").Combined<import("@tamagui/core").RefComponent<import("@tamagui/react-native-types/src").ViewInstance, Omit<SheetProps, "onOpenChange" | "open">>, {
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
    ScrollView: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/scroll-view").ScrollViewRef, Omit<import("@tamagui/core").TamaguiComponentPropsBaseBase & Omit<import("@tamagui/core").StackNonStyleProps, "onScroll" | "style"> & import("@tamagui/core").RNViewProps & {
        style?: import("@tamagui/core").StackNonStyleProps['style'];
        contentContainerStyle?: import("@tamagui/core").StylePiece | import("@tamagui/core").StackNonStyleProps['style'];
        horizontal?: boolean;
        onContentSizeChange?: (width: number, height: number) => void;
        onScroll?: (event: import("@tamagui/scroll-view").WebScrollEvent) => void;
        refreshControl?: React.ReactElement<{
            style?: import("@tamagui/core").StackNonStyleProps['style'];
        }>;
        stickyHeaderIndices?: number[];
        pagingEnabled?: boolean;
        centerContent?: boolean;
        scrollEnabled?: boolean;
        scrollEventThrottle?: number;
        showsHorizontalScrollIndicator?: boolean;
        showsVerticalScrollIndicator?: boolean;
        keyboardShouldPersistTaps?: boolean | 'always' | 'never' | 'handled';
        keyboardDismissMode?: 'none' | 'on-drag' | 'interactive';
        contentOffset?: {
            x: number;
            y: number;
        };
        contentInset?: import("@tamagui/core").Insets;
        contentInsetAdjustmentBehavior?: 'automatic' | 'scrollableAxes' | 'never' | 'always';
        decelerationRate?: number | 'normal' | 'fast';
        directionalLockEnabled?: boolean;
        disableIntervalMomentum?: boolean;
        disableScrollViewPanResponder?: boolean;
        endFillColor?: string;
        fadingEdgeLength?: number | {
            start: number;
            end: number;
        };
        indicatorStyle?: 'default' | 'black' | 'white';
        invertStickyHeaders?: boolean;
        maintainVisibleContentPosition?: {
            minIndexForVisible: number;
            autoscrollToTopThreshold?: number;
        };
        maximumZoomScale?: number;
        minimumZoomScale?: number;
        nestedScrollEnabled?: boolean;
        onScrollToTop?: (event: import("@tamagui/scroll-view").WebScrollEvent) => void;
        overScrollMode?: 'auto' | 'always' | 'never';
        pinchGestureEnabled?: boolean;
        removeClippedSubviews?: boolean;
        scrollIndicatorInsets?: import("@tamagui/core").Insets;
        scrollPerfTag?: string;
        scrollToOverflowEnabled?: boolean;
        snapToAlignment?: 'start' | 'center' | 'end';
        snapToEnd?: boolean;
        snapToInterval?: number;
        snapToOffsets?: number[];
        snapToStart?: boolean;
        bounces?: boolean;
        onScrollBeginDrag?: (event: import("@tamagui/scroll-view").WebScrollEvent) => void;
        onScrollEndDrag?: (event: import("@tamagui/scroll-view").WebScrollEvent) => void;
        onMomentumScrollBegin?: (event: import("@tamagui/scroll-view").WebScrollEvent) => void;
        onMomentumScrollEnd?: (event: import("@tamagui/scroll-view").WebScrollEvent) => void;
    } & import("react").RefAttributes<import("@tamagui/scroll-view").ScrollViewRef>, "scope"> & Omit<{}, "scope"> & {
        scope?: import("@tamagui/sheet").SheetScopes;
    }, import("@tamagui/core").StackStyleBase, Omit<{}, "scope">, {
        acceptsClassName: true;
        neverFlatten: true;
    } & import("@tamagui/core").StaticConfigPublic>;
}>;
export declare const Sheet: import("@tamagui/core").Combined<import("@tamagui/core").RefComponent<import("@tamagui/react-native-types/src").ViewInstance, SheetProps>, {
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
    ScrollView: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/scroll-view").ScrollViewRef, Omit<import("@tamagui/core").TamaguiComponentPropsBaseBase & Omit<import("@tamagui/core").StackNonStyleProps, "onScroll" | "style"> & import("@tamagui/core").RNViewProps & {
        style?: import("@tamagui/core").StackNonStyleProps['style'];
        contentContainerStyle?: import("@tamagui/core").StylePiece | import("@tamagui/core").StackNonStyleProps['style'];
        horizontal?: boolean;
        onContentSizeChange?: (width: number, height: number) => void;
        onScroll?: (event: import("@tamagui/scroll-view").WebScrollEvent) => void;
        refreshControl?: React.ReactElement<{
            style?: import("@tamagui/core").StackNonStyleProps['style'];
        }>;
        stickyHeaderIndices?: number[];
        pagingEnabled?: boolean;
        centerContent?: boolean;
        scrollEnabled?: boolean;
        scrollEventThrottle?: number;
        showsHorizontalScrollIndicator?: boolean;
        showsVerticalScrollIndicator?: boolean;
        keyboardShouldPersistTaps?: boolean | 'always' | 'never' | 'handled';
        keyboardDismissMode?: 'none' | 'on-drag' | 'interactive';
        contentOffset?: {
            x: number;
            y: number;
        };
        contentInset?: import("@tamagui/core").Insets;
        contentInsetAdjustmentBehavior?: 'automatic' | 'scrollableAxes' | 'never' | 'always';
        decelerationRate?: number | 'normal' | 'fast';
        directionalLockEnabled?: boolean;
        disableIntervalMomentum?: boolean;
        disableScrollViewPanResponder?: boolean;
        endFillColor?: string;
        fadingEdgeLength?: number | {
            start: number;
            end: number;
        };
        indicatorStyle?: 'default' | 'black' | 'white';
        invertStickyHeaders?: boolean;
        maintainVisibleContentPosition?: {
            minIndexForVisible: number;
            autoscrollToTopThreshold?: number;
        };
        maximumZoomScale?: number;
        minimumZoomScale?: number;
        nestedScrollEnabled?: boolean;
        onScrollToTop?: (event: import("@tamagui/scroll-view").WebScrollEvent) => void;
        overScrollMode?: 'auto' | 'always' | 'never';
        pinchGestureEnabled?: boolean;
        removeClippedSubviews?: boolean;
        scrollIndicatorInsets?: import("@tamagui/core").Insets;
        scrollPerfTag?: string;
        scrollToOverflowEnabled?: boolean;
        snapToAlignment?: 'start' | 'center' | 'end';
        snapToEnd?: boolean;
        snapToInterval?: number;
        snapToOffsets?: number[];
        snapToStart?: boolean;
        bounces?: boolean;
        onScrollBeginDrag?: (event: import("@tamagui/scroll-view").WebScrollEvent) => void;
        onScrollEndDrag?: (event: import("@tamagui/scroll-view").WebScrollEvent) => void;
        onMomentumScrollBegin?: (event: import("@tamagui/scroll-view").WebScrollEvent) => void;
        onMomentumScrollEnd?: (event: import("@tamagui/scroll-view").WebScrollEvent) => void;
    } & import("react").RefAttributes<import("@tamagui/scroll-view").ScrollViewRef>, "scope"> & Omit<{}, "scope"> & {
        scope?: import("@tamagui/sheet").SheetScopes;
    }, import("@tamagui/core").StackStyleBase, Omit<{}, "scope">, {
        acceptsClassName: true;
        neverFlatten: true;
    } & import("@tamagui/core").StaticConfigPublic>;
    Root: import("@tamagui/core").RefComponent<import("@tamagui/react-native-types/src").ViewInstance, SheetProps>;
    Controlled: import("@tamagui/core").Combined<import("@tamagui/core").RefComponent<import("@tamagui/react-native-types/src").ViewInstance, Omit<SheetProps, "onOpenChange" | "open">>, {
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
        ScrollView: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/scroll-view").ScrollViewRef, Omit<import("@tamagui/core").TamaguiComponentPropsBaseBase & Omit<import("@tamagui/core").StackNonStyleProps, "onScroll" | "style"> & import("@tamagui/core").RNViewProps & {
            style?: import("@tamagui/core").StackNonStyleProps['style'];
            contentContainerStyle?: import("@tamagui/core").StylePiece | import("@tamagui/core").StackNonStyleProps['style'];
            horizontal?: boolean;
            onContentSizeChange?: (width: number, height: number) => void;
            onScroll?: (event: import("@tamagui/scroll-view").WebScrollEvent) => void;
            refreshControl?: React.ReactElement<{
                style?: import("@tamagui/core").StackNonStyleProps['style'];
            }>;
            stickyHeaderIndices?: number[];
            pagingEnabled?: boolean;
            centerContent?: boolean;
            scrollEnabled?: boolean;
            scrollEventThrottle?: number;
            showsHorizontalScrollIndicator?: boolean;
            showsVerticalScrollIndicator?: boolean;
            keyboardShouldPersistTaps?: boolean | 'always' | 'never' | 'handled';
            keyboardDismissMode?: 'none' | 'on-drag' | 'interactive';
            contentOffset?: {
                x: number;
                y: number;
            };
            contentInset?: import("@tamagui/core").Insets;
            contentInsetAdjustmentBehavior?: 'automatic' | 'scrollableAxes' | 'never' | 'always';
            decelerationRate?: number | 'normal' | 'fast';
            directionalLockEnabled?: boolean;
            disableIntervalMomentum?: boolean;
            disableScrollViewPanResponder?: boolean;
            endFillColor?: string;
            fadingEdgeLength?: number | {
                start: number;
                end: number;
            };
            indicatorStyle?: 'default' | 'black' | 'white';
            invertStickyHeaders?: boolean;
            maintainVisibleContentPosition?: {
                minIndexForVisible: number;
                autoscrollToTopThreshold?: number;
            };
            maximumZoomScale?: number;
            minimumZoomScale?: number;
            nestedScrollEnabled?: boolean;
            onScrollToTop?: (event: import("@tamagui/scroll-view").WebScrollEvent) => void;
            overScrollMode?: 'auto' | 'always' | 'never';
            pinchGestureEnabled?: boolean;
            removeClippedSubviews?: boolean;
            scrollIndicatorInsets?: import("@tamagui/core").Insets;
            scrollPerfTag?: string;
            scrollToOverflowEnabled?: boolean;
            snapToAlignment?: 'start' | 'center' | 'end';
            snapToEnd?: boolean;
            snapToInterval?: number;
            snapToOffsets?: number[];
            snapToStart?: boolean;
            bounces?: boolean;
            onScrollBeginDrag?: (event: import("@tamagui/scroll-view").WebScrollEvent) => void;
            onScrollEndDrag?: (event: import("@tamagui/scroll-view").WebScrollEvent) => void;
            onMomentumScrollBegin?: (event: import("@tamagui/scroll-view").WebScrollEvent) => void;
            onMomentumScrollEnd?: (event: import("@tamagui/scroll-view").WebScrollEvent) => void;
        } & import("react").RefAttributes<import("@tamagui/scroll-view").ScrollViewRef>, "scope"> & Omit<{}, "scope"> & {
            scope?: import("@tamagui/sheet").SheetScopes;
        }, import("@tamagui/core").StackStyleBase, Omit<{}, "scope">, {
            acceptsClassName: true;
            neverFlatten: true;
        } & import("@tamagui/core").StaticConfigPublic>;
    }>;
    useAnimatedPosition: typeof import("@tamagui/sheet/types/SheetContext").useAnimatedPosition;
}>;
//# sourceMappingURL=Sheet.d.ts.map
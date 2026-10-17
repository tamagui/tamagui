import { type TamaguiElement } from '@tamagui/core';
import type { FunctionComponent, Ref } from 'react';
import type { ViewInstance as RNView } from '@tamagui/react-native-types';
import { useAnimatedPosition } from './SheetContext';
import type { SheetProps } from './types';
export * from './types';
export declare const SheetHandle: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "scope"> & Omit<{}, "scope"> & {
    scope?: import("./types").SheetScopes;
}, import("@tamagui/core").StackStyleBase, Omit<{
    open?: boolean | undefined;
}, "scope">, import("@tamagui/core").StaticConfigPublic>;
export declare const SheetOverlay: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "scope"> & Omit<{}, "scope"> & {
    scope?: import("./types").SheetScopes;
}, import("@tamagui/core").StackStyleBase, Omit<{
    open?: boolean | undefined;
}, "scope">, import("@tamagui/core").StaticConfigPublic>;
type ExtraContainerProps = {
    /**
     * Adds padding accounting for the currently offscreen content, so if you put a flex element inside
     * the sheet, it will always flex to the height of the visible amount of the sheet. If this is not
     * turned on, the inner content is always set to the max height of the sheet.
     */
    adjustPaddingForOffscreenContent?: boolean;
};
export declare const SheetContainer: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "adjustPaddingForOffscreenContent" | "scope"> & Omit<ExtraContainerProps, "scope"> & {
    scope?: import("./types").SheetScopes;
}, import("@tamagui/core").StackStyleBase, Omit<{}, "adjustPaddingForOffscreenContent" | "scope">, import("@tamagui/core").StaticConfigPublic>;
type ExtraBackgroundProps = {
    /**
     * Disables the default background extension below the sheet. Leave this off
     * when a spring can overshoot on open so page content never shows through.
     */
    disableHideBottomOverflow?: boolean;
};
export declare const SheetBackground: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "disableHideBottomOverflow" | "scope"> & Omit<ExtraBackgroundProps, "scope"> & {
    scope?: import("./types").SheetScopes;
}, import("@tamagui/core").StackStyleBase, Omit<{}, "disableHideBottomOverflow" | "scope">, import("@tamagui/core").StaticConfigPublic>;
export declare const SheetRoot: import("@tamagui/compose-refs").RefComponent<RNView, SheetProps>;
export declare const SheetControlled: import("@tamagui/helpers").Combined<FunctionComponent<Omit<SheetProps, "onOpenChange" | "open"> & {
    ref?: Ref<RNView>;
}>, {
    Container: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "adjustPaddingForOffscreenContent" | "scope"> & Omit<ExtraContainerProps, "scope"> & {
        scope?: import("./types").SheetScopes;
    }, import("@tamagui/core").StackStyleBase, Omit<{}, "adjustPaddingForOffscreenContent" | "scope">, import("@tamagui/core").StaticConfigPublic>;
    Background: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "disableHideBottomOverflow" | "scope"> & Omit<ExtraBackgroundProps, "scope"> & {
        scope?: import("./types").SheetScopes;
    }, import("@tamagui/core").StackStyleBase, Omit<{}, "disableHideBottomOverflow" | "scope">, import("@tamagui/core").StaticConfigPublic>;
    Overlay: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "scope"> & Omit<{}, "scope"> & {
        scope?: import("./types").SheetScopes;
    }, import("@tamagui/core").StackStyleBase, Omit<{
        open?: boolean | undefined;
    }, "scope">, import("@tamagui/core").StaticConfigPublic>;
    Handle: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "scope"> & Omit<{}, "scope"> & {
        scope?: import("./types").SheetScopes;
    }, import("@tamagui/core").StackStyleBase, Omit<{
        open?: boolean | undefined;
    }, "scope">, import("@tamagui/core").StaticConfigPublic>;
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
        scope?: import("./types").SheetScopes;
    }, import("@tamagui/core").StackStyleBase, Omit<{}, "scope">, {
        acceptsClassName: true;
        neverFlatten: true;
    }>;
}>;
export declare const Sheet: import("@tamagui/helpers").Combined<import("@tamagui/compose-refs").RefComponent<RNView, SheetProps>, {
    Container: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "adjustPaddingForOffscreenContent" | "scope"> & Omit<ExtraContainerProps, "scope"> & {
        scope?: import("./types").SheetScopes;
    }, import("@tamagui/core").StackStyleBase, Omit<{}, "adjustPaddingForOffscreenContent" | "scope">, import("@tamagui/core").StaticConfigPublic>;
    Background: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "disableHideBottomOverflow" | "scope"> & Omit<ExtraBackgroundProps, "scope"> & {
        scope?: import("./types").SheetScopes;
    }, import("@tamagui/core").StackStyleBase, Omit<{}, "disableHideBottomOverflow" | "scope">, import("@tamagui/core").StaticConfigPublic>;
    Overlay: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "scope"> & Omit<{}, "scope"> & {
        scope?: import("./types").SheetScopes;
    }, import("@tamagui/core").StackStyleBase, Omit<{
        open?: boolean | undefined;
    }, "scope">, import("@tamagui/core").StaticConfigPublic>;
    Handle: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "scope"> & Omit<{}, "scope"> & {
        scope?: import("./types").SheetScopes;
    }, import("@tamagui/core").StackStyleBase, Omit<{
        open?: boolean | undefined;
    }, "scope">, import("@tamagui/core").StaticConfigPublic>;
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
        scope?: import("./types").SheetScopes;
    }, import("@tamagui/core").StackStyleBase, Omit<{}, "scope">, {
        acceptsClassName: true;
        neverFlatten: true;
    }>;
    Root: import("@tamagui/compose-refs").RefComponent<RNView, SheetProps>;
    Controlled: import("@tamagui/helpers").Combined<FunctionComponent<Omit<SheetProps, "onOpenChange" | "open"> & {
        ref?: Ref<RNView>;
    }>, {
        Container: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "adjustPaddingForOffscreenContent" | "scope"> & Omit<ExtraContainerProps, "scope"> & {
            scope?: import("./types").SheetScopes;
        }, import("@tamagui/core").StackStyleBase, Omit<{}, "adjustPaddingForOffscreenContent" | "scope">, import("@tamagui/core").StaticConfigPublic>;
        Background: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "disableHideBottomOverflow" | "scope"> & Omit<ExtraBackgroundProps, "scope"> & {
            scope?: import("./types").SheetScopes;
        }, import("@tamagui/core").StackStyleBase, Omit<{}, "disableHideBottomOverflow" | "scope">, import("@tamagui/core").StaticConfigPublic>;
        Overlay: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "scope"> & Omit<{}, "scope"> & {
            scope?: import("./types").SheetScopes;
        }, import("@tamagui/core").StackStyleBase, Omit<{
            open?: boolean | undefined;
        }, "scope">, import("@tamagui/core").StaticConfigPublic>;
        Handle: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "scope"> & Omit<{}, "scope"> & {
            scope?: import("./types").SheetScopes;
        }, import("@tamagui/core").StackStyleBase, Omit<{
            open?: boolean | undefined;
        }, "scope">, import("@tamagui/core").StaticConfigPublic>;
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
            scope?: import("./types").SheetScopes;
        }, import("@tamagui/core").StackStyleBase, Omit<{}, "scope">, {
            acceptsClassName: true;
            neverFlatten: true;
        }>;
    }>;
    useAnimatedPosition: typeof useAnimatedPosition;
}>;
//# sourceMappingURL=Sheet.d.ts.map
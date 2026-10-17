import type { ScrollViewRef } from '@tamagui/scroll-view';
import React from 'react';
export declare const SheetScrollView: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, ScrollViewRef, Omit<import("@tamagui/core").TamaguiComponentPropsBaseBase & Omit<import("@tamagui/core").StackNonStyleProps, "onScroll" | "style"> & import("@tamagui/core").RNViewProps & {
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
} & React.RefAttributes<ScrollViewRef>, "scope"> & Omit<{}, "scope"> & {
    scope?: import("./types").SheetScopes;
}, import("@tamagui/core").StackStyleBase, Omit<{}, "scope">, {
    acceptsClassName: true;
    neverFlatten: true;
}>;
//# sourceMappingURL=SheetScrollView.d.ts.map
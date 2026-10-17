import type { GetProps, GetRef } from '@tamagui/web';
export declare const ScrollView: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, import("./WebScrollView").ScrollViewRef, import("@tamagui/web").TamaguiComponentPropsBaseBase & Omit<import("@tamagui/web").StackNonStyleProps, "onScroll" | "style"> & import("@tamagui/web").RNViewProps & {
    style?: import("@tamagui/web").StackNonStyleProps['style'];
    contentContainerStyle?: import("@tamagui/web").StylePiece | import("@tamagui/web").StackNonStyleProps['style'];
    horizontal?: boolean;
    onContentSizeChange?: (width: number, height: number) => void;
    onScroll?: (event: import("./WebScrollView").WebScrollEvent) => void;
    refreshControl?: React.ReactElement<{
        style?: import("@tamagui/web").StackNonStyleProps['style'];
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
    contentInset?: import("@tamagui/web").Insets;
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
    onScrollToTop?: (event: import("./WebScrollView").WebScrollEvent) => void;
    overScrollMode?: 'auto' | 'always' | 'never';
    pinchGestureEnabled?: boolean;
    removeClippedSubviews?: boolean;
    scrollIndicatorInsets?: import("@tamagui/web").Insets;
    scrollPerfTag?: string;
    scrollToOverflowEnabled?: boolean;
    snapToAlignment?: 'start' | 'center' | 'end';
    snapToEnd?: boolean;
    snapToInterval?: number;
    snapToOffsets?: number[];
    snapToStart?: boolean;
    bounces?: boolean;
    onScrollBeginDrag?: (event: import("./WebScrollView").WebScrollEvent) => void;
    onScrollEndDrag?: (event: import("./WebScrollView").WebScrollEvent) => void;
    onMomentumScrollBegin?: (event: import("./WebScrollView").WebScrollEvent) => void;
    onMomentumScrollEnd?: (event: import("./WebScrollView").WebScrollEvent) => void;
} & import("react").RefAttributes<import("./WebScrollView").ScrollViewRef>, import("@tamagui/web").StackStyleBase, {}, {
    acceptsClassName: true;
    neverFlatten: true;
}>;
export type ScrollView = GetRef<typeof ScrollView>;
export type ScrollViewProps = GetProps<typeof ScrollView>;
//# sourceMappingURL=ScrollView.d.ts.map
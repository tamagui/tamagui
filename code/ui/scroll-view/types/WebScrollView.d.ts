import { type Insets, type RNViewProps, type StackNonStyleProps, type StylePiece } from '@tamagui/web';
import * as React from 'react';
export interface ScrollViewMethods {
    getScrollResponder: () => any;
    getScrollableNode: () => HTMLElement;
    getInnerViewNode: () => HTMLElement;
    getInnerViewRef: () => HTMLElement;
    getNativeScrollRef: () => HTMLElement;
    scrollTo: (options?: {
        x?: number;
        y?: number;
        animated?: boolean;
    }) => void;
    scrollToEnd: (options?: {
        animated?: boolean;
    }) => void;
    flashScrollIndicators: () => void;
}
export type ScrollViewRef = HTMLElement & ScrollViewMethods;
export type WebScrollEvent = {
    nativeEvent: {
        contentOffset: {
            x: number;
            y: number;
        };
        contentSize: {
            width: number;
            height: number;
        };
        layoutMeasurement: {
            width: number;
            height: number;
        };
    };
    timeStamp: number;
};
export type WebScrollViewProps = Omit<StackNonStyleProps, 'onScroll' | 'style'> & RNViewProps & {
    style?: StackNonStyleProps['style'];
    contentContainerStyle?: StylePiece | StackNonStyleProps['style'];
    horizontal?: boolean;
    onContentSizeChange?: (width: number, height: number) => void;
    onScroll?: (event: WebScrollEvent) => void;
    refreshControl?: React.ReactElement<{
        style?: StackNonStyleProps['style'];
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
    contentInset?: Insets;
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
    onScrollToTop?: (event: WebScrollEvent) => void;
    overScrollMode?: 'auto' | 'always' | 'never';
    pinchGestureEnabled?: boolean;
    removeClippedSubviews?: boolean;
    scrollIndicatorInsets?: Insets;
    scrollPerfTag?: string;
    scrollToOverflowEnabled?: boolean;
    snapToAlignment?: 'start' | 'center' | 'end';
    snapToEnd?: boolean;
    snapToInterval?: number;
    snapToOffsets?: number[];
    snapToStart?: boolean;
    bounces?: boolean;
    onScrollBeginDrag?: (event: WebScrollEvent) => void;
    onScrollEndDrag?: (event: WebScrollEvent) => void;
    onMomentumScrollBegin?: (event: WebScrollEvent) => void;
    onMomentumScrollEnd?: (event: WebScrollEvent) => void;
};
export declare const WebScrollView: React.ForwardRefExoticComponent<Omit<StackNonStyleProps, "onScroll" | "style"> & RNViewProps & {
    style?: StackNonStyleProps['style'];
    contentContainerStyle?: StylePiece | StackNonStyleProps['style'];
    horizontal?: boolean;
    onContentSizeChange?: (width: number, height: number) => void;
    onScroll?: (event: WebScrollEvent) => void;
    refreshControl?: React.ReactElement<{
        style?: StackNonStyleProps['style'];
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
    contentInset?: Insets;
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
    onScrollToTop?: (event: WebScrollEvent) => void;
    overScrollMode?: 'auto' | 'always' | 'never';
    pinchGestureEnabled?: boolean;
    removeClippedSubviews?: boolean;
    scrollIndicatorInsets?: Insets;
    scrollPerfTag?: string;
    scrollToOverflowEnabled?: boolean;
    snapToAlignment?: 'start' | 'center' | 'end';
    snapToEnd?: boolean;
    snapToInterval?: number;
    snapToOffsets?: number[];
    snapToStart?: boolean;
    bounces?: boolean;
    onScrollBeginDrag?: (event: WebScrollEvent) => void;
    onScrollEndDrag?: (event: WebScrollEvent) => void;
    onMomentumScrollBegin?: (event: WebScrollEvent) => void;
    onMomentumScrollEnd?: (event: WebScrollEvent) => void;
} & React.RefAttributes<ScrollViewRef>>;
//# sourceMappingURL=WebScrollView.d.ts.map
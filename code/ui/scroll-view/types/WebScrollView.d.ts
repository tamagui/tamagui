import { type RNViewProps, type StackNonStyleProps, type ViewProps, type StylePiece } from '@tamagui/web';
import type { ScrollViewProps as NativeScrollViewProps } from '@tamagui/react-native-types';
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
export type WebScrollEventHandler = {
    onScroll(event: WebScrollEvent): void;
}['onScroll'];
export type WebScrollViewProps = Omit<StackNonStyleProps, 'onScroll' | 'style'> & RNViewProps & Omit<NativeScrollViewProps, keyof StackNonStyleProps | 'pointerEvents' | keyof RNViewProps | 'style' | 'contentContainerStyle' | 'refreshControl' | 'keyboardShouldPersistTaps' | 'onScroll' | 'onScrollToTop' | 'onScrollBeginDrag' | 'onScrollEndDrag' | 'onMomentumScrollBegin' | 'onMomentumScrollEnd'> & {
    pointerEvents?: ViewProps['pointerEvents'];
    style?: StackNonStyleProps['style'];
    contentContainerStyle?: StylePiece | StackNonStyleProps['style'];
    refreshControl?: React.ReactElement<{
        style?: StackNonStyleProps['style'];
    }>;
    keyboardShouldPersistTaps?: boolean | 'always' | 'never' | 'handled';
    onScroll?: WebScrollEventHandler;
    onScrollToTop?: WebScrollEventHandler;
    onScrollBeginDrag?: WebScrollEventHandler;
    onScrollEndDrag?: WebScrollEventHandler;
    onMomentumScrollBegin?: WebScrollEventHandler;
    onMomentumScrollEnd?: WebScrollEventHandler;
};
export declare const WebScrollView: React.ForwardRefExoticComponent<Omit<StackNonStyleProps, "onScroll" | "style"> & RNViewProps & Omit<NativeScrollViewProps, "contentContainerStyle" | "keyboardShouldPersistTaps" | "onMomentumScrollBegin" | "onMomentumScrollEnd" | "onScrollBeginDrag" | "onScrollEndDrag" | "onScrollToTop" | "pointerEvents" | "refreshControl" | keyof RNViewProps | keyof StackNonStyleProps> & {
    pointerEvents?: ViewProps['pointerEvents'];
    style?: StackNonStyleProps['style'];
    contentContainerStyle?: StylePiece | StackNonStyleProps['style'];
    refreshControl?: React.ReactElement<{
        style?: StackNonStyleProps['style'];
    }>;
    keyboardShouldPersistTaps?: boolean | 'always' | 'never' | 'handled';
    onScroll?: WebScrollEventHandler;
    onScrollToTop?: WebScrollEventHandler;
    onScrollBeginDrag?: WebScrollEventHandler;
    onScrollEndDrag?: WebScrollEventHandler;
    onMomentumScrollBegin?: WebScrollEventHandler;
    onMomentumScrollEnd?: WebScrollEventHandler;
} & React.RefAttributes<ScrollViewRef>>;
//# sourceMappingURL=WebScrollView.d.ts.map
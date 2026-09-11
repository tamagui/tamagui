import { type StylePiece } from '@tamagui/web';
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
export type WebScrollViewProps = {
    contentContainerStyle?: StylePiece;
    [key: string]: any;
};
export declare const WebScrollView: React.ForwardRefExoticComponent<Omit<WebScrollViewProps, "ref"> & React.RefAttributes<ScrollViewRef>>;
//# sourceMappingURL=WebScrollView.d.ts.map
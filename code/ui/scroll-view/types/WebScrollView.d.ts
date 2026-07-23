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
export declare const WebScrollView: React.ForwardRefExoticComponent<Omit<any, "ref"> & React.RefAttributes<ScrollViewRef>>;
//# sourceMappingURL=WebScrollView.d.ts.map
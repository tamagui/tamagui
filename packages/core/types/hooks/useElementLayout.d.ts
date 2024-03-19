import type { RefObject } from 'react';
export type LayoutValue = {
    x: number;
    y: number;
    width: number;
    height: number;
    left: number;
    top: number;
};
export type LayoutEvent = {
    nativeEvent: {
        layout: LayoutValue;
        target: any;
    };
    timeStamp: number;
};
export declare const measureLayout: (node: HTMLElement, relativeTo: HTMLElement | null, callback: (x: number, y: number, width: number, height: number, left: number, top: number) => void) => void;
export declare function useElementLayout(ref: RefObject<Element>, onLayout?: ((e: LayoutEvent) => void) | null): void;
//# sourceMappingURL=useElementLayout.d.ts.map
import { type TamaguiComponentStateRef } from '@tamagui/web';
import type { RefObject } from 'react';
type LayoutMeasurementStrategy = 'off' | 'sync' | 'async';
export declare function setOnLayoutStrategy(state: LayoutMeasurementStrategy): void;
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
export declare const getElementLayoutEvent: (target: HTMLElement) => LayoutEvent;
export declare const measureLayout: (node: HTMLElement, relativeTo: HTMLElement | null, callback: (x: number, y: number, width: number, height: number, left: number, top: number) => void) => void;
export declare const getElementLayoutEventAsync: (target: HTMLElement) => Promise<LayoutEvent>;
export declare const measureLayoutAsync: (node: HTMLElement, relativeTo: HTMLElement | null, callback: (x: number, y: number, width: number, height: number, left: number, top: number) => void) => Promise<void>;
export declare function useElementLayout(ref: RefObject<TamaguiComponentStateRef>, onLayout?: ((e: LayoutEvent) => void) | null): void;
export {};
//# sourceMappingURL=useElementLayout.d.ts.map
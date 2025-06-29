import type { RefObject } from "react";
type TamaguiComponentStatePartial = {
	host?: any;
};
type LayoutMeasurementStrategy = "off" | "sync" | "async";
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
export declare function enable(): void;
// Sync versions
export declare const getElementLayoutEvent: (target: HTMLElement) => LayoutEvent;
export declare const measureLayout: (node: HTMLElement, relativeTo: HTMLElement | null, callback: (x: number, y: number, width: number, height: number, left: number, top: number) => void) => void;
export declare const getElementLayoutEventAsync: (target: HTMLElement) => Promise<LayoutEvent>;
export declare const measureLayoutAsync: (node: HTMLElement, relativeTo?: HTMLElement | null) => Promise<null | LayoutValue>;
export declare function useElementLayout(ref: RefObject<TamaguiComponentStatePartial>, onLayout?: ((e: LayoutEvent) => void) | null): void;
export declare const getRect: (node: HTMLElement) => LayoutValue | undefined;
export {};

//# sourceMappingURL=index.d.ts.map
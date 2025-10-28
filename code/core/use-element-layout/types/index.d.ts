import { type ReactNode, type RefObject } from "react";
export declare const LayoutMeasurementController: ({ disable, children }: {
	disable: boolean;
	children: ReactNode;
}) => ReactNode;
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
	pageX: number;
	pageY: number;
};
export type LayoutEvent = {
	nativeEvent: {
		layout: LayoutValue;
		target: any;
	};
	timeStamp: number;
};
export declare function enable(): void;
export declare const getElementLayoutEvent: (nodeRect: DOMRectReadOnly, parentRect: DOMRectReadOnly) => LayoutEvent;
export declare function useElementLayout(ref: RefObject<TamaguiComponentStatePartial>, onLayout?: ((e: LayoutEvent) => void) | null): void;
export declare const getBoundingClientRectAsync: (node: HTMLElement | null) => Promise<DOMRectReadOnly | false>;
export declare const measureNode: (node: HTMLElement, relativeTo?: HTMLElement | null) => Promise<null | LayoutValue>;
type MeasureInWindowCb = (x: number, y: number, width: number, height: number) => void;
type MeasureCb = (x: number, y: number, width: number, height: number, pageX: number, pageY: number) => void;
export declare const measure: (node: HTMLElement, callback: MeasureCb) => Promise<LayoutValue | null>;
export declare function createMeasure(node: HTMLElement): (callback: MeasureCb) => Promise<LayoutValue | null>;
type WindowLayout = {
	pageX: number;
	pageY: number;
	width: number;
	height: number;
};
export declare const measureInWindow: (node: HTMLElement, callback: MeasureInWindowCb) => Promise<WindowLayout | null>;
export declare const createMeasureInWindow: (node: HTMLElement) => ((callback: MeasureInWindowCb) => Promise<WindowLayout | null>);
export declare const measureLayout: (node: HTMLElement, relativeNode: HTMLElement, callback: MeasureCb) => Promise<LayoutValue | null>;
export declare function createMeasureLayout(node: HTMLElement): (relativeTo: HTMLElement, callback: MeasureCb) => Promise<LayoutValue | null>;
export {};

//# sourceMappingURL=index.d.ts.map
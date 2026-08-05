import type { MediaQueryList } from "@tamagui/web";
type Listener = () => void;
export declare class NativeMediaQueryList implements MediaQueryList {
	private query;
	private listeners;
	private reducedMotionExpected;
	private get orientation();
	constructor(query: string);
	private notify;
	addListener(listener: Listener): void;
	removeListener(listener: Listener): void;
	match(query: string, { width, height }: {
		width: number;
		height: number;
	}): boolean;
	get matches(): boolean;
}
export {};

//# sourceMappingURL=mediaQueryList.d.ts.map
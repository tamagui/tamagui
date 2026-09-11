import type { ResolvedPayload } from "./resolvePayload";
export declare function serializePayloadWeb(resolved: ResolvedPayload, toVar: (name: string) => string): string;
export interface SerializeNativeOptions {
	/**
	* `px-to-number` finalizes a single `<number>px` result to the bare number,
	* which React Native requires for length props. Whether a property takes
	* unitless numbers is property-table knowledge, so it stays with the caller.
	*/
	unit?: "px-to-number";
}
export declare function serializePayloadNative(resolved: ResolvedPayload, get: (name: string) => string | number, opts?: SerializeNativeOptions): string | number;

//# sourceMappingURL=serializePayload.d.ts.map
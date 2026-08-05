import type { ParsedValue } from "./valueTypes";
export interface GeometricShorthandError {
	code: "unsupported-geometric-payload";
	payload: string;
	where: "base" | number;
}
/**
* Splits a geometric shorthand's parsed program into per-longhand programs by
* slot. Returns null when `prop` is not a geometric shorthand, or when every
* payload is single-component (nothing to distribute — the caller's ordinary
* expansion handles that identically and cheaper).
*/
export declare function splitGeometricShorthandValue(prop: string, value: ParsedValue): {
	entries: Array<{
		property: string;
		value: ParsedValue;
	}>;
	errors: GeometricShorthandError[];
} | null;

//# sourceMappingURL=geometricShorthand.d.ts.map
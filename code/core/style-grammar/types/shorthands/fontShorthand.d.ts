import type { ParsedValue } from "../ast/valueTypes";
interface FontShorthandTargets {
	style: readonly string[];
	weight: readonly string[];
	size: readonly string[];
	lineHeight: readonly string[];
	family: readonly string[];
}
/** authored prop -> the true longhands each component kind lands on */
export declare const fontShorthandTargets: Readonly<Record<string, FontShorthandTargets>>;
export interface FontShorthandError {
	code: "unsupported-font-component";
	component: string;
	where: "base" | number;
}
export declare function splitFontValue(value: ParsedValue): {
	entries: Array<{
		property: string;
		value: ParsedValue;
	}>;
	errors: FontShorthandError[];
};
export {};

//# sourceMappingURL=fontShorthand.d.ts.map
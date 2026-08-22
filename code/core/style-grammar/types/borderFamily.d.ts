import type { ParsedValue } from "./valueTypes";
interface BorderFamilyTargets {
	width: readonly string[];
	style: readonly string[];
	color: readonly string[];
}
/** authored prop -> the true longhands each component kind lands on */
export declare const borderFamilyTargets: Readonly<Record<string, BorderFamilyTargets>>;
export interface BorderFamilyError {
	code: "unsupported-border-component";
	component: string;
	where: "base" | number;
}
export declare function splitBorderValue(property: string, value: ParsedValue, colorTokens: ReadonlySet<string>): {
	entries: Array<{
		property: string;
		value: ParsedValue;
	}>;
	errors: BorderFamilyError[];
};
export {};

//# sourceMappingURL=borderFamily.d.ts.map
import type { ParsedValue } from "../ast/valueTypes";
interface TextDecorationFamilyTargets {
	line: readonly string[];
	style: readonly string[];
	color: readonly string[];
}
/** authored prop -> the true longhands each component kind lands on */
export declare const textDecorationFamilyTargets: Readonly<Record<string, TextDecorationFamilyTargets>>;
export interface TextDecorationFamilyError {
	code: "unsupported-text-decoration-component";
	component: string;
	where: "base" | number;
}
export declare function splitTextDecorationValue(value: ParsedValue, colorTokens: ReadonlySet<string>): {
	entries: Array<{
		property: string;
		value: ParsedValue;
	}>;
	errors: TextDecorationFamilyError[];
};
export {};

//# sourceMappingURL=textDecorationFamily.d.ts.map
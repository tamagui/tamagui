import type { LonghandProgram, ParsedValue } from "./valueTypes";
export declare const longhandExpansionTable: Readonly<Record<string, readonly string[]>>;
export declare function expandToLonghands(prop: string, shorthands?: Record<string, string>): readonly string[];
export declare function mergePrograms(entries: ReadonlyArray<{
	prop: string;
	value: ParsedValue;
}>, shorthands?: Record<string, string>): Map<string, LonghandProgram>;

//# sourceMappingURL=programs.d.ts.map
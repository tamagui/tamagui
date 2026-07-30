import type { LonghandProgram, ParsedValue } from "./valueTypes";
export declare const longhandExpansionTable: Readonly<Record<string, readonly string[]>>;
export declare function expandToLonghands(prop: string, shorthands?: Record<string, string>): readonly string[];
/**
* The merge unit is the clause, keyed by its exact condition set (decision
* 21): the later contribution replaces the base only when it restates one,
* replaces the clauses whose condition sets it restates, and its clauses
* append after the surviving earlier ones so last-match-wins holds. A styled
* `bg="gray hover:blue"` overridden by a call-site `bg="red"` keeps the
* hover — v1's `hoverStyle`-as-separate-prop semantics and tailwind-merge's
* per-variant conflict groups.
*/
export declare function mergeProgramValues(earlier: ParsedValue, later: ParsedValue): ParsedValue;
export declare function mergePrograms(entries: ReadonlyArray<{
	prop: string;
	value: ParsedValue;
}>, shorthands?: Record<string, string>): Map<string, LonghandProgram>;

//# sourceMappingURL=programs.d.ts.map
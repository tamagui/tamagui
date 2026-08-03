import type { ModifierRegistryView, ParsedValue } from "./valueTypes";
export interface ActiveConditions {
	states: ReadonlySet<string>;
	themes: ReadonlySet<string>;
	media: ReadonlySet<string>;
	platform: string;
	groups: (modifier: string) => boolean;
	/**
	* whether a container query modifier (`@sm`, `@sm/card`) currently holds.
	* Like groups, this is a callback because the answer lives with the component
	* tree: resolving it needs the measured size of the nearest or named
	* container, whose measurement timing is its own design item.
	*/
	containers: (modifier: string) => boolean;
}
/**
* Resolves a program to one payload, mirroring the runtime directStyle
* contract: clauses apply in authored order, except that platform-bearing
* clauses with the same non-platform condition set compete by platform
* specificity (grammarPlatformRank), where a more specific earlier clause
* survives a less specific later one and equal ranks keep authored order.
*/
export declare function evaluateProgram(value: ParsedValue, registry: ModifierRegistryView, active: ActiveConditions): string | null;

//# sourceMappingURL=evaluateProgram.d.ts.map
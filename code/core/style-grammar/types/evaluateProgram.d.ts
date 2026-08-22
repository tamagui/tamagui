import { type ClausePrecedenceOrder } from "./clausePrecedence";
import type { ModifierRegistryView, ParsedValue } from "./valueTypes";
export interface ActiveConditions {
	states: ReadonlySet<string>;
	themes: ReadonlySet<string>;
	media: ReadonlySet<string>;
	/** config declaration order; falls back to `media` insertion order in tests */
	mediaOrder?: ClausePrecedenceOrder;
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
* Resolves a program to one payload using the shared fixed precedence key.
* Authored order only breaks exact-key ties, so a later restatement of the
* same normalized condition set wins while distinct condition sets are stable
* under reordering.
*/
export declare function evaluateProgram(value: ParsedValue, registry: ModifierRegistryView, active: ActiveConditions): string | null;

//# sourceMappingURL=evaluateProgram.d.ts.map
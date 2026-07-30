import type { LonghandProgram, ModifierRegistryView } from "./valueTypes";
/**
* Where a condition's selector fragment is matched, relative to the subject: on
* the subject itself, strictly above it, or either.
*/
export type ConditionScope = "self" | "within" | "is-or-within";
export interface ConditionSelector {
	/** compound selector piece, eg `:hover`, `.t_dark`, `[aria-disabled]` */
	fragment: string;
	/** defaults to `self` */
	scope?: ConditionScope;
}
/**
* Interaction-state selector spellings, mirroring
* `code/core/web/src/helpers/pseudoDescriptors.ts` and the two special cases in
* `getCSSStylesAtomic.createAtomicRules`: `disabled` is an attribute rather than
* `:disabled`, and enter matches the unmounted class on the subject or above it.
* Mirrored as data instead of imported because this package must not depend on
* @tamagui/web.
*
* `exit` is deliberately absent. Exit is animation-driver territory — there is
* no exited-state class in the DOM to select — so a web `exit:` clause cannot
* lower and says so instead of inventing an approximation.
*/
export declare const defaultStateSelectors: Readonly<Record<string, ConditionSelector>>;
export interface LowerProgramOptions {
	/** classifies each modifier; the same registry the value was parsed against */
	registry: ModifierRegistryView;
	/** opaque stamp for the resolved config that produced these payloads */
	configRevision: string;
	/** media key -> the `@media` condition text, eg `(max-width: 860px)` */
	mediaQueries?: Readonly<Record<string, string>>;
	/**
	* media key -> the `@container` condition text, eg `(min-width: 24rem)`. Sizes
	* are the same keys as `mediaQueries`, but the query text differs: container
	* queries measure the container, not the viewport, so the caller derives both
	* from config.
	*/
	containerQueries?: Readonly<Record<string, string>>;
	/** modifier -> selector, defaults to `defaultStateSelectors` */
	stateSelectors?: Readonly<Record<string, ConditionSelector>>;
	/** theme class prefix; `t_` gives `.t_dark` */
	themeClassPrefix?: string;
	/** group class prefix; `t_group_` gives `.t_group_card` */
	groupClassPrefix?: string;
}
export interface LoweredProgram {
	className: string;
	/** base rule first, then one rule per emitted clause in authored order */
	rules: string[];
	/**
	* Present when the program writes a per-axis custom property (`x`, `y`,
	* `scaleX`, `scaleY`). The composing rule turns the axis variables into the
	* real CSS property and is identical for every element using that axis group,
	* so it carries its own class name and hash: the caller adds this class too and
	* insertion dedups it to one rule per sheet. Its specificity is the same
	* (0,1,0) as every other rule here.
	*/
	composition?: {
		/** the CSS property being composed, and the classNames key to store it under */
		property: string;
		className: string;
		rules: string[];
	};
}
export declare function lowerProgram(program: LonghandProgram, options: LowerProgramOptions): LoweredProgram;

//# sourceMappingURL=lowerProgram.d.ts.map
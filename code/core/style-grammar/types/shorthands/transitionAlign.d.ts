import { type TransitionParseResult } from "./transition";
export type TransitionLonghandName = "transitionProperty" | "transitionDuration" | "transitionTimingFunction" | "transitionDelay" | "transitionBehavior";
export interface TransitionContribution {
	/** the authored prop, in authored order */
	prop: "transition" | TransitionLonghandName;
	value: string;
}
/**
* Merges any mix of `transition` shorthand and longhand contributions, in
* authored order, into one TransitionIR. Last-wins per longhand; the
* shorthand resets all five.
*/
export declare function alignTransitionContributions(contributions: readonly TransitionContribution[], presetNames?: ReadonlySet<string>): TransitionParseResult;

//# sourceMappingURL=transitionAlign.d.ts.map
import { type TransitionBehavior, type TransitionParseResult } from "./transition";
/** low-level spring physics: a projection of duration+bounce, not a second API */
export interface SpringEscapeHatch {
	stiffness?: number;
	damping?: number;
	mass?: number;
	velocity?: number;
	overshootClamping?: boolean;
	restDisplacementThreshold?: number;
	restSpeedThreshold?: number;
}
export interface TransitionObjectBase {
	preset?: string;
	duration?: number | string;
	bounce?: number;
	easing?: string;
	delay?: number | string;
	behavior?: TransitionBehavior;
	/** the css transition-property list this base entry applies to */
	properties?: string;
	spring?: SpringEscapeHatch;
	/**
	* the transition to use while mounting. prefer colocating it with the styles
	* it animates: `enterStyle={{ opacity: 0, transition: '200ms' }}`.
	*/
	enter?: TransitionObjectValue;
	/** the transition to use while unmounting. see `enter`. */
	exit?: TransitionObjectValue;
}
export type TransitionObjectValue = string | (TransitionObjectBase & {
	[property: string]: unknown;
});
/**
* every key that configures the transition itself. anything else in the object
* is a property name. closed on purpose: an unrecognized key is a diagnostic,
* never a silent per-property transition on a property that does not exist.
*/
export declare const TRANSITION_RESERVED_KEYS: ReadonlySet<string>;
/**
* lowers the transition object form into TransitionIR.
*
* @param presetNames configured animation names, so per-property strings
*   resolve presets the same way the shorthand does
* @param knownProperties when given, any non-reserved key outside it is a
*   diagnostic instead of a silently-ignored per-property entry
*/
export declare function parseTransitionObject(input: TransitionObjectValue, presetNames?: ReadonlySet<string>, knownProperties?: ReadonlySet<string>): TransitionParseResult;

//# sourceMappingURL=transitionObject.d.ts.map
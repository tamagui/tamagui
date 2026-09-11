export type TransitionBehavior = "normal" | "allow-discrete";
export interface CSSTransitionTiming {
	type: "css";
	duration: string;
	timingFunction: string;
}
export interface PresetTransitionTiming {
	type: "preset";
	name: string;
	config?: Readonly<Record<string, unknown>>;
}
/**
* a spring occupies the fused duration+timingFunction pair, exactly like a
* preset: CSS has no spring easing, so it is not decomposable into css
* components and the duration/timing-function longhands cannot reach inside it.
*
* `duration` is the perceptual duration, defined as the undamped period
* `2pi / sqrt(stiffness / mass)` (SwiftUI's convention). `bounce` is 0 for
* critically damped, approaches 1 for undamped oscillation, and goes negative
* for overdamped. Drivers solve these into their own parameters; the low-level
* `stiffness`/`damping`/`mass` escape hatch rides along in `config`.
*/
export interface SpringTransitionTiming {
	type: "spring";
	duration: string;
	bounce: number;
	config?: Readonly<Record<string, unknown>>;
}
export type TransitionTiming = CSSTransitionTiming | PresetTransitionTiming | SpringTransitionTiming;
export interface TransitionEntry {
	property: string;
	timing: TransitionTiming;
	delay: string;
	behavior: TransitionBehavior;
}
export interface TransitionIR {
	kind: "transition";
	entries: readonly TransitionEntry[];
	/**
	* entries that replace `entries` while mounting and unmounting. they are a
	* separate list rather than more entries because they never apply at the
	* same time as the default ones.
	*/
	enter?: readonly TransitionEntry[];
	exit?: readonly TransitionEntry[];
}
export interface TransitionGlobalIR {
	kind: "global";
	value: "inherit" | "initial" | "revert" | "revert-layer" | "unset";
}
export type ParsedTransition = TransitionIR | TransitionGlobalIR;
export interface TransitionDiagnostic {
	code: "transition-empty-item" | "transition-invalid-token" | "transition-duplicate-component" | "transition-invalid-duration" | "transition-invalid-list" | "transition-invalid-spring";
	message: string;
	item?: string;
	token?: string;
}
export type TransitionParseResult = {
	ok: true;
	value: ParsedTransition;
} | {
	ok: false;
	diagnostics: readonly TransitionDiagnostic[];
};
export interface TransitionLonghands {
	transitionProperty?: string;
	transitionDuration?: string;
	transitionTimingFunction?: string;
	transitionDelay?: string;
	transitionBehavior?: string;
}
/**
* parses CSS transition shorthand or an exact configured preset name.
*
* duration-shaped values and css-reserved names always use css semantics.
* preset matching is exact and never infers aliases.
*/
export declare function parseTransition(input: string, presetNames?: ReadonlySet<string>): TransitionParseResult;
/**
* lowers the five CSS transition longhands into the same IR as the shorthand.
* css list repetition is based on transition-property, as in the browser.
*/
export declare function parseTransitionLonghands(input: TransitionLonghands): TransitionParseResult;
export declare function serializeTransition(value: ParsedTransition): string | null;

//# sourceMappingURL=transition.d.ts.map
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
export type TransitionTiming = CSSTransitionTiming | PresetTransitionTiming;
export interface TransitionEntry {
	property: string;
	timing: TransitionTiming;
	delay: string;
	behavior: TransitionBehavior;
}
export interface TransitionIR {
	kind: "transition";
	entries: readonly TransitionEntry[];
	enter?: TransitionEntry;
	exit?: TransitionEntry;
	config?: Readonly<Record<string, unknown>>;
}
export interface TransitionGlobalIR {
	kind: "global";
	value: "inherit" | "initial" | "revert" | "revert-layer" | "unset";
}
export type ParsedTransition = TransitionIR | TransitionGlobalIR;
export interface TransitionDiagnostic {
	code: "transition-empty-item" | "transition-invalid-token" | "transition-duplicate-component" | "transition-invalid-duration" | "transition-invalid-list";
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
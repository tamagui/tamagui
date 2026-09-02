import { type TransitionBehavior, type TransitionDiagnostic, type TransitionObjectValue } from "@tamagui/style-grammar/transitions";
export type DriverTiming = {
	kind: "timing";
	durationMs: number;
	easing: string;
} | {
	kind: "spring";
	/** the undamped period, the portable "how fast does this feel" number */
	durationMs: number;
	bounce: number;
	stiffness: number;
	damping: number;
	mass: number;
	/** authored low-level overrides, for drivers that take them raw */
	extra?: Record<string, unknown>;
};
export interface ResolvedEntry {
	/** canonical property name, kebab-case, or `all` / `none` */
	property: string;
	timing: DriverTiming;
	delayMs: number;
	behavior: TransitionBehavior;
}
export interface ResolvedTransition {
	/** in authored order; later entries win under the css last-wins rule */
	entries: readonly ResolvedEntry[];
	/** the winning `all` entry, or null when only specific properties were named */
	all: ResolvedEntry | null;
	/** winning entry per canonical property name, excluding `all` */
	byProperty: Readonly<Record<string, ResolvedEntry>>;
	/** true when the author disabled transitions entirely (`transition="none"`) */
	none: boolean;
	/**
	* true when any entry was authored as a preset name or a `spring()`, the two
	* things that have no css spelling of their own. a resolution without one is
	* already plain css and needs no driver at all.
	*/
	fused: boolean;
	/** replaces this whole resolution while mounting, when the author set one */
	enter: ResolvedTransition | null;
	/** replaces this whole resolution while unmounting */
	exit: ResolvedTransition | null;
	diagnostics: readonly TransitionDiagnostic[];
}
/** the resolution that applies in a given animation state */
export declare function forAnimationState(resolved: ResolvedTransition, state: "enter" | "exit" | "default"): ResolvedTransition;
/**
* the css property name an entry is filed under, so `backgroundColor` and
* `background-color` are one key and cannot both silently apply.
*/
export declare function canonicalTransitionProperty(key: string): string;
export declare function isTransformProperty(key: string): boolean;
/**
* the style keys a css property covers, for drivers that key their per-property
* options by style key rather than css property (motion, react-native).
*/
export declare function styleKeysForProperty(property: string): readonly string[];
/**
* turns one entry in a driver's `animations` config into a timing.
*
* accepts every shape `PresetConfig` allows: a css string (`'350ms ease-out'`),
* spring physics (`{ type: 'spring', damping, stiffness, mass }`), a timing
* (`{ type: 'timing', duration, easing }`), and the canonical pair
* (`{ duration, bounce }`). configs written for any driver therefore resolve
* to the same motion on all four.
*/
export declare function presetToTiming(preset: unknown): DriverTiming | null;
/**
* a css easing as cubic-bezier control points, which is the only easing shape
* reanimated, motion, and react-native all accept.
*
* returns null for `steps()` and `linear()`, which have no bezier equivalent.
* a driver that gets null should fall back to its own default rather than
* pretending it applied something.
*/
export declare function easingToBezier(easing: string): readonly [number, number, number, number] | null;
export interface ResolveTransitionOptions {
	/** the driver's animations config; its keys are the valid preset names */
	animations?: Record<string, unknown> | null;
	/** config shorthands, so `transition="bg 200ms"` names backgroundColor */
	shorthands?: Record<string, string> | null;
}
/**
* parses and resolves a `transition` prop into driver-ready entries.
*
* memoized per (animations config, authored value), because this runs on every
* render of every component carrying a transition.
*/
export declare function resolveTransition(transition: TransitionObjectValue | null | undefined, options?: ResolveTransitionOptions): ResolvedTransition;
/**
* the transition that applies to one style key, under css last-wins.
*
* a transform part falls back to the `transform` entry before `all`, because
* css has one `transform` property and `transition="transform 200ms"` has to
* cover `scale` and `x` alike.
*/
export declare function getTransitionForKey(resolved: ResolvedTransition, key: string): ResolvedEntry | null;
/** true when anything at all will animate */
export declare function hasTransition(resolved: ResolvedTransition): boolean;
/**
* how long a timing actually runs, which for a spring is its settle time and
* not its nominal duration. this is the number a completion deadline needs.
*/
export declare function getSettleMs(timing: DriverTiming): number;
/** the longest anything will take, for the driver's completion bookkeeping */
export declare function getMaxDurationMs(resolved: ResolvedTransition): number;
/**
* one entry as css. a spring becomes a `linear()` easing sampled across its
* settle time, which is how a real spring curve, overshoot included, survives
* with no javascript running.
*/
export declare function entryToCSS(entry: ResolvedEntry): string;
/**
* the whole resolution as a css `transition` value, or `undefined` when
* nothing animates. entry order is preserved, so css last-wins does the
* per-property resolution for us in the browser.
*/
export declare function toCSSTransition(resolved: ResolvedTransition, filter?: readonly string[] | null): string | undefined;

//# sourceMappingURL=resolveTransition.d.ts.map
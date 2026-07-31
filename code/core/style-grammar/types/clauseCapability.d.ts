import type { ModifierKind, ModifierRegistryView } from "./valueTypes";
/**
* States the native evaluator can source right now: componentState fields
* plus enter/exit from the lifecycle. Component-tier states (open, checked,
* highlighted, invalid, …) need the behavior packages to feed componentState;
* until then they are web-only and the evaluator diagnoses them — it imports
* THIS set, so widening it here is what enables them there.
*/
export declare const nativeSourceableStates: ReadonlySet<string>;
/**
* States a group clause can source natively: the subset of the sourceable
* set that `subscribeToContextGroup` writes into componentState.group. The
* native evaluator derives its group-state key map from this set.
*/
export declare const nativeGroupSourceableStates: readonly string[];
export interface ClauseCapability {
	/** the clause can lower to web CSS */
	web: boolean;
	/** the clause can evaluate on native */
	native: boolean;
	/** why a side is unsupported, for diagnostics */
	note?: string;
}
/**
* Per-modifier capability. `kind` comes from the same registry the value was
* parsed against; an unregistered modifier is a parse error upstream and
* reports unsupported on both targets here.
*/
export declare function clauseCapability(modifier: string, kind: ModifierKind | undefined): ClauseCapability;
/** file-extension intent: shared files must support BOTH targets */
export type ConversionTargets = "shared" | "web" | "native";
/**
* Host validity as the consumer already holds it — a projection of the
* component's staticConfig, never a table of this package's own.
*/
export interface HostView {
	/** does this host accept `prop` as a style (validStyles + accept) */
	accepts(prop: string): boolean;
	/** for diagnostics: the component name the author sees */
	componentName?: string;
}
export interface ConversionReason {
	dimension: "property" | "clause" | "host";
	modifier?: string;
	message: string;
	/** the action the author takes, stated concretely */
	remedy: string;
}
export interface ConversionAssessment {
	/**
	* clean: convertible AND evaluable where authored, with ALL THREE
	* dimensions verified — clean is a promise, so an unchecked dimension can
	* never produce it. needs-relocation: the conversion is syntactically
	* right but this site was DETERMINED unable to evaluate it — the remedy
	* names where it goes. unknown-host: property and clauses verified but the
	* component identity could not be established, so host validity is
	* UNVERIFIED rather than fine — the site needs review, not relocation.
	* ineligible: this property cannot carry the clause spelling at all.
	*/
	verdict: "clean" | "needs-relocation" | "unknown-host" | "ineligible";
	reasons: readonly ConversionReason[];
}
export interface ConversionInput {
	property: string;
	/** modifiers used across the value's clauses, deduplicated by the caller or not */
	modifiers?: readonly string[];
	targets: ConversionTargets;
	/**
	* absent means the consumer could NOT establish the component's identity
	* (structural provenance proves only direct View/Text and traceable styled
	* bases today) — the verdict is then at best 'unknown-host', never 'clean'
	*/
	host?: HostView;
}
/**
* The one call a converter, lint rule, or report makes before claiming a
* flat-value suggestion is safe. Composes property eligibility, per-target
* clause capability, and host validity; consumers never combine axes
* themselves.
*/
export declare function assessFlatConversion(input: ConversionInput, registry: ModifierRegistryView): ConversionAssessment;

//# sourceMappingURL=clauseCapability.d.ts.map
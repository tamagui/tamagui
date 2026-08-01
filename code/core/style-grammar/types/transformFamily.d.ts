export interface TransformComposition {
	/** the CSS property the axis variables compose into */
	property: string;
	/** local axis defaults that prevent inherited parent transforms from leaking in */
	defaults: Readonly<Record<string, string>>;
	/** the composing declaration value, with per-axis fallbacks */
	value: string;
}
export type TransformTargetKind = "property" | "axis-variable";
export interface TransformTarget {
	prop: string;
	kind: TransformTargetKind;
	/** the declaration this program writes, and the property it hashes under */
	declaration: string;
	/** the CSS property that ultimately changes; two targets sharing this and
	*  differing in `kind` would fight for one declaration */
	effectiveProperty: string;
	/** present for `axis-variable` targets */
	composition?: TransformComposition;
}
/**
* One entry per program TARGET. Uniform `scale` is absent on purpose: it expands
* to both axis targets the way `padding` expands to four sides, so no two
* mechanisms ever write the CSS `scale` property and a later `scaleX` replaces
* just its axis through the ordinary forward merge.
*/
export declare const transformFamilyTargets: Readonly<Record<string, TransformTarget>>;
/** the authored props that lower through the transform family */
export declare const transformFamilyProps: ReadonlySet<string>;
/** the targets an authored transform prop contributes; empty when not in the family */
export declare function getTransformTargets(prop: string): readonly TransformTarget[];
/** the declarations an authored transform prop owns; empty when not in the family */
export declare function transformDeclarationsFor(prop: string): readonly string[];
/**
* Declaration -> the authored prop it evaluates as on native, so the evaluator
* can turn program results back into `composeTransformArray` input.
*/
export declare const transformPropForDeclaration: Readonly<Record<string, string>>;
/**
* The unit a bare legacy number carries for each declaration, so a displaced
* plain value lifts into a program base with the right spelling: lengths take
* px, scale is unitless, rotate takes deg.
*/
export declare const transformDeclarationUnit: Readonly<Record<string, "px" | "none" | "deg">>;
/** legacy flat transform keys that write a declaration, uniform parent last */
export declare const legacyTransformKeysFor: Readonly<Record<string, readonly string[]>>;
/** the sibling axis a uniform legacy `scale` also covers */
export declare const uniformLegacySiblings: Readonly<Record<string, string>>;
/**
* Custom property -> the rule composing its axis group, so the web lowering can
* emit the composing rule alongside an axis program without knowing the family.
*/
export declare const transformAxisCompositions: Readonly<Record<string, TransformComposition>>;
/** one React Native transform array entry */
export type TransformEntry = Readonly<Record<string, string | number | readonly number[]>>;
export type TransformDiagnosticCode = "unsupported-transform-function" | "unsupported-transform-unit" | "unsupported-matrix-length" | "unitless-transform-value" | "malformed-transform";
export interface TransformDiagnostic {
	code: TransformDiagnosticCode;
	/** the offending function, prop, or fragment */
	source: string;
	message: string;
}
/** evaluated program values, keyed by the authored transform prop */
export type TransformProgramResults = Readonly<Record<string, string | number | undefined | null>>;
export interface ComposedTransform {
	transform: TransformEntry[];
	errors: TransformDiagnostic[];
}
/**
* Builds one RN transform array in CSS individual-property order: translate
* (x then y), rotate, scale, then the raw `transform` entries. Nothing is
* sorted, and an unrepresentable value is a diagnostic rather than a lossy
* forward to RN's permissive string parser.
*/
export declare function composeTransformArray(results: TransformProgramResults, rawTransform?: string | readonly TransformEntry[] | null): ComposedTransform;
/**
* Parses a CSS transform string into RN array entries. Arrays are the only form
* Animated and Reanimated can animate, so the string is parsed exactly once here
* rather than handed to RN per frame.
*/
export declare function parseTransformString(input: string): ComposedTransform;

//# sourceMappingURL=transformFamily.d.ts.map
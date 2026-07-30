export interface TransformComposition {
	/** the CSS property the axis variables compose into */
	property: string;
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
export declare const transformFamilyTargets: Readonly<Record<string, TransformTarget>>;
/** the authored props that lower through the transform family */
export declare const transformFamilyProps: ReadonlySet<string>;
export declare function getTransformTarget(prop: string): TransformTarget | undefined;
/**
* Custom property -> the rule composing its axis group, so the web lowering can
* emit the composing rule alongside an axis program without knowing the family.
*/
export declare const transformAxisCompositions: Readonly<Record<string, TransformComposition>>;
/** one React Native transform array entry */
export type TransformEntry = Readonly<Record<string, string | number | readonly number[]>>;
export type TransformDiagnosticCode = "unsupported-transform-function" | "unsupported-transform-unit" | "unsupported-matrix-length" | "unitless-transform-value" | "transform-scale-conflict" | "malformed-transform";
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
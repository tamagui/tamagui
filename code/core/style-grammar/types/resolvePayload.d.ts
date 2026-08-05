export type ReferenceKind = "color" | "length" | "number" | "other";
/**
* What a lookup returns for a configured token or variable. Intentionally open:
* the variables unification (design item 11) can carry more here, and extra
* fields ride through onto the emitted reference.
*/
export interface ResolvedReference {
	/** the resolved name, which is what the serializers key on */
	name: string;
	kind: ReferenceKind;
}
/** a resolved reference in a payload, with its color opacity suffix if any */
export type PayloadReference = ResolvedReference & {
	/** integer 1-99; only ever present when `kind` is `color` */
	opacity?: number;
};
export type PayloadSegment = string | PayloadReference;
export type PayloadResolveErrorCode = "opacity-on-non-color" | "opacity-out-of-range";
export interface PayloadResolveError {
	code: PayloadResolveErrorCode;
	/** character offset of the identifier within the payload */
	index: number;
	message: string;
	/** the identifier the suffix was applied to, without the suffix */
	name: string;
	/** the percentage as authored, which may be out of range or fractional */
	opacity: number;
}
export interface ResolvedPayload {
	/** static text runs and references, in payload order; adjacent text collapses */
	segments: readonly PayloadSegment[];
	/** every reference in `segments`, same objects, in order */
	references: readonly PayloadReference[];
	errors: readonly PayloadResolveError[];
}
export interface ResolvePayloadOptions {
	/** the property's bound token categories first, then the variables namespace */
	lookup(name: string): ResolvedReference | undefined;
	/**
	* set when the property binds a numeric token category (space, size, radius,
	* z-index). Off means bare numbers are always literal.
	*/
	resolveNumbers?: boolean;
}
export declare function resolvePayload(payload: string, options: ResolvePayloadOptions): ResolvedPayload;
export type ColorOpacitySuffix = {
	kind: "none";
} | {
	kind: "valid";
	name: string;
	opacity: number;
} | {
	kind: "invalid";
	name: string;
	raw: string;
};
/**
* The one owner of the color opacity suffix rule for WHOLE names
* (`slate-500/50`). Every layer — flat payloads (via `readOpacitySuffix`
* below, same rules anchored mid-payload), Tailwind candidates, and whole
* color token values must agree: valid means an unsigned integer 0 through
* 100; an invalid attempt is a diagnostic and is never clamped or partially
* applied (review divergence 2).
*/
export declare function splitColorOpacitySuffix(value: string): ColorOpacitySuffix;

//# sourceMappingURL=resolvePayload.d.ts.map
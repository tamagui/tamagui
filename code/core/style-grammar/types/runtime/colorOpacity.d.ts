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
* (`slate-500/50`). Every layer — flat payloads, Tailwind candidates, and whole
* color token values must agree: valid means an unsigned integer 0 through
* 100; an invalid attempt is a diagnostic and is never clamped or partially
* applied.
*/
export declare function splitColorOpacitySuffix(value: string): ColorOpacitySuffix;

//# sourceMappingURL=colorOpacity.d.ts.map
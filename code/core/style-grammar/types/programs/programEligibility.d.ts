/**
* Props with no per-part flat clause spelling BY DESIGN, mapped to the
* composite property that owns their clause spelling.
*
* - RN shadow parts are not CSS longhands: plain values compose into
*   boxShadow/textShadow (web `styleToCSS`) or pass straight to the RN host,
*   and the composite property carries any conditional.
* - Transform parts outside the flat family (skews, 3D rotations,
*   perspective, matrix) have no per-part spelling; the raw `transform`
*   property is one ordinary program and owns their clauses (design record,
*   "The transform family").
*/
export declare const legacyPartComposite: Readonly<Record<string, string>>;
export type ProgramEligibility = "program" | "legacy-part";
/**
* 'program': a clause-bearing flat value on this prop evaluates through the
* program engine. 'legacy-part': plain values keep their legacy pipeline and
* a clause-bearing value is a diagnostic naming the composite — never a
* silent forward, never a codemod conversion.
*/
export declare function programEligibility(prop: string): ProgramEligibility;

//# sourceMappingURL=programEligibility.d.ts.map
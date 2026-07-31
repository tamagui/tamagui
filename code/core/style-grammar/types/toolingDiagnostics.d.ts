import type { GrammarConfigView } from "./candidate";
import { type CandidateContribution, type CandidatePropertyMismatch } from "./candidateTarget";
import type { ModifierRegistryView, ParsedValue, ValueParseError, ValueParseErrorCode } from "./valueTypes";
export type CandidatePropertyVocabulary = ReadonlyMap<string, readonly CandidateContribution[]>;
export type StyleValueDiagnosticCode = ValueParseErrorCode | CandidatePropertyMismatch["code"] | "v6-theme-name-replaced" | "v6-theme-name-removed";
export interface StyleValueDiagnostic {
	code: StyleValueDiagnosticCode;
	index: number;
	message: string;
	candidate?: string;
	property?: string;
	contributedProperties?: readonly string[];
	replacement?: string;
}
export interface DiagnoseStyleValueOptions {
	config: GrammarConfigView;
	registry: ModifierRegistryView;
	candidates?: CandidatePropertyVocabulary;
}
export type CanonicalStyleValueResult = {
	ok: true;
	value: string;
	parsed: ParsedValue;
} | {
	ok: false;
	errors: readonly ValueParseError[];
};
/** Prints one parsed value without changing payloads, modifier order, or clause order. */
export declare function formatParsedValue(value: ParsedValue): string;
/** Parses and prints the canonical surface spelling for the same value IR. */
export declare function canonicalizeStyleValue(input: string, registry: ModifierRegistryView): CanonicalStyleValueResult;
/**
* Projects the config vocabulary into the properties each name can target.
*
* Tooling consumes this projection rather than inferring from spelling. A name
* shared by categories keeps every contribution, and the shared target
* validator selects the authored property or reports the mismatch.
*/
export declare function createCandidatePropertyVocabulary(config: GrammarConfigView): CandidatePropertyVocabulary;
/**
* Returns the diagnostics every static frontend must agree on for one authored
* style value. Source tools locate the value; this function owns its meaning.
*/
export declare function diagnoseStyleValue(property: string, input: string, options: DiagnoseStyleValueOptions): readonly StyleValueDiagnostic[];

//# sourceMappingURL=toolingDiagnostics.d.ts.map
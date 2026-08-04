import type { GrammarConfigView } from "./candidate";
import { type CandidateContribution, type CandidatePropertyMismatch } from "./candidateTarget";
import { type GrammarSourceConfig } from "./config";
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
export interface SerializedGrammarSourceConfig {
	shorthands?: GrammarSourceConfig["shorthands"];
	media?: GrammarSourceConfig["media"];
	themes?: GrammarSourceConfig["themes"];
	tokens?: GrammarSourceConfig["tokensParsed"];
	fonts?: GrammarSourceConfig["fontsParsed"];
}
export interface SerializedGrammarConfigMetadata {
	themeFields: "values-only";
}
export type StyleValueCompletionKind = "configured" | "keyword" | "modifier";
export interface StyleValueCompletion {
	value: string;
	kind: StyleValueCompletionKind;
	insertText?: string;
}
export interface StyleValueCursorCompletions {
	replaceStart: number;
	replaceLength: number;
	completions: readonly StyleValueCompletion[];
}
export type CanonicalStyleValueResult = {
	ok: true;
	value: string;
	parsed: ParsedValue;
} | {
	ok: false;
	errors: readonly ValueParseError[];
};
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
* Projects the JSON config emitted by Tamagui's compiler into the same grammar
* view the runtime creates from its live config.
*/
export declare function createGrammarConfigViewFromSerializedConfig(config: SerializedGrammarSourceConfig, metadata?: unknown): GrammarConfigView;
/**
* Returns the diagnostics every static frontend must agree on for one authored
* style value. Source tools locate the value; this function owns its meaning.
*/
export declare function diagnoseStyleValue(property: string, input: string, options: DiagnoseStyleValueOptions): readonly StyleValueDiagnostic[];
/**
* Returns the finite configured and keyword values that are valid for one
* property. Every result passes through the same parser, config lookup, and
* target validator used by diagnostics.
*/
export declare function completeStyleValue(property: string, options: DiagnoseStyleValueOptions): readonly StyleValueCompletion[];
/**
* Returns completions and a replacement span for one cursor position. Source
* boundaries come from the runtime value scanner, including incomplete clause
* payloads and modifier chains.
*/
export declare function completeStyleValueAtCursor(property: string, input: string, cursor: number, options: DiagnoseStyleValueOptions): StyleValueCursorCompletions | null;

//# sourceMappingURL=toolingDiagnostics.d.ts.map
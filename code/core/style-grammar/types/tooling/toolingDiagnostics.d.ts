import type { GrammarConfigView } from "./candidate";
import { type CandidateContribution, type CandidatePropertyMismatch } from "./candidateTarget";
import { type GrammarSourceConfig } from "./config";
import { type PayloadShapeDiagnostic } from "../ast/payloadShape";
import { type PayloadResolveErrorCode, type ReferenceKind } from "../ast/resolvePayload";
import { type ValueSourceSpan } from "../ast/valueParser";
import type { ModifierRegistryView, ParsedValue, ValueParseError, ValueParseErrorCode } from "../ast/valueTypes";
export type CandidatePropertyVocabulary = ReadonlyMap<string, readonly CandidateContribution[]>;
export type StyleValueDiagnosticCode = ValueParseErrorCode | PayloadResolveErrorCode | CandidatePropertyMismatch["code"] | PayloadShapeDiagnostic["code"] | "legacy-part-conditional" | "v6-theme-name-replaced" | "v6-theme-name-removed";
export interface StyleValueDiagnostic {
	code: StyleValueDiagnosticCode;
	/** kept for compatibility; always equals `start` */
	index: number;
	/** character span within the authored value the diagnostic points at */
	start: number;
	end: number;
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
* The reference kind a candidate resolves as for one target property: the
* category it binds the target through, else color if any contribution is a
* color (so opacity suffixes keep their authored meaning), else the first.
*/
export declare function referenceKindFor(contributions: readonly CandidateContribution[], targetProperty: string): ReferenceKind;
/**
* Returns the diagnostics every static frontend must agree on for one authored
* style value. Source tools locate the value; this function owns its meaning.
*/
export declare function diagnoseStyleValue(property: string, input: string, options: DiagnoseStyleValueOptions): readonly StyleValueDiagnostic[];
/**
* The modifier chain whose final colon sits directly before `start`, outermost
* first. Shared by cursor completions and value annotations.
*/
export declare function modifierChainBefore(input: string, spans: readonly ValueSourceSpan[], start: number): readonly string[];
/**
* Every prop name static tooling treats as a flat style value site: grammar
* properties, legacy part props, and both sides of every configured shorthand.
*/
export declare function createStylePropSet(config: GrammarConfigView): ReadonlySet<string>;
/**
* The complete static verdict for one authored value: everything
* `diagnoseStyleValue` reports, plus the program-level rules — part props take
* no conditionals, geometric shorthands split before per-slot target checks,
* and single-value longhands take one component per slot. Every static
* frontend (editor plugin, checker, lint rule) reports exactly this list.
*/
export declare function diagnoseStyleValueProgram(property: string, input: string, options: DiagnoseStyleValueOptions): readonly StyleValueDiagnostic[];
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
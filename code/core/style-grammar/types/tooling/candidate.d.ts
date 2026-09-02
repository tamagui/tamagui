import { type GrammarEntry, type TokenCategory } from "./registry";
type Names = readonly string[] | ReadonlySet<string> | Readonly<Record<string, unknown>>;
export interface GrammarConfigView {
	shorthands?: Readonly<Record<string, string>>;
	mediaNames?: Names;
	themeNames?: Names;
	platformNames?: Names;
	tokenNames?: Partial<Record<TokenCategory, Names>>;
	/**
	* the media keys that measure a size, so `@key:` is a meaningful container
	* query. derived by createGrammarConfigView when the media input carries
	* query information; absent means UNKNOWN, and the modifier registry then
	* refuses container claims with a diagnostic rather than over-claiming
	*/
	containerSizeNames?: readonly string[];
}
export interface ParsedCandidate {
	candidate: string;
	base: string;
	modifiers: readonly string[];
	negative: boolean;
	kind: "utility" | "dynamic";
	valueKind: "token" | "arbitrary" | "enum" | "convenience";
	properties?: Readonly<Record<string, string | number>>;
	entry?: GrammarEntry;
	prefix?: string;
	rawValue?: string;
	arbitrary?: boolean;
	convenience?: string;
}
export type CandidateClassification = {
	kind: "tamagui";
	parsed: ParsedCandidate;
} | {
	kind: "passthrough";
	reason: string;
};
export declare function hasTokenName(config: GrammarConfigView, category: TokenCategory, name: string): boolean;
export declare function decimalHalfTokenAlias(name: string): string | null;
export declare function resolveTokenName(config: GrammarConfigView, category: TokenCategory, name: string): string | null;
export declare function parseCandidate(candidate: string, config: GrammarConfigView): ParsedCandidate | null;
export declare function classifyCandidate(candidate: string, config: GrammarConfigView): CandidateClassification;
export interface FormatCandidateInput {
	prop: string;
	value: string;
	valueKind: ParsedCandidate["valueKind"];
	modifiers?: readonly string[];
}
export declare function formatCandidate({ prop, value, valueKind, modifiers }: FormatCandidateInput, config?: GrammarConfigView): string | null;
export declare function encodeArbitrary(value: string): string;
export declare function decodeArbitrary(value: string): string;
export {};

//# sourceMappingURL=candidate.d.ts.map
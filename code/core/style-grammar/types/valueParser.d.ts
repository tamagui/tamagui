import type { ModifierRegistryView, ValueParseResult } from "./valueTypes";
export interface ValueSourceSpan {
	kind: "base" | "payload" | "modifier" | "word";
	start: number;
	end: number;
}
export interface ValueParseWithSourceSpans {
	result: ValueParseResult;
	spans: readonly ValueSourceSpan[];
}
/**
* NOT A SAFETY CHECK. A successful parse says the value is well-formed FLAT
* VALUE SYNTAX. It does not say the value is safe to interpolate into CSS.
*
* `scanFlatValue` is a clause lexer, not a CSS tokenizer, and it currently
* ACCEPTS two payloads that escape a declaration once emitted (verified 2026-08-18):
*
*   '"abc\n;}.injected{opacity 0"'   a string CSS ends at the newline
*   'red/*'                            an unterminated comment
*
* That is not a live hole today, and the reason is worth stating so nobody
* removes it by accident: `emitValue` and `getStyleObject` call
* `carriesTopLevelInjection` INDEPENDENTLY, and nothing treats this function's
* verdict as a safety signal.
*
* So: never gate emission on `parseValue(...).ok`. The day something does, both
* payloads above ship. Item 29 makes the lexer faithful on strings, comments and
* url-tokens, after which the guard can consume it and this warning goes away.
*/
export declare function parseValue(input: string, registry: ModifierRegistryView): ValueParseResult;
/**
* Parses through the runtime scanner while also retaining source boundaries for
* editor tooling. The ordinary runtime path does not allocate these spans.
*/
export declare function parseValueWithSourceSpans(input: string, registry: ModifierRegistryView): ValueParseWithSourceSpans;

//# sourceMappingURL=valueParser.d.ts.map
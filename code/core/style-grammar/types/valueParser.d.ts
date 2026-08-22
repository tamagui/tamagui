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
* `scanFlatValue` tracks the same constructs CSS's tokenizer does (comments,
* strings that a newline ends, `url()`, paren nesting), so a value whose
* delimiters do not actually close is an error rather than silently trusted.
* That covers the constructs a value can leave OPEN; it is not an injection
* guard. `emitValue` and `getStyleObject` used to call a
* `carriesTopLevelInjection` guard independently; it was removed by owner
* decision, on the grounds that a style value is authored rather than user
* input, and the web lowering emits payloads verbatim by contract.
*
* So the rule lives upstream of this file: never put a user-controlled string
* in a style value. A payload carrying `;}` closes its own rule and everything
* after it is a selector block the author never wrote. Do not gate emission on
* `parseValue(...).ok` either; it answers a syntax question, not a safety one.
*/
export declare function parseValue(input: string, registry: ModifierRegistryView): ValueParseResult;
/**
* Parses through the runtime scanner while also retaining source boundaries for
* editor tooling. The ordinary runtime path does not allocate these spans.
*/
export declare function parseValueWithSourceSpans(input: string, registry: ModifierRegistryView): ValueParseWithSourceSpans;

//# sourceMappingURL=valueParser.d.ts.map
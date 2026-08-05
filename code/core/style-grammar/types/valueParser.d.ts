import type { ModifierRegistryView, ValueParseResult } from "./valueTypes";
export interface ValueSourceSpan {
	kind: "base" | "payload" | "modifier";
	start: number;
	end: number;
}
export interface ValueParseWithSourceSpans {
	result: ValueParseResult;
	spans: readonly ValueSourceSpan[];
}
export declare function parseValue(input: string, registry: ModifierRegistryView): ValueParseResult;
/**
* Parses through the runtime scanner while also retaining source boundaries for
* editor tooling. The ordinary runtime path does not allocate these spans.
*/
export declare function parseValueWithSourceSpans(input: string, registry: ModifierRegistryView): ValueParseWithSourceSpans;

//# sourceMappingURL=valueParser.d.ts.map
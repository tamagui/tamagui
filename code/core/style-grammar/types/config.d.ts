import type { GrammarConfigView } from "./candidate";
type Names = readonly string[] | ReadonlySet<string> | Readonly<Record<string, unknown>>;
type GrammarFontConfig = {
	size?: Readonly<Record<string, unknown>>;
	lineHeight?: Readonly<Record<string, unknown>>;
	letterSpacing?: Readonly<Record<string, unknown>>;
};
export type GrammarSourceConfig = {
	shorthands?: Readonly<Record<string, string>>;
	media?: Names;
	themes?: Readonly<Record<string, unknown>>;
	tokensParsed?: Partial<Record<"space" | "size" | "radius" | "zIndex" | "color", Readonly<Record<string, unknown>>>>;
	fontsParsed?: Readonly<Record<string, GrammarFontConfig | undefined>>;
};
export type CreateGrammarConfigViewOptions = {
	platformNames?: Names;
};
export declare const grammarPlatformNames: ReadonlySet<string>;
/**
* Creates the dependency-free config projection consumed by the shared style grammar.
* Runtime and compiler integrations must classify candidates through this same view so
* a candidate cannot be claimed by one side and emitted by the other.
*/
export declare function createGrammarConfigView(config: GrammarSourceConfig, options?: CreateGrammarConfigViewOptions): GrammarConfigView;
export {};

//# sourceMappingURL=config.d.ts.map
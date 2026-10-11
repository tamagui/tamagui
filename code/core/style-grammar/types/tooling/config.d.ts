import type { GrammarConfigView } from "./candidate";
import type { TokenCategory } from "./registry";
type Names = readonly string[] | ReadonlySet<string> | Readonly<Record<string, unknown>>;
type GrammarFontConfig = {
	size?: Readonly<Record<string, unknown>>;
	weight?: Readonly<Record<string, unknown>>;
	lineHeight?: Readonly<Record<string, unknown>>;
	letterSpacing?: Readonly<Record<string, unknown>>;
};
export type GrammarSourceConfig = {
	shorthands?: Readonly<Record<string, string>>;
	media?: Names;
	themes?: Readonly<Record<string, unknown>>;
	tokensParsed?: Partial<Record<string, Readonly<Record<string, unknown>>>>;
	fontsParsed?: Readonly<Record<string, GrammarFontConfig | undefined>>;
};
export type CreateGrammarConfigViewOptions = {
	platformNames?: Names;
	/** overrides the derived container size set (the web adapter's resolved set) */
	containerSizeNames?: readonly string[];
};
export declare function isContainerSizeQueryText(query: string): boolean;
/**
* The one owner of "does this media query measure a size". A `hover` or
* `pointer` key measures nothing a container has, so it gets no `@` form.
* Accepts the query TEXT (`(min-width: 900px)`) or the config's media OBJECT
* (`{ minWidth: 900 }`) — both spellings of the same fact.
*/
export declare function isContainerSizeQuery(query: unknown): boolean;
export declare const grammarPlatformNames: ReadonlySet<string>;
export declare const grammarPlatformGroups: ReadonlyMap<string, ReadonlySet<string>>;
/**
* Platform clause specificity, mirroring the runtime directStyle ranks: a TV
* variant beats its base platform, which beats `native`, independent of
* authored order. Non-platform modifiers never rank.
*/
export declare function grammarPlatformRank(modifier: string): number;
/**
* Token groups named after one property. A config that defines the group binds
* the property to it; one that does not resolves the property through the
* fallback category, so legacy configs keep their classes.
*/
export declare const propTokenGroupFallbacks: Readonly<Record<string, TokenCategory>>;
/**
* Creates the dependency-free config projection consumed by the shared style grammar.
* Runtime and compiler integrations must classify candidates through this same view so
* a candidate cannot be claimed by one side and emitted by the other.
*/
export declare function createGrammarConfigView(config: GrammarSourceConfig, options?: CreateGrammarConfigViewOptions): GrammarConfigView;
export {};

//# sourceMappingURL=config.d.ts.map
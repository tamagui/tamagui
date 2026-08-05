export type ModifierKind = "state" | "theme" | "media" | "platform" | "group" | "container";
/**
* What the parser needs to know about registered modifiers. Implementations
* project the user config (media keys, sub-themes, platform names) plus the
* built-in state vocabulary into this view. Parameterized modifiers
* (`group-<name>-<state>`) are the implementation's concern — `get` receives
* the full authored spelling.
*/
export interface ModifierRegistryView {
	get(name: string): ModifierKind | undefined;
}
/** one `modifiers ":" payload` clause, modifiers in authored order */
export interface ParsedClause {
	modifiers: readonly string[];
	/** trimmed raw CSS component-value sequence; never empty */
	payload: string;
}
export interface ParsedValue {
	/** trimmed unconditional leading value, or null when the string starts with a clause */
	base: string | null;
	clauses: readonly ParsedClause[];
}
export type ValueParseErrorCode = "unregistered-modifier" | "empty-payload" | "empty-modifier" | "unterminated-string" | "unterminated-function" | "invalid-character";
export interface ValueParseError {
	code: ValueParseErrorCode;
	/** character offset into the source string where the error was detected */
	index: number;
	message: string;
	/** the offending modifier spelling, for unregistered-modifier */
	modifier?: string;
}
export type ValueParseResult = {
	ok: true;
	value: ParsedValue;
} | {
	ok: false;
	errors: readonly ValueParseError[];
};
/**
* CSS-wide keywords and universal values that resolve as literal CSS even when
* ident resolution is config-first. A token may never take one of these names;
* config creation must reject it. Shared by the parser's ident resolution and
* config-time validation.
*/
export declare const reservedCssIdents: ReadonlySet<string>;
/**
* One longhand's merged program: which CSS longhand, the parsed value that owns
* it, and which authored prop contributed it (for diagnostics and devtools).
*/
export interface LonghandProgram {
	/** camelCase longhand matching React Native / react style keys */
	property: string;
	value: ParsedValue;
	/** the authored prop name that won this longhand */
	sourceProp: string;
}

//# sourceMappingURL=valueTypes.d.ts.map
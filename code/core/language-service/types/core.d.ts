import { type DiagnoseStyleValueOptions, type ModifierKind, type SerializedGrammarSourceConfig, type StyleValueAnnotation, type StyleValueCompletion, type StyleValueCursorCompletions, type StyleValueDiagnostic } from "@tamagui/style-grammar/tooling";
export type { StyleValueAnnotation, StyleValueCompletion, StyleValueCursorCompletions, StyleValueDiagnostic };
/** the shape of the JSON artifact the Tamagui compiler writes */
export interface SerializedConfigFile {
	tamaguiConfig?: SerializedGrammarSourceConfig;
	tamaguiConfigMetadata?: unknown;
}
export interface RgbaColor {
	r: number;
	g: number;
	b: number;
	a: number;
}
export interface StyleValueColor {
	/** character span within the authored value */
	start: number;
	end: number;
	text: string;
	color: RgbaColor;
	/** the theme the preview value came from, when theme-resolved */
	theme?: string;
}
export interface StyleValueHover {
	/** character span within the authored value */
	start: number;
	end: number;
	text: string;
	/** markdown suitable for an editor hover */
	markdown: string;
	/** a representative color for colorish targets */
	color?: RgbaColor;
}
/**
* The one sort key every host uses for completion entries, so ordering does
* not drift between tsserver, LSP, and in-browser consumers: states first in
* interaction order, then groups, media, containers, themes, platforms, then
* configured values, then keywords.
*/
export declare function completionSortText(completion: StyleValueCompletion, modifierKind: ModifierKind | undefined): string;
export interface StyleTooling {
	/** every prop name treated as a flat style value site */
	styleProps: ReadonlySet<string>;
	/** engine options, for hosts that call @tamagui/style-grammar directly */
	engine: DiagnoseStyleValueOptions;
	isStyleProp(name: string): boolean;
	/** the longhand a prop resolves to through the configured shorthands */
	targetProperty(name: string): string;
	/**
	* cursor completions for one value slot, or null when the property takes no
	* flat program (unknown props, legacy part props)
	*/
	completions(property: string, value: string, cursor: number): StyleValueCursorCompletions | null;
	/** the complete static verdict for one authored value */
	diagnostics(property: string, value: string): readonly StyleValueDiagnostic[];
	/** classified spans: modifiers, tokens, keywords, literals */
	annotations(property: string, value: string): readonly StyleValueAnnotation[];
	/** hover content for the annotation under `offset`, or null */
	hover(property: string, value: string, offset: number): StyleValueHover | null;
	/** every span that resolves to a presentable color */
	colors(property: string, value: string): readonly StyleValueColor[];
	/** the modifier kind of a registered modifier name */
	modifierKind(name: string): ModifierKind | undefined;
	/** root theme names, preview themes first */
	previewThemes: readonly string[];
}
export declare function createStyleTooling(file: SerializedConfigFile): StyleTooling | null;

//# sourceMappingURL=core.d.ts.map
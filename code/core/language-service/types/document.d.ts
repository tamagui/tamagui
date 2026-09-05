import type { StyleTooling, StyleValueColor, StyleValueDiagnostic, StyleValueHover } from "./core";
import type { StyleValueCursorCompletions } from "./core";
/** one static string style value in a source file */
export interface StyleSite {
	/** the authored prop name (`bg`, `padding`) */
	property: string;
	/** the cooked string value */
	value: string;
	/** file offset of the value's first character (inside the quotes) */
	start: number;
	/** file offset just past the value's last character */
	end: number;
	/** how the site was authored, for hosts that filter */
	kind: "jsx-attribute" | "styled-property";
}
export type ExtractStyleSites = (source: string, fileName?: string) => readonly StyleSite[];
export interface DocumentDiagnostic extends StyleValueDiagnostic {
	site: StyleSite;
}
export interface DocumentColor extends StyleValueColor {
	site: StyleSite;
}
export interface DocumentHover extends StyleValueHover {
	site: StyleSite;
}
export interface DocumentCompletions extends StyleValueCursorCompletions {
	site: StyleSite;
}
export interface DocumentStyleTooling {
	sites(source: string, fileName?: string): readonly StyleSite[];
	/** completions at a file offset, spans mapped to file offsets */
	completionsAt(source: string, offset: number, fileName?: string): DocumentCompletions | null;
	/** every diagnostic in the file, spans mapped to file offsets */
	diagnostics(source: string, fileName?: string): readonly DocumentDiagnostic[];
	/** hover at a file offset, span mapped to file offsets */
	hoverAt(source: string, offset: number, fileName?: string): DocumentHover | null;
	/** every color swatch in the file, spans mapped to file offsets */
	colors(source: string, fileName?: string): readonly DocumentColor[];
}
export declare function createDocumentStyleTooling(tooling: StyleTooling, extract: ExtractStyleSites): DocumentStyleTooling;

//# sourceMappingURL=document.d.ts.map
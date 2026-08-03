import { modifierAliases } from "./stateModifiers";
export { modifierAliases };
export type TokenCategory = "space" | "size" | "radius" | "color" | "fontFamily" | "fontSize" | "fontWeight" | "lineHeight" | "letterSpacing";
export type Convenience = "alignment-alias" | "bare-border" | "flex-bundle" | "font-generic" | "integer" | "percentage" | "sizing-keyword";
export interface GrammarEntry {
	prop: string;
	prefix: string;
	tokenCategory?: TokenCategory;
	conveniences?: readonly Convenience[];
}
export declare const grammarEntries: readonly GrammarEntry[];
export declare const propToGrammarEntry: Readonly<Record<string, GrammarEntry>>;
export declare function getTokenCategory(prop: string): TokenCategory | null;
export declare const prefixToEntries: Readonly<Record<string, readonly GrammarEntry[]>>;
export declare const standaloneValueProps: Readonly<Record<string, Readonly<Record<string, string>>>>;
export declare const fontWeightNames: Readonly<Record<string, string>>;
export declare const wholeClassUtilities: Readonly<Record<string, Readonly<Record<string, string | number>>>>;
export declare const wholeClassConveniences: Readonly<Record<string, Convenience>>;
export declare const borderSideSuffix: Readonly<Record<string, readonly string[]>>;
export declare const radiusCornerProps: Readonly<Record<string, readonly string[]>>;
export declare const textAlignKeywords: ReadonlySet<string>;
export declare const percentUtilityProps: ReadonlySet<string>;

//# sourceMappingURL=registry.d.ts.map
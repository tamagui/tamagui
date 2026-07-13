export type TokenCategory = "space" | "size" | "radius" | "zIndex" | "color" | "fontFamily" | "fontSize" | "lineHeight" | "letterSpacing";
export type Convenience = "alignment-alias" | "bare-border" | "flex-bundle" | "font-generic" | "percentage" | "sizing-keyword";
export type GrammarDecision = {
	syntax: string;
	decision: "keep" | "drop";
	reason: string;
};
export interface GrammarEntry {
	prop: string;
	prefix: string;
	tokenCategory?: TokenCategory;
	conveniences?: readonly Convenience[];
}
export declare const grammarEntries: readonly GrammarEntry[];
export declare const propToTailwindPrefix: Readonly<Record<string, string>>;
export declare const propToGrammarEntry: Readonly<Record<string, GrammarEntry>>;
export declare function getTokenCategory(prop: string): TokenCategory | null;
export declare const prefixToEntries: Readonly<Record<string, readonly GrammarEntry[]>>;
export declare const standaloneValueProps: Readonly<Record<string, Readonly<Record<string, string>>>>;
export declare const fontWeightNames: Readonly<Record<string, string>>;
export declare const wholeClassUtilities: Readonly<Record<string, Readonly<Record<string, string | number>>>>;
export declare const wholeClassConveniences: Readonly<Record<string, Convenience>>;
export declare const pseudoToModifier: Readonly<Record<string, string>>;
export declare const modifierAliases: Readonly<Record<string, string>>;
export declare const modifierToPseudo: Readonly<Record<string, string>>;
export declare const defaultMediaKeys: readonly string[];
export declare const borderSideSuffix: Readonly<Record<string, readonly string[]>>;
export declare const radiusCornerProps: Readonly<Record<string, readonly string[]>>;
export declare const textAlignKeywords: ReadonlySet<string>;
export declare const percentUtilityProps: ReadonlySet<string>;
export declare const grammarDecisions: readonly GrammarDecision[];

//# sourceMappingURL=registry.d.ts.map
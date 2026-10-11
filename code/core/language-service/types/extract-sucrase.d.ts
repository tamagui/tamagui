import type { ExtractStyleSites } from "./document";
export interface SucraseToken {
	type: number;
	start: number;
	end: number;
}
export interface SucraseParser {
	parse(code: string, isJSXEnabled: boolean, isTypeScriptEnabled: boolean, isFlowEnabled: boolean): {
		tokens: SucraseToken[];
	};
	TokenType: Readonly<Record<string, number>>;
}
export interface SucraseExtractorOptions {
	/** which prop names produce sites; default: every prop */
	isStyleProp?: (name: string) => boolean;
	/**
	* which import sources mark components and `styled` as tamagui's.
	* default: `tamagui`, `tamagui/*`, `@tamagui/*`
	*/
	isTamaguiModule?: (source: string) => boolean;
	/** treat every capitalized JSX element as a tamagui component */
	allComponents?: boolean;
}
export declare function createSucraseStyleSiteExtractor(parser: SucraseParser, options?: SucraseExtractorOptions): ExtractStyleSites;

//# sourceMappingURL=extract-sucrase.d.ts.map
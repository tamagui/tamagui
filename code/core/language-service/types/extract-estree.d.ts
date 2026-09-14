import type { StyleSite } from "./document";
export interface EstreeStyleSite extends StyleSite {
	/** the Literal or TemplateLiteral node holding the value, for reporters */
	node: unknown;
}
export interface EstreeExtractorOptions {
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
export declare function extractStyleSitesFromEstree(program: unknown, options?: EstreeExtractorOptions): readonly EstreeStyleSite[];

//# sourceMappingURL=extract-estree.d.ts.map
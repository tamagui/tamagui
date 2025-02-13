export declare function matchQuery(mediaQuery: string, values: Record<string, any>): boolean;
export declare function parseQuery(mediaQuery: string): ({
	inverse: boolean;
	type: string;
	expressions: {
		modifier: any;
		feature: any;
		value: any;
	}[];
} | null)[];

//# sourceMappingURL=matchQuery.d.ts.map
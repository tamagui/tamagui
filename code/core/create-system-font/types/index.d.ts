import type { FillInFont, GenericFont } from "@tamagui/core";
type SystemFontSizes = Record<string | number, number>;
type SystemFontKeys<Sizes extends SystemFontSizes> = keyof Sizes & (string | number);
type CreateSystemFontOptions<
	A extends GenericFont,
	Sizes extends SystemFontSizes
> = {
	font?: Partial<A>;
	sizes?: Sizes;
	sizeLineHeight?: (fontSize: number) => number;
	sizeSize?: (size: number) => number;
	family?: string;
	weight?: GenericFont["weight"];
	letterSpacing?: GenericFont["letterSpacing"];
};
export declare const systemFontFamily: {
	readonly web: "-apple-system, system-ui, BlinkMacSystemFont, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif";
	readonly native: "System";
};
export declare const webSystemFontSizes: {
	readonly 1: 12;
	readonly 2: 13;
	readonly 3: 14;
	readonly 4: 15;
	readonly true: 15;
	readonly 5: 16;
	readonly 6: 18;
	readonly 7: 22;
	readonly 8: 26;
	readonly 9: 30;
	readonly 10: 40;
	readonly 11: 46;
	readonly 12: 52;
	readonly 13: 60;
	readonly 14: 70;
	readonly 15: 85;
	readonly 16: 100;
};
export declare const nativeSystemFontSizes: {
	readonly 1: 11;
	readonly 2: 12;
	readonly 3: 15;
	readonly 4: 17;
	readonly true: 17;
	readonly 5: 20;
	readonly 6: 22;
	readonly 7: 24;
	readonly 8: 28;
	readonly 9: 32;
	readonly 10: 40;
	readonly 11: 46;
	readonly 12: 52;
	readonly 13: 60;
	readonly 14: 70;
	readonly 15: 85;
	readonly 16: 100;
};
export declare const defaultSystemFontSizes: typeof nativeSystemFontSizes | typeof webSystemFontSizes;
export declare const defaultSystemFontLineHeight: (size: number) => number;
export declare const createSystemFont: <
	A extends GenericFont,
	Sizes extends SystemFontSizes = typeof webSystemFontSizes
>({ font, sizes, sizeLineHeight, sizeSize, family, weight, letterSpacing }?: CreateSystemFontOptions<A, Sizes>) => FillInFont<A, SystemFontKeys<Sizes>>;
export {};

//# sourceMappingURL=index.d.ts.map
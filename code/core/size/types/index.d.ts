import { type FontSizeTokens, type GenericFont, type GenericSizes, type SizeSpec, type SizeTokens, type StyledContext, type TokensParsed, type Variable } from "@tamagui/web";
export type { GenericSizes, SizeSpec };
export type TokenSize = SizeTokens | FontSizeTokens | number | true;
export type SizeContextValue<Value extends TokenSize = TokenSize> = {
	size: Value | undefined;
};
export type CreatedSizeContext<Value extends TokenSize = TokenSize> = StyledContext<SizeContextValue<Value>, "size">;
export declare const createSizeContext: <Value extends TokenSize = TokenSize>(defaultSize?: Value) => CreatedSizeContext<Value>;
export declare const SizeContext: CreatedSizeContext;
export type SizeResolverEnv = {
	tokens: Pick<TokensParsed, "size" | "space" | "radius">;
	/** the component's font; a key it lacks falls back to `fonts.body` */
	font?: GenericFont;
	fonts?: {
		body?: GenericFont;
		[name: string]: GenericFont | undefined;
	};
	sizes?: GenericSizes;
};
export type ResolvedSize = {
	/** the named size, or the token key */
	name: string;
	/** the font.size key the text was sized against */
	fontSizeKey: string;
	/** spread onto the frame */
	frame: {
		paddingHorizontal: number | Variable;
		paddingVertical?: number | Variable;
		gap: number | Variable;
		borderRadius: number | Variable;
		/** token keys only: v2's "size is the control height" */
		minHeight?: number | Variable;
	};
	/** spread onto the text */
	text: {
		fontSize: number | Variable;
		lineHeight?: number | Variable;
	};
	/** px: the recipe's icon, or the font size rounded up to the 4px grid; a token key's font size as is */
	icon: number;
	/** px, without border: line-height plus vertical padding for a name, tokens.size for a key */
	controlHeight: number;
};
/**
* A `size` prop is one of three things, checked in this order:
*
* - `true` (or nothing): the config's default named size
* - a name in `config.sizes`: a recipe of token keys, never a height
* - a token key like `4` or `$4`: v2's index into every scale at once
*
* A named size never sets a height. The control ends up line-height plus
* padding tall, so the frame, its text and its icon agree by construction.
* Icons default to the font size rounded up to the 4px grid (12, 16, 16, 20).
*/
export declare const resolveSize: (value: TokenSize | null | undefined, env?: SizeResolverEnv) => ResolvedSize;
/**
* One step smaller: the previous name in `sizes` (clamped at the smallest), or
* for a token key the previous whole number (clamped at 1).
*/
export declare const oneSizeSmaller: (value: TokenSize | null | undefined, sizes: GenericSizes | undefined) => string;

//# sourceMappingURL=index.d.ts.map
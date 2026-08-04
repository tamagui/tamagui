import { type FontSizeTokens, type GenericFont, type SizeTokens, type StyledContext, type TokensParsed, type Variable } from "@tamagui/web";
export type TokenSize = SizeTokens | FontSizeTokens | number | true;
export type TokenSizePolicy = {
	size: Exclude<SizeTokens, true> | number;
	space: Exclude<SizeTokens, true> | number;
	radius: Exclude<SizeTokens, true> | number;
	fontSize: Exclude<FontSizeTokens, true> | number;
};
export declare const defaultTokenSizePolicy: TokenSizePolicy;
/**
* Frame heights for controls, keyed like v2's size tokens.
*
* `size` on a control is a preset, not a length. A config's size scale is a
* spacing scale: under v6 it is tailwind's, where `3` is 12px, so reading a
* frame height straight off it produced a 12px-tall Button holding 16px text.
* These are v2's size token values, so a migrating `size="4"` still means a
* 44px control rather than silently becoming a 16px one.
*
* `true` is the unsized default and is just the `4` step, so there is no
* separate default constant that can drift away from the ramp.
*/
export declare const controlSizes: {
	readonly true: 44;
	readonly 0: 0;
	readonly "0-25": 2;
	readonly "0-5": 4;
	readonly "0-75": 8;
	readonly 1: 20;
	readonly "1-5": 24;
	readonly 2: 28;
	readonly "2-5": 32;
	readonly 3: 36;
	readonly "3-5": 40;
	readonly 4: 44;
	readonly "4-5": 48;
	readonly 5: 52;
	readonly 6: 64;
	readonly 7: 74;
	readonly 8: 84;
	readonly 9: 94;
	readonly 10: 104;
	readonly 11: 124;
	readonly 12: 144;
	readonly 13: 164;
	readonly 14: 184;
	readonly 15: 204;
	readonly 16: 224;
	readonly 17: 224;
	readonly 18: 244;
	readonly 19: 264;
	readonly 20: 284;
};
export type ControlSizeKey = keyof typeof controlSizes;
/**
* A control's frame height. Numbers stay literal pixel values, the same line
* resolveTokenSize and getShapeSize already draw. A size key outside the ramp
* (v6 carries larger ones like `24`) falls through to the config's size scale,
* where the value is already a sane large length.
*/
export declare const resolveControlSize: (value: TokenSize, tokens: Pick<TokensParsed, "size">) => number | Variable;
export declare const resolveSizeToken: <
	Value,
	Category extends keyof TokenSizePolicy
>(value: Value, category: Category, policy?: TokenSizePolicy) => Exclude<Value, true> | TokenSizePolicy[Category];
export type SizeContextValue<Value extends TokenSize = TokenSize> = {
	size: Value | undefined;
};
export type CreatedSizeContext<Value extends TokenSize = TokenSize> = StyledContext<SizeContextValue<Value>, "size">;
export declare const createSizeContext: <Value extends TokenSize = TokenSize>(defaultSize?: Value) => CreatedSizeContext<Value>;
export declare const SizeContext: CreatedSizeContext;
export type SizeResolverExtras = {
	tokens: Pick<TokensParsed, "size" | "space" | "radius">;
	font: GenericFont;
	policy?: TokenSizePolicy;
};
export type ResolvedFrameMetric<Value extends TokenSize> = Value extends number ? Value : Value extends true ? number | Variable : Variable;
export type ResolvedFontMetric<Value extends TokenSize> = Value extends number ? Value : number | Variable;
/** the ramp yields plain numbers, so a frame height is never only a Variable */
export type ResolvedControlMetric<Value extends TokenSize> = Value extends number ? Value : number | Variable;
export type ResolvedTokenSize<Value extends TokenSize = TokenSize> = {
	frame: {
		size: ResolvedControlMetric<Value>;
		space: ResolvedFrameMetric<Value>;
		radius: ResolvedFrameMetric<Value>;
	};
	text: {
		fontSize: ResolvedFontMetric<Value>;
		lineHeight: Value extends number ? undefined : number | Variable | undefined;
	};
	icon: ResolvedFontMetric<Value>;
};
export declare const resolveTokenSize: <Value extends TokenSize>(value: Value, { tokens, font, policy }: SizeResolverExtras) => ResolvedTokenSize<Value>;
export type SizeTableEntry = Readonly<{
	frame: unknown;
	text: unknown;
	icon: unknown;
}>;
export type SizeTableDefinition = Readonly<Record<string, SizeTableEntry>>;
export type SizeTableName<Table extends SizeTableDefinition> = Extract<keyof Table, string>;
export type SizeTableSelection<
	Table extends SizeTableDefinition,
	Name extends SizeTableName<Table>
> = Table[Name];
export type SizeTablePart = keyof SizeTableEntry;
export type SizeTableProjection<
	Table extends SizeTableDefinition,
	Part extends SizeTablePart
> = { readonly [Name in SizeTableName<Table>] : Table[Name][Part] };
export type SizeTableContextValue<Table extends SizeTableDefinition> = {
	size: SizeTableName<Table>;
};
export type CreatedSizeTable<
	Table extends SizeTableDefinition,
	DefaultName extends SizeTableName<Table>
> = {
	values: Table;
	names: readonly SizeTableName<Table>[];
	defaultSize: DefaultName;
	Context: StyledContext<SizeTableContextValue<Table>, "size">;
	frame: SizeTableProjection<Table, "frame">;
	text: SizeTableProjection<Table, "text">;
	icon: SizeTableProjection<Table, "icon">;
	resolve: {
		(): SizeTableSelection<Table, DefaultName>;
		<Name extends SizeTableName<Table>>(name: Name): SizeTableSelection<Table, Name>;
	};
};
export declare const createSizeTable: <
	const Table extends SizeTableDefinition,
	const DefaultName extends SizeTableName<Table>
>(values: Table, defaultSize: DefaultName) => CreatedSizeTable<Table, DefaultName>;

//# sourceMappingURL=index.d.ts.map
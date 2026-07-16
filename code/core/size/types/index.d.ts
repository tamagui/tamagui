import { type FontSizeTokens, type GenericFont, type SizeTokens, type StyledContext, type TokensParsed, type Variable } from "@tamagui/web";
export type TokenSize = SizeTokens | FontSizeTokens | number | true;
export type SizeContextValue<Value extends TokenSize = TokenSize> = {
	size: Value | undefined;
};
export type CreatedSizeContext<Value extends TokenSize = TokenSize> = StyledContext<SizeContextValue<Value>, "size">;
export declare const createSizeContext: <Value extends TokenSize = TokenSize>(defaultSize?: Value) => CreatedSizeContext<Value>;
export declare const SizeContext: CreatedSizeContext;
export type SizeResolverExtras = {
	tokens: Pick<TokensParsed, "size" | "space" | "radius">;
	font: GenericFont;
};
export type ResolvedFrameMetric<Value extends TokenSize> = Value extends number ? Value : Variable;
export type ResolvedFontMetric<Value extends TokenSize> = Value extends number ? Value : number | Variable;
export type ResolvedTokenSize<Value extends TokenSize = TokenSize> = {
	frame: {
		size: ResolvedFrameMetric<Value>;
		space: ResolvedFrameMetric<Value>;
		radius: ResolvedFrameMetric<Value>;
	};
	text: {
		fontSize: ResolvedFontMetric<Value>;
		lineHeight: Value extends number ? undefined : number | Variable | undefined;
	};
	icon: ResolvedFontMetric<Value>;
};
export declare const resolveTokenSize: <Value extends TokenSize>(value: Value, { tokens, font }: SizeResolverExtras) => ResolvedTokenSize<Value>;
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
import {
  createStyledContext,
  resolveDefaultToken,
  type FontSizeTokens,
  type GenericFont,
  type SizeTokens,
  type StyledContext,
  type TokensParsed,
  type Variable,
} from '@tamagui/web'

export type TokenSize = SizeTokens | FontSizeTokens | number | true

export type SizeContextValue<Value extends TokenSize = TokenSize> = {
  size: Value | undefined
}

export type CreatedSizeContext<Value extends TokenSize = TokenSize> = StyledContext<
  SizeContextValue<Value>,
  'size'
>

export const createSizeContext = <Value extends TokenSize = TokenSize>(
  defaultSize?: Value
): CreatedSizeContext<Value> => {
  return createStyledContext<SizeContextValue<Value>>({ size: defaultSize })
}

export const SizeContext: CreatedSizeContext = createSizeContext()

export type SizeResolverExtras = {
  tokens: Pick<TokensParsed, 'size' | 'space' | 'radius'>
  font: GenericFont
}

export type ResolvedFrameMetric<Value extends TokenSize> = Value extends number
  ? Value
  : Variable

export type ResolvedFontMetric<Value extends TokenSize> = Value extends number
  ? Value
  : number | Variable

export type ResolvedTokenSize<Value extends TokenSize = TokenSize> = {
  frame: {
    size: ResolvedFrameMetric<Value>
    space: ResolvedFrameMetric<Value>
    radius: ResolvedFrameMetric<Value>
  }
  text: {
    fontSize: ResolvedFontMetric<Value>
    lineHeight: Value extends number ? undefined : number | Variable | undefined
  }
  icon: ResolvedFontMetric<Value>
}

export const resolveTokenSize = <Value extends TokenSize>(
  value: Value,
  { tokens, font }: SizeResolverExtras
): ResolvedTokenSize<Value> => {
  if (typeof value === 'number') {
    return {
      frame: { size: value, space: value, radius: value },
      text: { fontSize: value, lineHeight: undefined },
      icon: value,
    } as ResolvedTokenSize<Value>
  }

  const sizeKey = resolveDefaultToken(value, 'size') as string
  const spaceKey = resolveDefaultToken(value, 'space') as string
  const radiusKey = resolveDefaultToken(value, 'radius') as string
  const fontKey = resolveDefaultToken(value, 'fontSize') as string

  return {
    frame: {
      size: tokens.size[sizeKey],
      space: tokens.space[spaceKey],
      radius: tokens.radius[radiusKey],
    },
    text: {
      fontSize: font.size[fontKey],
      lineHeight: font.lineHeight?.[fontKey],
    },
    icon: font.size[fontKey],
  } as ResolvedTokenSize<Value>
}

export type SizeTableEntry = Readonly<{
  frame: unknown
  text: unknown
  icon: unknown
}>

export type SizeTableDefinition = Readonly<Record<string, SizeTableEntry>>

export type SizeTableName<Table extends SizeTableDefinition> = Extract<
  keyof Table,
  string
>

export type SizeTableSelection<
  Table extends SizeTableDefinition,
  Name extends SizeTableName<Table>,
> = Table[Name]

export type SizeTablePart = keyof SizeTableEntry

export type SizeTableProjection<
  Table extends SizeTableDefinition,
  Part extends SizeTablePart,
> = {
  readonly [Name in SizeTableName<Table>]: Table[Name][Part]
}

export type SizeTableContextValue<Table extends SizeTableDefinition> = {
  size: SizeTableName<Table>
}

export type CreatedSizeTable<
  Table extends SizeTableDefinition,
  DefaultName extends SizeTableName<Table>,
> = {
  values: Table
  names: readonly SizeTableName<Table>[]
  defaultSize: DefaultName
  Context: StyledContext<SizeTableContextValue<Table>, 'size'>
  frame: SizeTableProjection<Table, 'frame'>
  text: SizeTableProjection<Table, 'text'>
  icon: SizeTableProjection<Table, 'icon'>
  resolve: {
    (): SizeTableSelection<Table, DefaultName>;
    <Name extends SizeTableName<Table>>(name: Name): SizeTableSelection<Table, Name>
  }
}

export const createSizeTable = <
  const Table extends SizeTableDefinition,
  const DefaultName extends SizeTableName<Table>,
>(
  values: Table,
  defaultSize: DefaultName
): CreatedSizeTable<Table, DefaultName> => {
  const Context = createStyledContext<SizeTableContextValue<Table>>({ size: defaultSize })
  const frame = {} as Record<SizeTableName<Table>, Table[SizeTableName<Table>]['frame']>
  const text = {} as Record<SizeTableName<Table>, Table[SizeTableName<Table>]['text']>
  const icon = {} as Record<SizeTableName<Table>, Table[SizeTableName<Table>]['icon']>

  for (const name of Object.keys(values) as SizeTableName<Table>[]) {
    frame[name] = values[name].frame
    text[name] = values[name].text
    icon[name] = values[name].icon
  }

  const resolve = ((name: SizeTableName<Table> = defaultSize) => {
    return values[name]
  }) as CreatedSizeTable<Table, DefaultName>['resolve']

  return {
    values,
    names: Object.keys(values) as SizeTableName<Table>[],
    defaultSize,
    Context,
    frame: frame as SizeTableProjection<Table, 'frame'>,
    text: text as SizeTableProjection<Table, 'text'>,
    icon: icon as SizeTableProjection<Table, 'icon'>,
    resolve,
  }
}

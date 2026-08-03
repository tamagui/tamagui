import {
  createStyledContext,
  type FontSizeTokens,
  type GenericFont,
  type SizeTokens,
  type StyledContext,
  type TokensParsed,
  type Variable,
} from '@tamagui/web'

export type TokenSize = SizeTokens | FontSizeTokens | number | true

export type TokenSizePolicy = {
  size: Exclude<SizeTokens, true> | number
  space: Exclude<SizeTokens, true> | number
  radius: Exclude<SizeTokens, true> | number
  fontSize: Exclude<FontSizeTokens, true> | number
}

// component defaults are intentionally owned by this opt-in package instead of
// the global Tamagui config. The raw frame height works across token scales;
// the other metrics retain each config's token-defined platform values.
export const defaultTokenSizePolicy: TokenSizePolicy = {
  size: 44,
  space: '4',
  radius: '4',
  fontSize: '4',
}

export const resolveSizeToken = <
  Value,
  Category extends keyof TokenSizePolicy,
>(
  value: Value,
  category: Category,
  policy: TokenSizePolicy = defaultTokenSizePolicy
): Exclude<Value, true> | TokenSizePolicy[Category] => {
  return value === true ? policy[category] : (value as Exclude<Value, true>)
}

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
  policy?: TokenSizePolicy
}

export type ResolvedFrameMetric<Value extends TokenSize> = Value extends number
  ? Value
  : Value extends true
    ? number | Variable
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
  { tokens, font, policy = defaultTokenSizePolicy }: SizeResolverExtras
): ResolvedTokenSize<Value> => {
  if (typeof value === 'number') {
    return {
      frame: { size: value, space: value, radius: value },
      text: { fontSize: value, lineHeight: undefined },
      icon: value,
    } as ResolvedTokenSize<Value>
  }

  const sizeKey = resolveSizeToken(value, 'size', policy)
  const spaceKey = resolveSizeToken(value, 'space', policy)
  const radiusKey = resolveSizeToken(value, 'radius', policy)
  const fontKey = resolveSizeToken(value, 'fontSize', policy)

  const size = typeof sizeKey === 'number' ? sizeKey : tokens.size[sizeKey]
  const space = typeof spaceKey === 'number' ? spaceKey : tokens.space[spaceKey]
  const radius = typeof radiusKey === 'number' ? radiusKey : tokens.radius[radiusKey]
  const fontSize = typeof fontKey === 'number' ? fontKey : font.size[fontKey]
  const lineHeight = typeof fontKey === 'number' ? undefined : font.lineHeight?.[fontKey]

  return {
    frame: {
      size,
      space,
      radius,
    },
    text: {
      fontSize,
      lineHeight,
    },
    icon: fontSize,
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
    (): SizeTableSelection<Table, DefaultName>
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
    if (!(name in values)) {
      if (process.env.NODE_ENV !== 'production') {
        console.error(
          `Unknown size "${String(name)}" — this size table only has: ${Object.keys(values).join(', ')}. Size tables are user-owned named scales; the default skins take size tokens instead. Falling back to "${String(defaultSize)}".`
        )
      }
      return values[defaultSize]
    }
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

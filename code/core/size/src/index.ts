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
// the global Tamagui config, so the other metrics retain each config's
// token-defined platform values.
export const defaultTokenSizePolicy: TokenSizePolicy = {
  // geometry consumers (Square, Circle) read the size scale directly and only
  // need a default token; control frame heights do NOT come from here, they
  // come from controlSizes below.
  size: 44,
  space: '4',
  radius: '4',
  fontSize: '4',
}

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
export const controlSizes = {
  true: 44,
  0: 0,
  '0-25': 2,
  '0-5': 4,
  '0-75': 8,
  1: 20,
  '1-5': 24,
  2: 28,
  '2-5': 32,
  3: 36,
  '3-5': 40,
  4: 44,
  '4-5': 48,
  5: 52,
  6: 64,
  7: 74,
  8: 84,
  9: 94,
  10: 104,
  11: 124,
  12: 144,
  13: 164,
  14: 184,
  15: 204,
  16: 224,
  17: 224,
  18: 244,
  19: 264,
  20: 284,
} as const

export type ControlSizeKey = keyof typeof controlSizes

/**
 * A control's frame height. Numbers stay literal pixel values, the same line
 * resolveTokenSize and getShapeSize already draw. A size key outside the ramp
 * (v6 carries larger ones like `24`) falls through to the config's size scale,
 * where the value is already a sane large length.
 */
export const resolveControlSize = (
  value: TokenSize,
  tokens: Pick<TokensParsed, 'size'>
): number | Variable => {
  if (typeof value === 'number') return value
  const ramp = controlSizes[value as ControlSizeKey]
  return ramp ?? tokens.size[value as keyof typeof tokens.size]
}

export const resolveSizeToken = <Value, Category extends keyof TokenSizePolicy>(
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

/** the ramp yields plain numbers, so a frame height is never only a Variable */
export type ResolvedControlMetric<Value extends TokenSize> = Value extends number
  ? Value
  : number | Variable

export type ResolvedTokenSize<Value extends TokenSize = TokenSize> = {
  frame: {
    size: ResolvedControlMetric<Value>
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

  const spaceKey = resolveSizeToken(value, 'space', policy)
  const radiusKey = resolveSizeToken(value, 'radius', policy)
  const fontKey = resolveSizeToken(value, 'fontSize', policy)

  // frame height is a control preset off the ramp, never the spacing scale
  const size = resolveControlSize(value, tokens)
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

import {
  createStyledContext,
  getConfig,
  getVariableValue,
  type FontSizeTokens,
  type GenericFont,
  type GenericSizes,
  type SizeSpec,
  type SizeTokens,
  type StyledContext,
  type TokensParsed,
  type Variable,
} from '@tamagui/web'

export type { GenericSizes, SizeSpec }

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

export type SizeResolverEnv = {
  tokens: Pick<TokensParsed, 'size' | 'space' | 'radius'>
  /** the component's font; a key it lacks falls back to `fonts.body` */
  font?: GenericFont
  fonts?: { body?: GenericFont; [name: string]: GenericFont | undefined }
  sizes?: GenericSizes
}

export type ResolvedSize = {
  /** the named size, or the token key */
  name: string
  /** the font.size key the text was sized against */
  fontSizeKey: string
  /** spread onto the frame */
  frame: {
    paddingHorizontal: number | Variable
    paddingVertical?: number | Variable
    gap: number | Variable
    borderRadius: number | Variable
    /** token keys only: v2's "size is the control height" */
    minHeight?: number | Variable
  }
  /** spread onto the text */
  text: {
    fontSize: number | Variable
    lineHeight?: number | Variable
  }
  /** px: the recipe's icon, or the font size rounded up to the 4px grid; a token key's font size as is */
  icon: number
  /** px, without border: line-height plus vertical padding for a name, tokens.size for a key */
  controlHeight: number
}

/** outside a style pass (icons, imperative measurements): the config's default font */
const configEnv = (): SizeResolverEnv => {
  const conf = getConfig()
  return {
    tokens: conf.tokensParsed,
    font: conf.fontsParsed[conf.defaultFontToken],
    fonts: conf.fontsParsed,
    sizes: conf.sizes,
  }
}

const px = (value: unknown) => {
  const n = Number.parseFloat(String(getVariableValue(value)))
  return Number.isFinite(n) ? n : 0
}

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
export const resolveSize = (
  value: TokenSize | null | undefined,
  env: SizeResolverEnv = configEnv()
): ResolvedSize => {
  const { tokens, font: fontIn, fonts, sizes } = env
  let key: string | undefined
  if (value === true || value == null) {
    key = sizes?.default
  } else if (typeof value === 'number') {
    if (process.env.NODE_ENV === 'development') {
      console.error(
        `size={${value}} is not a control size. Use a named size (${
          Object.keys(sizes ?? {})
            .filter((k) => k !== 'default')
            .join(', ') || 'none configured'
        }) or a token key. Falling back to the default.`
      )
    }
    key = sizes?.default
  } else {
    key = String(value)
    if (key[0] === '$') key = key.slice(1)
  }

  if (key == null) {
    if (process.env.NODE_ENV === 'development') {
      console.error(
        `No default size: pass "sizes" to createTamagui (see @tamagui/config/v6 "sizes"). Falling back to token "4".`
      )
    }
    key = '4'
  }

  const spec = key === 'default' ? undefined : sizes?.[key]

  if (spec && typeof spec === 'object') {
    const font = fontIn?.size[spec.fontSize] != null ? fontIn : fonts?.body
    const fontSize = font?.size[spec.fontSize] ?? 0
    const lineHeight = font?.lineHeight?.[spec.fontSize]
    const paddingVertical = tokens.space[spec.paddingY]
    const fontPx = px(fontSize)
    return {
      name: key,
      fontSizeKey: spec.fontSize,
      frame: {
        paddingHorizontal: tokens.space[spec.paddingX],
        paddingVertical,
        gap: tokens.space[spec.gap ?? spec.paddingY],
        borderRadius: tokens.radius[spec.radius],
      },
      text: { fontSize, lineHeight },
      icon: spec.icon ?? Math.ceil(fontPx / 4) * 4,
      controlHeight:
        (lineHeight ? px(lineHeight) : Math.round(fontPx * 1.5)) +
        px(paddingVertical) * 2,
    }
  }

  const size = tokens.size[key]
  const font = fontIn?.size[key] != null ? fontIn : fonts?.body
  const fontSize = font?.size[key]
  if (process.env.NODE_ENV === 'development') {
    if (size == null && fontSize == null) {
      console.error(
        `Unknown size "${key}": not a named size (${
          Object.keys(sizes ?? {})
            .filter((k) => k !== 'default')
            .join(', ') || 'none configured'
        }) and not a token key.`
      )
    }
  }
  const sizePx = px(size)
  return {
    name: key,
    fontSizeKey: key,
    frame: {
      paddingHorizontal: tokens.space[key],
      gap: Math.round(sizePx * 0.2),
      borderRadius: tokens.radius[key],
      minHeight: size,
    },
    text: { fontSize: fontSize ?? sizePx, lineHeight: font?.lineHeight?.[key] },
    icon: px(fontSize ?? sizePx),
    controlHeight: sizePx,
  }
}

/**
 * One step smaller: the previous name in `sizes` (clamped at the smallest), or
 * for a token key the previous whole number (clamped at 1).
 */
export const oneSizeSmaller = (
  value: TokenSize | null | undefined,
  sizes: GenericSizes | undefined
): string => {
  const key =
    value === true || value == null ? sizes?.default : String(value).replace(/^\$/, '')
  if (key == null) return '3'
  const names = Object.keys(sizes ?? {}).filter((name) => name !== 'default')
  const index = names.indexOf(key)
  if (index !== -1) return names[Math.max(0, index - 1)]
  const n = Number(key)
  if (Number.isNaN(n)) return key
  return `${Math.max(1, Math.round(n) - 1)}`
}

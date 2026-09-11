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

let warnedNoDefault = false

const px = (value: unknown) => {
  const n = Number.parseFloat(String(getVariableValue(value)))
  return Number.isFinite(n) ? n : 0
}

/**
 * A `size` prop is one of three things, checked in this order:
 *
 * - `true` (or nothing): the config's default named size
 * - a name in `config.sizes`: a recipe of token keys, never a height
 * - a token key like `4` or `$4`: v2's spelling, indexing every scale at key 4
 *
 * A named size never sets a height. The control ends up line-height plus
 * padding tall, so the frame, its text and its icon agree by construction.
 * Icons default to the font size rounded up to the 4px grid (12, 16, 16, 20).
 *
 * A token key keeps v2's coupling, so `size="$11"` is space 11, radius 11 and
 * font 11 together. It takes `tokens.size[key]` as a minimum height rather than
 * the height, because that only describes a control under a v2-shaped size
 * scale; see the token branch.
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
    if (process.env.NODE_ENV === 'development' && !warnedNoDefault) {
      warnedNoDefault = true
      console.error(
        `No default size: pass "sizes" to createTamagui (see @tamagui/config/v6 "sizes"). Falling back to token "4".`
      )
    }
    key = '4'
  }

  let spec = key === 'default' ? undefined : sizes?.[key]
  // Try the authored key, then the configured default, then token 4. Reuse
  // one validity check and bound retries even when the default is invalid.
  for (
    let attempt = 0;
    attempt < 2 &&
    !(spec && typeof spec === 'object') &&
    tokens.size[key] == null &&
    fontIn?.size[key] == null &&
    fonts?.body?.size[key] == null;
    attempt++
  ) {
    if (process.env.NODE_ENV === 'development' && attempt === 0) {
      console.error(
        `Unknown size "${key}": not a named size (${
          Object.keys(sizes ?? {})
            .filter((k) => k !== 'default')
            .join(', ') || 'none configured'
        }) and not a token key. Falling back to the default.`
      )
    }
    key = attempt === 0 ? sizes?.default || '4' : '4'
    spec = key === 'default' ? undefined : sizes?.[key]
  }

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

  // v2 read the control's height straight off `tokens.size[key]`, because under
  // v2 that scale WAS a control ramp: `size="$4"` meant a 44px button. v6's size
  // scale is tailwind's spacing, where `4` is 16px, so reading a height off it
  // hands back a 16px-tall control around 20px of text, with nothing to pad it
  // out. That is the collapsed Button, and `controlSizes` used to prevent it.
  //
  // So the size token becomes a FLOOR rather than the height, and the control
  // gets vertical padding like a named size does. Under a v2-shaped scale the
  // floor is the taller of the two and nothing moves; under v6's the floor is
  // inert and the control is line-height plus padding, same as a named size.
  // Every other reading stays keyed to `key`, so v2's coupling of space, radius
  // and font at one step is intact.
  const size = tokens.size[key]
  const font = fontIn?.size[key] != null ? fontIn : fonts?.body
  const fontSize = font?.size[key]
  const lineHeight = font?.lineHeight?.[key]
  const sizePx = px(size)
  // half the horizontal space, the ratio the named ramp already uses
  const paddingVertical = Math.round(px(tokens.space[key]) / 2)
  const fontPx = px(fontSize ?? size)
  return {
    name: key,
    fontSizeKey: key,
    frame: {
      paddingHorizontal: tokens.space[key],
      paddingVertical,
      gap: Math.round(sizePx * 0.2),
      borderRadius: tokens.radius[key],
      minHeight: size,
    },
    text: { fontSize: fontSize ?? sizePx, lineHeight },
    icon: fontPx,
    controlHeight: Math.max(
      sizePx,
      (lineHeight ? px(lineHeight) : Math.round(fontPx * 1.5)) + paddingVertical * 2
    ),
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

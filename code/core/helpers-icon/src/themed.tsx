import {
  getConfig,
  getTokenValue,
  getVariable,
  isWeb,
  useTheme,
  type FontSizeTokens,
  type ResolveVariableAs,
} from '@tamagui/core'
import { getFontSize } from '@tamagui/font-size'
import { SizeContext } from '@tamagui/size'
import {
  classifyCandidate,
  decodeArbitrary,
  type GrammarConfigView,
} from '@tamagui/style-grammar'

import type { FC } from 'react'
import type { IconProps } from './IconProps'

type Options = {
  noClass?: boolean
  defaultThemeColor?: string
  defaultStrokeWidth?: number
  fallbackColor?: string
  resolveValues?: ResolveVariableAs
}

// styleMode: an icon's color can arrive as a color-* class because the converter turns the
// color PROP into a class. icons aren't
// createComponent components, so the styleMode className→prop pass never runs on them —
// reconstruct color here from the icon's own className. `size-*` is standard Tailwind
// width+height and must never be reinterpreted as Tamagui's component size variant. cheap early-outs first: a
// normal icon (no className) or a non-styleMode app pays zero cost.
export function reconstructIconStyleModeProps(props: IconProps, theme: any): IconProps {
  const cn = (props as any).className
  if (typeof cn !== 'string' || cn === '') return props
  const config = getConfig()
  const styleMode = config.settings?.styleMode
  if (styleMode !== 'tailwind' && styleMode !== 'tamagui-and-tailwind') return props
  if (!cn.includes('color-')) return props

  const colorNames = new Set<string>()
  for (const key in config.tokensParsed?.color) {
    colorNames.add(key[0] === '$' ? key.slice(1) : key)
  }
  for (const key in theme) colorNames.add(key[0] === '$' ? key.slice(1) : key)
  const grammarConfig: GrammarConfigView = {
    shorthands: config.shorthands,
    tokenNames: { color: colorNames },
  }

  let color: any
  const rest: string[] = []
  for (const cls of cn.split(/\s+/)) {
    if (!cls) continue
    const classification = classifyCandidate(cls, grammarConfig)
    const parsed = classification.kind === 'tamagui' ? classification.parsed : null
    if (
      parsed?.kind === 'dynamic' &&
      parsed.entry?.prop === 'color' &&
      parsed.modifiers.length === 0 &&
      parsed.rawValue
    ) {
      color =
        parsed.valueKind === 'arbitrary'
          ? decodeArbitrary(parsed.rawValue.slice(1, -1))
          : `$${parsed.rawValue}`
      continue
    }
    rest.push(cls)
  }
  if (color === undefined) return props

  const next: any = {}
  for (const key in props) {
    if (key === 'className') {
      next.color = color
      next.className = rest.length ? rest.join(' ') : undefined
    } else {
      next[key] = (props as any)[key]
    }
  }
  return next
}

export function themed(Component: FC<IconProps>, optsIn: Options = {}) {
  const opts: Options = {
    defaultThemeColor: process.env.DEFAULT_ICON_THEME_COLOR || '$color',
    defaultStrokeWidth: 2,
    fallbackColor: '#000',
    resolveValues: (process.env.TAMAGUI_ICON_COLOR_RESOLVE as any) || 'auto',
    ...optsIn,
  }

  const IconWrapper = (propsInRaw: IconProps) => {
    const styledContext = SizeContext.useStyledContext()
    const theme = useTheme()

    // styleMode: reconstruct color/size from the icon's className (cheap no-op otherwise)
    const propsIn = reconstructIconStyleModeProps(propsInRaw, theme)

    const {
      size: sizeProp,
      strokeWidth: strokeWidthProp,
      color: colorProp,
      fill: fillProp,
      stroke: strokeProp,
      disableTheme,
      style,
      testID,
      ...rest
    } = propsIn as any

    // resolve theme tokens for color/fill/stroke (so users can do fill="$color10" etc).
    // leave non-token strings (e.g. "red", "#abc", "none") untouched.
    const resolveSvgColor = (val: unknown) => {
      if (typeof val !== 'string') return val
      if (val[0] !== '$') return val
      const themed = (theme as any)?.[val]
      if (themed != null) return getVariable(themed)
      return getVariable(val, 'color' as any)
    }

    const fillResolved = resolveSvgColor(fillProp)
    const strokeResolved = resolveSvgColor(strokeProp)
    const colorResolved = resolveSvgColor(colorProp)

    const colorIn =
      strokeResolved ||
      colorResolved ||
      (opts.defaultThemeColor ? (theme as any)[opts.defaultThemeColor] : undefined) ||
      (!disableTheme ? theme.color : null) ||
      opts.fallbackColor

    const color = getVariable(colorIn)

    // v3: icon sizes resolve via the current font's size scale (font.size[token]),
    // so icons visually align with text at each size. raw numbers stay literal.
    // context size (for example from Button/ListItem) resolves the same way.
    const size =
      typeof sizeProp === 'number'
        ? sizeProp
        : typeof sizeProp === 'string'
          ? getFontSize(sizeProp as FontSizeTokens)
          : styledContext.size != null
            ? getFontSize(styledContext.size as FontSizeTokens)
            : undefined

    const strokeWidth =
      typeof strokeWidthProp === 'string'
        ? getTokenValue(strokeWidthProp as any, 'size')
        : (strokeWidthProp ?? `${opts.defaultStrokeWidth}`)

    const finalProps = {
      ...rest,
      color,
      size,
      strokeWidth,
      ...(fillResolved !== undefined ? { fill: fillResolved } : null),
      ...(strokeResolved !== undefined ? { stroke: strokeResolved } : null),
      ...(style ? { style } : null),
      // tamagui web maps testID -> data-testid; native keeps testID for react-native-svg
      ...(testID != null ? (isWeb ? { 'data-testid': testID } : { testID }) : null),
    }

    return <Component {...finalProps} />
  }

  const wrapped = (propsIn: IconProps) => {
    return <IconWrapper {...propsIn} />
  }

  // add staticConfig so styled() works properly with themed icons
  wrapped['staticConfig'] = {
    isHOC: true,
    acceptsClassName: true,
  }

  return wrapped
}

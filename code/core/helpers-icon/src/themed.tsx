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
import { SizableContext } from '@tamagui/sizable-context'

import type { FC } from 'react'
import type { IconProps } from './IconProps'

export { SizableContext }

type Options = {
  noClass?: boolean
  defaultThemeColor?: string
  defaultStrokeWidth?: number
  fallbackColor?: string
  resolveValues?: ResolveVariableAs
}

// styleMode: an icon's color/size can arrive as tailwind classes (color-color5, size-6)
// because the converter turns the color/size PROPS into classes. icons aren't
// createComponent components, so the styleMode className→prop pass never runs on them —
// reconstruct color/size here from the icon's own className. cheap early-outs first: a
// normal icon (no className) or a non-styleMode app pays zero cost.
export function reconstructIconStyleModeProps(props: IconProps, theme: any): IconProps {
  const cn = (props as any).className
  if (typeof cn !== 'string' || cn === '') return props
  const styleMode = getConfig().settings?.styleMode
  if (styleMode !== 'tailwind' && styleMode !== 'tamagui-and-tailwind') return props
  if (!cn.includes('color-') && !cn.includes('size-')) return props

  let color: any
  let size: any
  const rest: string[] = []
  for (const cls of cn.split(/\s+/)) {
    if (!cls) continue
    if (cls.startsWith('color-')) {
      // color-color5 → the $color5 theme token; color-red → raw "red"
      const n = cls.slice(6)
      color = theme?.[`$${n}`] != null || theme?.[n] != null ? `$${n}` : n
      continue
    }
    if (cls.startsWith('size-')) {
      const v = cls.slice(5)
      if (v[0] === '[') {
        // arbitrary size-[24px]/size-[24] → a NUMBER (icon dimension); a string like
        // "24px" would hit getFontSize and be mis-scaled
        const inner = v.slice(1, -1)
        const num = Number.parseFloat(inner)
        size = Number.isNaN(num) ? inner : num
      } else {
        // size-6 → the $6 size token (icons resolve via the font-size scale)
        size = /^\d+$/.test(v) ? `$${v}` : v
      }
      continue
    }
    rest.push(cls)
  }
  if (color === undefined && size === undefined) return props

  const next: any = { ...props }
  if (color !== undefined && (props as any).color === undefined) next.color = color
  if (size !== undefined && (props as any).size === undefined) next.size = size
  next.className = rest.length ? rest.join(' ') : undefined
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
    const styledContext = SizableContext.useStyledContext()
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
    // context size (SizableContext, e.g. from Button/ListItem) resolves the same way.
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

import {
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

export function themed(Component: FC<IconProps>, optsIn: Options = {}) {
  const opts: Options = {
    defaultThemeColor: process.env.DEFAULT_ICON_THEME_COLOR || '$color',
    defaultStrokeWidth: 2,
    fallbackColor: '#000',
    resolveValues: (process.env.TAMAGUI_ICON_COLOR_RESOLVE as any) || 'auto',
    ...optsIn,
  }

  const IconWrapper = (propsIn: IconProps) => {
    const styledContext = SizableContext.useStyledContext()
    const theme = useTheme()

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

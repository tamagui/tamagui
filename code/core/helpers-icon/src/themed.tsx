import {
  getTokenValue,
  getVariable,
  Text,
  usePropsAndStyle,
  useTheme,
  type ResolveVariableAs,
} from '@tamagui/core'
import { SizableContext } from '@tamagui/sizable-context'

import { memo, type FC } from 'react'
import type { IconProps } from './IconProps'

export { SizableContext }

type Options = {
  noClass?: boolean
  defaultThemeColor?: string
  defaultStrokeWidth?: number
  fallbackColor?: string
  resolveValues?: ResolveVariableAs
}

// check if props contain media queries ($sm, $md, etc) or other complex tamagui features
function needsFullStyleResolution(props: IconProps): boolean {
  for (const key in props) {
    if (key[0] === '$') return true
  }
  return false
}

export function themed(Component: FC<IconProps>, optsIn: Options = {}) {
  const opts: Options = {
    defaultThemeColor: process.env.DEFAULT_ICON_THEME_COLOR || '$color',
    defaultStrokeWidth: 2,
    fallbackColor: '#000',
    resolveValues: (process.env.TAMAGUI_ICON_COLOR_RESOLVE as any) || 'auto',
    ...optsIn,
  }

  // fast path: skips usePropsAndStyle entirely for simple icons without media queries
  const LiteIconWrapper = memo((propsIn: IconProps) => {
    const styledContext = SizableContext.useStyledContext()
    const theme = useTheme()

    const defaultColor = opts.defaultThemeColor
    const colorIn =
      propsIn.color ||
      (defaultColor ? theme[defaultColor as string] : undefined) ||
      (!propsIn.disableTheme ? theme.color : null) ||
      opts.fallbackColor

    const color = getVariable(colorIn)

    const size =
      typeof propsIn.size === 'string'
        ? getTokenValue(propsIn.size as any, 'size')
        : propsIn.size ||
          (styledContext.size === '$true' ? undefined : styledContext.size)

    const strokeWidth =
      typeof propsIn.strokeWidth === 'string'
        ? getTokenValue(propsIn.strokeWidth as any, 'size')
        : (propsIn.strokeWidth ?? `${opts.defaultStrokeWidth}`)

    return <Component {...propsIn} color={color} size={size} strokeWidth={strokeWidth} />
  })

  // full path: handles media queries, animations, and complex style resolution
  const HeavyIconWrapper = (propsIn: IconProps) => {
    const styledContext = SizableContext.useStyledContext()

    const [props, style, theme] = usePropsAndStyle(propsIn, {
      ...opts,
      forComponent: Text,
      resolveValues: opts.resolveValues,
    })

    const defaultColor = opts.defaultThemeColor

    const colorIn =
      style.color ||
      (defaultColor ? theme[defaultColor as string] : undefined) ||
      (!props.disableTheme ? theme.color : null) ||
      opts.fallbackColor

    const color = getVariable(colorIn)

    const size =
      typeof props.size === 'string'
        ? getTokenValue(props.size as any, 'size')
        : props.size || (styledContext.size === '$true' ? undefined : styledContext.size)

    const strokeWidth =
      typeof props.strokeWidth === 'string'
        ? getTokenValue(props.strokeWidth as any, 'size')
        : (props.strokeWidth ?? `${opts.defaultStrokeWidth}`)

    const finalProps = {
      ...props,
      color,
      size,
      strokeWidth,
      style: style as any,
    }

    return <Component {...finalProps} />
  }

  const wrapped = (propsIn: IconProps) => {
    if (needsFullStyleResolution(propsIn)) {
      return <HeavyIconWrapper {...propsIn} />
    }
    return <LiteIconWrapper {...propsIn} />
  }

  // add staticConfig so styled() works properly with themed icons
  wrapped['staticConfig'] = {
    isHOC: true,
    acceptsClassName: true,
  }

  return wrapped
}

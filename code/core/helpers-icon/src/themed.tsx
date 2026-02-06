import {
  getTokenValue,
  getVariable,
  Text,
  usePropsAndStyle,
  type ResolveVariableAs,
} from '@tamagui/core'
import { useIconSize } from '@tamagui/font-size'
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

  const IconWrapper = (propsIn: IconProps) => {
    const styledContext = SizableContext.useStyledContext()
    const needsMedia = needsFullStyleResolution(propsIn)

    const [props, style, theme] = usePropsAndStyle(propsIn, {
      ...opts,
      forComponent: Text,
      resolveValues: opts.resolveValues,
      noMedia: !needsMedia,
    })

    const defaultColor = opts.defaultThemeColor

    const colorIn =
      style.color ||
      (defaultColor ? theme[defaultColor as string] : undefined) ||
      (!props.disableTheme ? theme.color : null) ||
      opts.fallbackColor

    const color = getVariable(colorIn)

    // when size is explicitly passed (e.g. from Button's getIcon), resolve directly
    // otherwise fall back to context size via useIconSize
    const contextSize = useIconSize({
      sizeToken: styledContext.size === '$true' ? undefined : styledContext.size,
      scaleIcon: 1,
    })

    const size =
      typeof props.size === 'string'
        ? getTokenValue(props.size as any, 'size')
        : props.size || contextSize

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
    return <IconWrapper {...propsIn} />
  }

  // add staticConfig so styled() works properly with themed icons
  wrapped['staticConfig'] = {
    isHOC: true,
    acceptsClassName: true,
  }

  return wrapped
}

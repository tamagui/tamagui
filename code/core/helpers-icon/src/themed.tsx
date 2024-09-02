import { styled, Text, usePropsAndStyle } from '@tamagui/core'
import React from 'react'

import type { IconProps } from './IconProps'

// sad fix https://github.com/tamagui/tamagui/issues/1812
React['keep']

type ThemedOptions = {
  defaultThemeColor?: string
  defaultStrokeWidth?: number
  fallbackColor?: string
}

type Opts = ThemedOptions & {
  noClassNames?: boolean
}

const Sized = styled(
  Text,
  {
    variants: {
      size: {
        '...size': (val) => ({ width: val, height: val }),
      },
    } as const,
  },
  {
    accept: {
      strokeWidth: 'size',
    },
  }
)

export function themed(
  Component: React.FC<IconProps>,
  opts: Opts = {
    defaultThemeColor: process.env.DEFAULT_ICON_THEME_COLOR || '$color',
    defaultStrokeWidth: 2,
    fallbackColor: '#000',
  }
) {
  const wrapped = (propsIn: IconProps) => {
    const [props, style] = usePropsAndStyle(propsIn, {
      ...opts,
      forComponent: Sized,
      resolveValues: 'web', // iOS doesnt support dynamic values for SVG so only optimize on web
    })

    return (
      <Component
        color={opts.defaultThemeColor}
        strokeWidth={opts.defaultStrokeWidth}
        {...props}
        style={style as any}
      />
    )
  }

  return wrapped
}

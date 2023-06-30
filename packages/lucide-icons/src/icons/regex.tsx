import type { IconProps } from '@tamagui/helpers-icon'
import { themed } from '@tamagui/helpers-icon'
import PropTypes from 'prop-types'
import React, { memo } from 'react'
import {
  Defs,
  Ellipse,
  G,
  Line,
  LinearGradient,
  Path,
  Polygon,
  Polyline,
  RadialGradient,
  Rect,
  Stop,
  Svg,
  SvgProps,
  Symbol,
  Use,
  Circle as _Circle,
  Text as _Text,
} from 'react-native-svg'

const Icon = (props: SvgProps) => {
  const { color = 'black', width = 24, height = 24, ...otherProps } = props
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...otherProps}
    >
      <Path d="M17 3v10" stroke={color} />
      <Path d="m12.67 5.5 8.66 5" stroke={color} />
      <Path d="m12.67 10.5 8.66-5" stroke={color} />
      <Path
        d="M9 17a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-2z"
        stroke={color}
      />
    </Svg>
  )
}

Icon.displayName = 'Regex'

export const Regex = memo<IconProps>(themed(Icon))

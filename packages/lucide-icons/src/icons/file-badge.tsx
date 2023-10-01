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
  Symbol,
  Use,
  Circle as _Circle,
  Text as _Text,
} from 'react-native-svg'

const Icon = (props) => {
  const { color = 'black', size = 24, ...otherProps } = props
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...otherProps}
    >
      <Path
        d="M4 7V4a2 2 0 0 1 2-2h8.5L20 7.5V20a2 2 0 0 1-2 2h-6"
        stroke={color}
      />
      <Polyline points="14 2 14 8 20 8" stroke={color} />
      <Path d="M5 17a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" stroke={color} />
      <Path d="M7 16.5 8 22l-3-1-3 1 1-5.5" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'FileBadge'

export const FileBadge = memo<IconProps>(themed(Icon))

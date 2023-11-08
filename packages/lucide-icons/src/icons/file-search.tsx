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
        d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v3"
        stroke={color}
      />
      <Polyline points="14 2 14 8 20 8" stroke={color} />
      <Path d="M5 17a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" stroke={color} />
      <Path d="m9 18-1.5-1.5" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'FileSearch'

export const FileSearch = memo<IconProps>(themed(Icon))

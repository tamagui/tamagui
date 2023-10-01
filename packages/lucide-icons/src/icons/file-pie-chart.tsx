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
        d="M16 22h2a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v3"
        stroke={color}
      />
      <Polyline points="14 2 14 8 20 8" stroke={color} />
      <Path d="M4.04 11.71a5.84 5.84 0 1 0 8.2 8.29" stroke={color} />
      <Path d="M13.83 16A5.83 5.83 0 0 0 8 10.17V16h5.83Z" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'FilePieChart'

export const FilePieChart = memo<IconProps>(themed(Icon))

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
      <Path d="M6 3v12" stroke={color} />
      <Path d="M18 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" stroke={color} />
      <Path d="M6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" stroke={color} />
      <Path d="M15 6a9 9 0 0 0-9 9" stroke={color} />
      <Path d="M18 15v6" stroke={color} />
      <Path d="M21 18h-6" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'GitBranchPlus'

export const GitBranchPlus = memo<IconProps>(themed(Icon))

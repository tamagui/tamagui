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
      <Path d="M12 2v20" stroke={color} />
      <Path d="M2 5h20" stroke={color} />
      <Path d="M3 3v2" stroke={color} />
      <Path d="M7 3v2" stroke={color} />
      <Path d="M17 3v2" stroke={color} />
      <Path d="M21 3v2" stroke={color} />
      <Path d="m19 5-7 7-7-7" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'UtilityPole'

export const UtilityPole = memo<IconProps>(themed(Icon))

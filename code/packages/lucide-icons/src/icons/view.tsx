import React, { memo } from 'react'
import PropTypes from 'prop-types'
import type { IconProps } from '@tamagui/helpers-icon'
import {
  Svg,
  Circle as _Circle,
  Ellipse,
  G,
  LinearGradient,
  RadialGradient,
  Line,
  Path,
  Polygon,
  Polyline,
  Rect,
  Symbol,
  Text as _Text,
  Use,
  Defs,
  Stop,
} from 'react-native-svg'
import { themed } from '@tamagui/helpers-icon'

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
        d="M5 12s2.545-5 7-5c4.454 0 7 5 7 5s-2.546 5-7 5c-4.455 0-7-5-7-5z"
        stroke={color}
      />
      <Path d="M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" stroke={color} />
      <Path d="M21 17v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2" stroke={color} />
      <Path d="M21 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'View'

export const View = memo<IconProps>(themed(Icon))

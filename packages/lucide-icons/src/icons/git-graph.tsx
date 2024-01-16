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
      <_Circle cx="5" cy="6" r="3" stroke={color} />
      <Path d="M5 9v6" stroke={color} />
      <_Circle cx="5" cy="18" r="3" stroke={color} />
      <Path d="M12 3v18" stroke={color} />
      <_Circle cx="19" cy="6" r="3" stroke={color} />
      <Path d="M16 15.7A9 9 0 0 0 19 9" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'GitGraph'

export const GitGraph = memo<IconProps>(themed(Icon))

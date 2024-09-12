import React from 'react'
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
      <Rect x="16" y="16" width="6" height="6" rx="1" stroke={color} />
      <Rect x="2" y="16" width="6" height="6" rx="1" stroke={color} />
      <Rect x="9" y="2" width="6" height="6" rx="1" stroke={color} />
      <Path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3" stroke={color} />
      <Path d="M12 12V8" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Network'

export const Network = React.memo<IconProps>(themed(Icon))

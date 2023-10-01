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
      <Rect
        width="20"
        height="20"
        x="2"
        y="2"
        rx="2.18"
        ry="2.18"
        stroke={color}
      />
      <Line x1="7" x2="7" y1="2" y2="22" stroke={color} />
      <Line x1="17" x2="17" y1="2" y2="22" stroke={color} />
      <Line x1="2" x2="22" y1="12" y2="12" stroke={color} />
      <Line x1="2" x2="7" y1="7" y2="7" stroke={color} />
      <Line x1="2" x2="7" y1="17" y2="17" stroke={color} />
      <Line x1="17" x2="22" y1="17" y2="17" stroke={color} />
      <Line x1="17" x2="22" y1="7" y2="7" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Film'

export const Film = memo<IconProps>(themed(Icon))

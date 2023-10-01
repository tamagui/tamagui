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
      <_Circle cx="12" cy="12" r="10" stroke={color} />
      <_Circle cx="12" cy="12" r="4" stroke={color} />
      <Line x1="4.93" x2="9.17" y1="4.93" y2="9.17" stroke={color} />
      <Line x1="14.83" x2="19.07" y1="14.83" y2="19.07" stroke={color} />
      <Line x1="14.83" x2="19.07" y1="9.17" y2="4.93" stroke={color} />
      <Line x1="14.83" x2="18.36" y1="9.17" y2="5.64" stroke={color} />
      <Line x1="4.93" x2="9.17" y1="19.07" y2="14.83" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'LifeBuoy'

export const LifeBuoy = memo<IconProps>(themed(Icon))

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
      <Line x1="14.31" x2="20.05" y1="8" y2="17.94" stroke={color} />
      <Line x1="9.69" x2="21.17" y1="8" y2="8" stroke={color} />
      <Line x1="7.38" x2="13.12" y1="12" y2="2.06" stroke={color} />
      <Line x1="9.69" x2="3.95" y1="16" y2="6.06" stroke={color} />
      <Line x1="14.31" x2="2.83" y1="16" y2="16" stroke={color} />
      <Line x1="16.62" x2="10.88" y1="12" y2="21.94" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Aperture'

export const Aperture = memo<IconProps>(themed(Icon))

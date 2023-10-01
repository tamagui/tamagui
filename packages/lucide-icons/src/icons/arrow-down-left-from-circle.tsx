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
      <Polyline points="8,22 2,22 2,16 " stroke={color} />
      <Line x1="2" y1="22" x2="12" y2="12" stroke={color} />
      <Path
        d="M2,12C2,6.5,6.5,2,12,2s10,4.5,10,10s-4.5,10-10,10"
        stroke={color}
      />
    </Svg>
  )
}

Icon.displayName = 'ArrowDownLeftFromCircle'

export const ArrowDownLeftFromCircle = memo<IconProps>(themed(Icon))

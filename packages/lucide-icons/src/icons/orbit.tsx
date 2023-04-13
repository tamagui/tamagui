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
  Text,
  Use,
  Circle as _Circle,
} from 'react-native-svg'

import { IconProps } from '../IconProps'
import { themed } from '../themed'

const Icon = (props) => {
  const { color = 'black', size = 24, ...otherProps } = props
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={`${color}`}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...otherProps}
    >
      <_Circle
        cx="12"
        cy="12"
        r="3"
        fill="none"
        stroke={`${color}`}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <_Circle
        cx="18"
        cy="6"
        r="2"
        fill="none"
        stroke={`${color}`}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <_Circle
        cx="6"
        cy="18"
        r="2"
        fill="none"
        stroke={`${color}`}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M18.8,7.8c0.2,0.3,0.4,0.7,0.5,1.1c0.4,1,0.6,2,0.6,3.1s-0.2,2.2-0.6,3.1c-0.4,1-1,1.8-1.7,2.5 s-1.6,1.3-2.5,1.7c-1,0.4-2,0.6-3.1,0.6"
        fill="none"
        stroke={`${color}`}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M5.2,16.2c-0.2-0.3-0.4-0.7-0.5-1.1c-0.4-1-0.6-2-0.6-3.1s0.2-2.2,0.6-3.1c0.4-1,1-1.8,1.7-2.5S7.9,5,8.9,4.6 c1-0.4,2-0.6,3.1-0.6"
        fill="none"
        stroke={`${color}`}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

Icon.displayName = 'Orbit'

export const Orbit = memo<IconProps>(themed(Icon))

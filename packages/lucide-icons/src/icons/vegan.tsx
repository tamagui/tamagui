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
      <Path
        d="M2 2c4.056 3.007 9.232 9.337 10 20 .897-6.818 1.5-9.5 4-14"
        fill="none"
        stroke={`${color}`}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M20.375 6.533A9.953 9.953 0 0 1 22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2c2.003 0 3.869.589 5.433 1.603"
        fill="none"
        stroke={`${color}`}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M17.104 4c-1.002 1.274-1.146 2.586-1.1 4 1.9-.1 3.003-.201 4.3-1.4 1.406-1.3 1.6-2.3 1.7-4.6-2.7.1-3.623.375-4.9 2Z"
        fill="none"
        stroke={`${color}`}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

Icon.displayName = 'Vegan'

export const Vegan = memo<IconProps>(themed(Icon))

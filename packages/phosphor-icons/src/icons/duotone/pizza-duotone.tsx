import PropTypes from 'prop-types'
import React, { memo } from 'react'
import {
  Circle as _Circle,
  Defs as _Defs,
  Ellipse as _Ellipse,
  G as _G,
  Line as _Line,
  LinearGradient as _LinearGradient,
  Path as _Path,
  Polygon as _Polygon,
  Polyline as _Polyline,
  RadialGradient as _RadialGradient,
  Rect as _Rect,
  Stop as _Stop,
  Svg as _Svg,
  Symbol as _Symbol,
  Text as _Text,
  Use as _Use,
} from 'react-native-svg'

import { IconProps } from '../../IconProps'
import { themed } from '../../themed'

const Icon = (props) => {
  const { color = 'black', size = 24, ...otherProps } = props
  return (
    <_Svg
      viewBox="0 0 256 256"
      {...otherProps}
      height={size}
      width={size}
      fill={`${color}`}
    >
      <_Rect width="256" height="256" fill="none" />
      <_Path
        d="M144,156a28,28,0,0,1,49.1-18.4l26.2-41a144.1,144.1,0,0,0-182.6,0l21.2,33.3A28,28,0,1,1,84,168H82.1l39.2,61.5a7.9,7.9,0,0,0,13.4,0l29.6-46.5A28,28,0,0,1,144,156Z"
        opacity="0.2"
      />
      <_Path
        d="M23.4,75.7a7.9,7.9,0,0,1,2.2-10.8,175.8,175.8,0,0,1,204.8,0,7.9,7.9,0,0,1,2.2,10.8L134.7,229.4a7.9,7.9,0,0,1-13.4,0Z"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <_Path
        d="M36.7,96.6a144.1,144.1,0,0,1,182.6,0"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <_Path
        d="M164.3,182.9a28,28,0,1,1,28.8-45.3"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <_Path
        d="M57.9,129.8A28,28,0,1,1,84,168H82.2"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
    </_Svg>
  )
}

Icon.displayName = 'PizzaDuotone'

export const PizzaDuotone = memo<IconProps>(themed(Icon))

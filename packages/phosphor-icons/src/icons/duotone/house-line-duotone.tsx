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
        d="M152,216V152H104v64H40V115.5a7.9,7.9,0,0,1,2.6-5.9l80-72.7a7.9,7.9,0,0,1,10.7,0l80.1,72.7a8.3,8.3,0,0,1,2.6,5.9V216Z"
        opacity="0.2"
      />
      <_Path
        d="M216,216V115.5a8.3,8.3,0,0,0-2.6-5.9L133.3,36.9a7.9,7.9,0,0,0-10.7,0l-80,72.7a7.9,7.9,0,0,0-2.6,5.9V216"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <_Line
        x1="16"
        y1="216"
        x2="240"
        y2="216"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <_Path
        d="M152,216V160a8,8,0,0,0-8-8H112a8,8,0,0,0-8,8v56"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
    </_Svg>
  )
}

Icon.displayName = 'HouseLineDuotone'

export const HouseLineDuotone = memo<IconProps>(themed(Icon))

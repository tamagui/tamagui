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
      <_G opacity="0.2">
        <_Path d="M40,106.1c21.4-16,41-16,60-10.6V37.4C81,32,61.4,32,40,48Z" />
      </_G>
      <_G opacity="0.2">
        <_Path d="M156,58.6C175,64,194.6,64,216,48v58.1c-21.4,16.1-41,16-60,10.7Z" />
      </_G>
      <_G opacity="0.2">
        <_Path d="M156,116.8c-18.9-5.4-37.1-15.9-56-21.3v61.9c18.9,5.3,37.1,15.9,56,21.2Z" />
      </_G>
      <_Line
        x1="40"
        y1="216"
        x2="40"
        y2="48"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <_Path
        d="M40,168c64-48,112,48,176,0V48C152,96,104,0,40,48"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <_Path
        d="M216,106.1c-64,48-112-48-176,0"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <_Line
        x1="100"
        y1="37.4"
        x2="100"
        y2="157.4"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <_Line
        x1="156"
        y1="58.6"
        x2="156"
        y2="178.6"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
    </_Svg>
  )
}

Icon.displayName = 'FlagCheckeredDuotone'

export const FlagCheckeredDuotone = memo<IconProps>(themed(Icon))

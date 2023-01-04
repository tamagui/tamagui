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
        d="M219.5,121,50.6,26.4a8,8,0,0,0-11.4,9.7L71,125.3a7.2,7.2,0,0,1,0,5.4L39.2,219.9a8,8,0,0,0,11.4,9.7L219.5,135A8,8,0,0,0,219.5,121Z"
        opacity="0.2"
      />
      <_Path
        d="M219.5,121,50.6,26.4a8,8,0,0,0-11.4,9.7L71,125.3a7.2,7.2,0,0,1,0,5.4L39.2,219.9a8,8,0,0,0,11.4,9.7L219.5,135A8,8,0,0,0,219.5,121Z"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <_Line
        x1="72"
        y1="128"
        x2="136"
        y2="128"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
    </_Svg>
  )
}

Icon.displayName = 'PaperPlaneRightDuotone'

export const PaperPlaneRightDuotone = memo<IconProps>(themed(Icon))

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
        d="M187.1,203.7l-10.8-10.8a8.2,8.2,0,0,0-3.6-2.1l-21.5-5.6a8,8,0,0,1-5.8-8.9l2.3-16.2a8.2,8.2,0,0,1,4.9-6.2L183,141.2a8,8,0,0,1,8.5,1.5l24.9,22.8h.1a97,97,0,0,1-29.2,38.1Z"
        opacity="0.2"
      />
      <_Path
        d="M49.6,183.4A96,96,0,0,1,182.7,49.1h0l1.1,24.3a8.1,8.1,0,0,1-1.9,5.6l-22.2,25.6a7.8,7.8,0,0,1-4.9,2.7l-31.5,4.3a8.6,8.6,0,0,1-5.8-1.5L97.9,95.9a8.1,8.1,0,0,0-11.5,2.2L66.6,129.2a7.7,7.7,0,0,0-1.3,4.2l-.2,36.1a8,8,0,0,1-3.8,6.8l-11.7,7.1Z"
        opacity="0.2"
      />
      <_Circle
        cx="128"
        cy="128"
        r="96"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <_Path
        d="M49.6,183.4l11.7-7.1a8,8,0,0,0,3.8-6.8l.2-36.1a7.7,7.7,0,0,1,1.3-4.2L86.4,98.1a8.1,8.1,0,0,1,11.5-2.2l19.6,14.2a8.6,8.6,0,0,0,5.8,1.5l31.5-4.3a7.8,7.8,0,0,0,4.9-2.7L181.9,79a8.1,8.1,0,0,0,1.9-5.6l-1.1-24.3"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <_Path
        d="M187.1,203.7l-10.8-10.8a8.2,8.2,0,0,0-3.6-2.1l-21.5-5.6a8,8,0,0,1-5.8-8.9l2.3-16.2a8.2,8.2,0,0,1,4.9-6.2L183,141.2a8,8,0,0,1,8.5,1.5l24.9,22.8"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
    </_Svg>
  )
}

Icon.displayName = 'GlobeHemisphereEastDuotone'

export const GlobeHemisphereEastDuotone = memo<IconProps>(themed(Icon))

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
    <_Svg viewBox="0 0 256 256" {...otherProps} height={size} width={size}>
      <_Rect width="256" height="256" fill="none" />
      <_Circle
        cx="128"
        cy="128"
        r="96"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="24"
      />
      <_Path
        d="M49.6,183.4l12.1-7.3a8.4,8.4,0,0,0,3.8-6.1l3.7-37a7.3,7.3,0,0,1,1.2-3.5L90.1,98.6A8,8,0,0,1,102,96.8l15.4,12.9a7.8,7.8,0,0,0,6.2,1.8l31.2-4.2a7.8,7.8,0,0,0,4.9-2.7L181.9,79a8.1,8.1,0,0,0,1.9-5.6l-1.1-24.3"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="24"
      />
      <_Path
        d="M187.1,203.7l-10.8-10.8a8.2,8.2,0,0,0-3.6-2.1l-21.5-5.6a8,8,0,0,1-5.8-8.9l2.3-16.2a8.2,8.2,0,0,1,4.9-6.2L183,141.2a8,8,0,0,1,8.5,1.5l24.9,22.8"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="24"
      />
    </_Svg>
  )
}

Icon.displayName = 'GlobeHemisphereEastBold'

export const GlobeHemisphereEastBold = memo<IconProps>(themed(Icon))

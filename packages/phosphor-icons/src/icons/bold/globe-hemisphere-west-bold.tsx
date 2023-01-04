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
        d="M214.2,170.4,159.9,137a7.2,7.2,0,0,0-3.1-1.1l-22.9-3.1a7.8,7.8,0,0,0-8.3,4.7l-13.7,30.7a8,8,0,0,0,1.4,8.7l18.8,20.3a8.2,8.2,0,0,1,2,7L130.2,224"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="24"
      />
      <_Path
        d="M65,55.6,56,76.8a8,8,0,0,0-.1,5.9l11.5,30.6a7.9,7.9,0,0,0,5.8,5.1L94.6,123a7.8,7.8,0,0,1,5.5,4.3l3.8,7.9a8.2,8.2,0,0,0,7.2,4.5h13.5"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="24"
      />
      <_Path
        d="M152.5,35.1l9.3,16.8a8.1,8.1,0,0,1-1.6,9.8L133.3,86a7.2,7.2,0,0,1-1.5,1.1l-12.3,6.8a8.6,8.6,0,0,1-3.8,1H94.3a8.1,8.1,0,0,0-7.4,4.9l-8.3,19.7"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="24"
      />
    </_Svg>
  )
}

Icon.displayName = 'GlobeHemisphereWestBold'

export const GlobeHemisphereWestBold = memo<IconProps>(themed(Icon))

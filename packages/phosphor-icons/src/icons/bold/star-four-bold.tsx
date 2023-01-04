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
      <_Path
        d="M158.7,163.5l-23.2,63.8a8,8,0,0,1-15,0L97.3,163.5a8.1,8.1,0,0,0-4.8-4.8L28.7,135.5a8,8,0,0,1,0-15L92.5,97.3a8.1,8.1,0,0,0,4.8-4.8l23.2-63.8a8,8,0,0,1,15,0l23.2,63.8a8.1,8.1,0,0,0,4.8,4.8l63.8,23.2a8,8,0,0,1,0,15l-63.8,23.2A8.1,8.1,0,0,0,158.7,163.5Z"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="24"
      />
    </_Svg>
  )
}

Icon.displayName = 'StarFourBold'

export const StarFourBold = memo<IconProps>(themed(Icon))

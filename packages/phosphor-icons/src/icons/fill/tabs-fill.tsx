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
      <_Path d="M256,168a8,8,0,0,1-8,8H8a8,8,0,0,1-8-8,8.5,8.5,0,0,1,.3-2.3H.4L22.6,91.4A16,16,0,0,1,38,80h84a16,16,0,0,1,15.4,11.4L158,160h31.2L170,96H160a8,8,0,0,1,0-16h10a16,16,0,0,1,15.4,11.4L206,160h31.2L218,96H208a8,8,0,0,1,0-16h10a16,16,0,0,1,15.4,11.4l22.2,74.2h.1A8.5,8.5,0,0,1,256,168Z" />
    </_Svg>
  )
}

Icon.displayName = 'TabsFill'

export const TabsFill = memo<IconProps>(themed(Icon))

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
      <_Path d="M222,158.4l-46.9-20a15.6,15.6,0,0,0-15.1,1.3l-25.1,16.7a76.5,76.5,0,0,1-35.2-35h0L116.3,96a15.9,15.9,0,0,0,1.4-15.1L97.6,34a16.3,16.3,0,0,0-16.7-9.6A56.2,56.2,0,0,0,32,80c0,79.4,64.6,144,144,144a56.2,56.2,0,0,0,55.6-48.9A16.3,16.3,0,0,0,222,158.4Z" />
      <_Path d="M154.3,101.7a8.2,8.2,0,0,0,11.4,0L184,83.3l18.3,18.4a8.2,8.2,0,0,0,11.4,0,8.1,8.1,0,0,0,0-11.4L195.3,72l18.4-18.3a8.1,8.1,0,0,0-11.4-11.4L184,60.7,165.7,42.3a8.1,8.1,0,0,0-11.4,11.4L172.7,72,154.3,90.3A8.1,8.1,0,0,0,154.3,101.7Z" />
    </_Svg>
  )
}

Icon.displayName = 'PhoneXFill'

export const PhoneXFill = memo<IconProps>(themed(Icon))

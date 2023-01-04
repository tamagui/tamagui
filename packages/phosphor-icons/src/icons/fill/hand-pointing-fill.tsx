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
      <_Path d="M188,84a27.6,27.6,0,0,0-14.6,4.1A28.1,28.1,0,0,0,136,74.7V36a28,28,0,0,0-56,0v91.4l-7-12.1A28,28,0,0,0,24.3,143c32.5,68.4,54.1,97,103.7,97a88.1,88.1,0,0,0,88-88V112A28.1,28.1,0,0,0,188,84Zm12,68a72.1,72.1,0,0,1-72,72c-20.2,0-34.2-5.5-47-18.2S56.3,173,38.7,135.9l-.3-.6a11.6,11.6,0,0,1-1.2-9.1,11.8,11.8,0,0,1,5.6-7.3,12,12,0,0,1,9.1-1.2,11.6,11.6,0,0,1,7.2,5.6l22,38a8.1,8.1,0,0,0,9,3.7,7.9,7.9,0,0,0,5.9-7.7V36a12,12,0,0,1,24,0v68a8,8,0,0,0,16,0v-4a12,12,0,0,1,24,0v12a8,8,0,0,0,16,0,12,12,0,0,1,24,0Z" />
    </_Svg>
  )
}

Icon.displayName = 'HandPointingFill'

export const HandPointingFill = memo<IconProps>(themed(Icon))

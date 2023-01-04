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
      <_Path d="M221.1,110.6,208,106.2V56a16,16,0,0,0-16-16H136V24a8,8,0,0,0-16,0V40H64A16,16,0,0,0,48,56v50.2l-13.1,4.4A16,16,0,0,0,24,125.8V160a8.3,8.3,0,0,0,.3,2.2c15.7,55,86.1,74,100.1,77.2a16.4,16.4,0,0,0,7.2,0c14-3.2,84.4-22.2,100.1-77.2a8.3,8.3,0,0,0,.3-2.2V125.8A16,16,0,0,0,221.1,110.6ZM136,168a8,8,0,0,1-16,0V112.4a8,8,0,0,1,16,0Zm56-67.1L133.1,81.3a16.2,16.2,0,0,0-10.2,0L64,100.9V56H192Z" />
    </_Svg>
  )
}

Icon.displayName = 'BoatFill'

export const BoatFill = memo<IconProps>(themed(Icon))

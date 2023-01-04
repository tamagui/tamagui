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
      <_Path d="M161.9,182.6a8,8,0,0,1-5.6,13.7H136V232a8,8,0,0,1-16,0V196.3H99.7a8,8,0,0,1-5.6-13.7l28.2-28.3a8.1,8.1,0,0,1,11.4,0Zm-39.6-80.9a8.2,8.2,0,0,0,11.4,0l28.2-28.3a8,8,0,0,0-5.6-13.7H136V24a8,8,0,0,0-16,0V59.7H99.7a8,8,0,0,0-5.6,13.7Zm-20.6,20.6L73.4,94.1a8,8,0,0,0-13.7,5.6V120H24a8,8,0,0,0,0,16H59.7v20.3a8.2,8.2,0,0,0,5,7.4,7.7,7.7,0,0,0,3,.6,8,8,0,0,0,5.7-2.4l28.3-28.2A8.1,8.1,0,0,0,101.7,122.3ZM232,120H196.3V99.7a8,8,0,0,0-13.7-5.6l-28.3,28.2a8.1,8.1,0,0,0,0,11.4l28.3,28.2a8,8,0,0,0,5.7,2.4,7.7,7.7,0,0,0,3-.6,8.2,8.2,0,0,0,5-7.4V136H232a8,8,0,0,0,0-16Z" />
    </_Svg>
  )
}

Icon.displayName = 'ArrowsInCardinalFill'

export const ArrowsInCardinalFill = memo<IconProps>(themed(Icon))

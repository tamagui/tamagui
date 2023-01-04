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
      <_Path d="M163.7,200.7a8.1,8.1,0,0,1-1.8,8.7l-28.2,28.3a8.2,8.2,0,0,1-11.4,0L94.1,209.4a8,8,0,0,1,5.6-13.7H120V160a8,8,0,0,1,16,0v35.7h20.3A8.2,8.2,0,0,1,163.7,200.7ZM99.7,60.3H120V96a8,8,0,0,0,16,0V60.3h20.3a8,8,0,0,0,5.6-13.7L133.7,18.3a8.2,8.2,0,0,0-11.4,0L94.1,46.6a8,8,0,0,0,5.6,13.7ZM96,136a8,8,0,0,0,0-16H60.3V99.7a8,8,0,0,0-13.7-5.6L18.3,122.3a8.1,8.1,0,0,0,0,11.4l28.3,28.2a8,8,0,0,0,5.7,2.4,7.7,7.7,0,0,0,3-.6,8.2,8.2,0,0,0,5-7.4V136Zm141.7-13.7L209.4,94.1a8,8,0,0,0-13.7,5.6V120H160a8,8,0,0,0,0,16h35.7v20.3a8.2,8.2,0,0,0,5,7.4,7.7,7.7,0,0,0,3,.6,8,8,0,0,0,5.7-2.4l28.3-28.2A8.1,8.1,0,0,0,237.7,122.3Z" />
    </_Svg>
  )
}

Icon.displayName = 'ArrowsOutCardinalFill'

export const ArrowsOutCardinalFill = memo<IconProps>(themed(Icon))

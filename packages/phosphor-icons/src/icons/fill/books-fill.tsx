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
      <_Path d="M233.6,195.6,192.2,41a16,16,0,0,0-19.6-11.3L141.7,38l-1,.3A16,16,0,0,0,128,32H96a15.8,15.8,0,0,0-8,2.2A15.8,15.8,0,0,0,80,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H80a15.8,15.8,0,0,0,8-2.2,15.8,15.8,0,0,0,8,2.2h32a16,16,0,0,0,16-16V108.4l27.8,103.7A16,16,0,0,0,187.3,224a19.9,19.9,0,0,0,4.1-.5l30.9-8.3A16,16,0,0,0,233.6,195.6ZM176.7,45.2,183,68.3l-30.9,8.3-6.3-23.1ZM128,48V168H96V48ZM80,48V72H48V48Zm48,160H96V184h32v24Zm90.2-8.3L187.3,208,181,184.8l31-8.3,6.2,23.2Z" />
    </_Svg>
  )
}

Icon.displayName = 'BooksFill'

export const BooksFill = memo<IconProps>(themed(Icon))

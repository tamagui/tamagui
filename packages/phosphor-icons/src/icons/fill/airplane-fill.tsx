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
      <_Path d="M240.2,136v32a7.8,7.8,0,0,1-2.9,6.2,7.9,7.9,0,0,1-6.6,1.6l-70.5-14v26.9l13.5,13.7A7.9,7.9,0,0,1,176,208v24a7.9,7.9,0,0,1-3.5,6.6A8.2,8.2,0,0,1,168,240a8,8,0,0,1-3-.6l-37-14.8L91,239.4a8,8,0,0,1-7.5-.8A7.9,7.9,0,0,1,80,232V208a8.1,8.1,0,0,1,2.3-5.7L96,188.7V161.8l-70.4,14A7.9,7.9,0,0,1,16,168V136a8.2,8.2,0,0,1,4.4-7.2L96,91V48a32,32,0,0,1,64,0V91l75.6,37.8A8.2,8.2,0,0,1,240.2,136Z" />
    </_Svg>
  )
}

Icon.displayName = 'AirplaneFill'

export const AirplaneFill = memo<IconProps>(themed(Icon))

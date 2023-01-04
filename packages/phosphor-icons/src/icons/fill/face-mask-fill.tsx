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
      <_Path d="M224,72h-1a16,16,0,0,0-9.5-9.4l-80-29.1a16,16,0,0,0-11,0l-80,29.1A16,16,0,0,0,33,72H32A32.1,32.1,0,0,0,0,104v24a32.1,32.1,0,0,0,32,32h5.2c6.6,14.4,19.3,27,37.6,37.2,21.1,11.7,43.6,17,49.9,18.3l3.3.3,3.3-.3c6.3-1.3,28.8-6.6,49.9-18.3,18.3-10.2,31-22.8,37.6-37.2H224a32.1,32.1,0,0,0,32-32V104A32.1,32.1,0,0,0,224,72ZM32,144a16,16,0,0,1-16-16V104A16,16,0,0,1,32,88v48a52.9,52.9,0,0,0,.6,8Zm136,8H88a8,8,0,0,1,0-16h80a8,8,0,0,1,0,16Zm0-32H88a8,8,0,0,1,0-16h80a8,8,0,0,1,0,16Zm72,8a16,16,0,0,1-16,16h-.6a52.9,52.9,0,0,0,.6-8V88a16,16,0,0,1,16,16Z" />
    </_Svg>
  )
}

Icon.displayName = 'FaceMaskFill'

export const FaceMaskFill = memo<IconProps>(themed(Icon))

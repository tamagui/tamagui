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
      <_Path d="M239,206.2l-14.3-128A15.9,15.9,0,0,0,208.8,64H175.3a48,48,0,0,0-94.6,0H47.2A15.9,15.9,0,0,0,31.3,78.2L17,206.2a16.2,16.2,0,0,0,4,12.5A15.9,15.9,0,0,0,32.9,224H223.1a15.9,15.9,0,0,0,11.9-5.3A16.2,16.2,0,0,0,239,206.2ZM128,40a32.1,32.1,0,0,1,31,24H97A32.1,32.1,0,0,1,128,40Z" />
    </_Svg>
  )
}

Icon.displayName = 'HandbagSimpleFill'

export const HandbagSimpleFill = memo<IconProps>(themed(Icon))

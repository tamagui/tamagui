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
      <_Path d="M53.9,34.6A8,8,0,0,0,42.1,45.4L81.3,88.5v.2A58.2,58.2,0,0,0,72,88a64,64,0,0,0,0,128h88a87.9,87.9,0,0,0,31.8-5.9l10.3,11.3A8,8,0,0,0,208,224a8.2,8.2,0,0,0,5.4-2.1,7.9,7.9,0,0,0,.5-11.3Z" />
      <_Path d="M160,40a87.2,87.2,0,0,0-52.1,17.1,7.9,7.9,0,0,0-3.2,5.6,7.8,7.8,0,0,0,2,6.2L213.8,186.7a8.1,8.1,0,0,0,5.9,2.6h0a7.8,7.8,0,0,0,5.9-2.7A88,88,0,0,0,160,40Z" />
    </_Svg>
  )
}

Icon.displayName = 'CloudSlashFill'

export const CloudSlashFill = memo<IconProps>(themed(Icon))

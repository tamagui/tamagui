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
      <_Path d="M53.9,34.6A8,8,0,0,0,42.1,45.4L81.3,88.5l-39.1,42a7.9,7.9,0,0,0-2,7.3,8.2,8.2,0,0,0,5,5.7l57.6,21.6L88.2,238.4a8.1,8.1,0,0,0,4.1,8.7,8.4,8.4,0,0,0,3.7.9,7.7,7.7,0,0,0,5.8-2.6l61.9-66.2,38.4,42.2A8,8,0,0,0,208,224a8.2,8.2,0,0,0,5.4-2.1,7.9,7.9,0,0,0,.5-11.3Z" />
      <_Path d="M179.8,149.3a8,8,0,0,0,5.8,2.6h.1a7.7,7.7,0,0,0,5.8-2.6l22.3-23.9a7.9,7.9,0,0,0-3-12.9L153.2,90.9l14.6-73.4a8,8,0,0,0-13.6-7L108.3,59.7a7.9,7.9,0,0,0-.1,10.8Z" />
    </_Svg>
  )
}

Icon.displayName = 'LightningSlashFill'

export const LightningSlashFill = memo<IconProps>(themed(Icon))

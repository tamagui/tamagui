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
      <_Path d="M53.9,34.6A8,8,0,0,0,42.1,45.4L58.9,63.9A80.2,80.2,0,0,0,48.2,104v8c0,34.3-7.1,53.7-13,63.9A16,16,0,0,0,49,200H88a40,40,0,0,0,80,0h14.6l19.5,21.4A8,8,0,0,0,208,224a8.2,8.2,0,0,0,5.4-2.1,7.9,7.9,0,0,0,.5-11.3ZM128,224a24.1,24.1,0,0,1-24-24h48A24.1,24.1,0,0,1,128,224ZM86.6,46.8a8.1,8.1,0,0,1,1.9-12.4A80.2,80.2,0,0,1,128.6,24c43.7.3,79.2,36.6,79.2,80.9V112c0,21.9,2.8,40.1,8.4,54.4a8,8,0,0,1-13.3,8.3Z" />
    </_Svg>
  )
}

Icon.displayName = 'BellSlashFill'

export const BellSlashFill = memo<IconProps>(themed(Icon))

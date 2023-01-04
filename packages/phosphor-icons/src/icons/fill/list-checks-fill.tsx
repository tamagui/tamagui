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
      <_Path d="M224,128a8,8,0,0,1-8,8H128a8,8,0,0,1,0-16h88A8,8,0,0,1,224,128ZM128,72h88a8,8,0,0,0,0-16H128a8,8,0,0,0,0,16Zm88,112H128a8,8,0,0,0,0,16h88a8,8,0,0,0,0-16ZM86.6,42.1l-29.3,27-11.9-11A8,8,0,0,0,34.6,69.9l17.3,16A8,8,0,0,0,57.3,88a8.2,8.2,0,0,0,5.5-2.1l34.6-32A8,8,0,1,0,86.6,42.1Zm0,64-29.3,27-11.9-11a8,8,0,1,0-10.8,11.8l17.3,16a8,8,0,0,0,5.4,2.1,8.2,8.2,0,0,0,5.5-2.1l34.6-32a8,8,0,1,0-10.8-11.8Zm0,64-29.3,27-11.9-11a8,8,0,1,0-10.8,11.8l17.3,16a8,8,0,0,0,5.4,2.1,8.2,8.2,0,0,0,5.5-2.1l34.6-32a8,8,0,0,0-10.8-11.8Z" />
    </_Svg>
  )
}

Icon.displayName = 'ListChecksFill'

export const ListChecksFill = memo<IconProps>(themed(Icon))

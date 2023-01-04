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
      <_Path d="M128,240c-25.8,0-47-12.6-61.4-36.4C54.6,183.8,48,157,48,128s6.6-55.9,18.6-75.6C81,28.6,102.2,16,128,16s47,12.6,61.4,36.4C201.4,72.1,208,99,208,128s-6.6,55.8-18.6,75.6C175,227.4,153.8,240,128,240Zm0-208c-44.2,0-64,48.2-64,96s19.8,96,64,96,64-48.2,64-96S172.2,32,128,32Z" />
    </_Svg>
  )
}

Icon.displayName = 'NumberZeroFill'

export const NumberZeroFill = memo<IconProps>(themed(Icon))

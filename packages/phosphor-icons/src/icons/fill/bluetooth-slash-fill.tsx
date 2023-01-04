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
      <_Path d="M213.9,210.6l-31.4-34.5h0l-31.3-34.5h-.1L53.9,34.6A8,8,0,0,0,42.1,45.4l70.8,77.9L51.2,169.6A8,8,0,0,0,56,184a7.7,7.7,0,0,0,4.8-1.6L112,144v80a8.2,8.2,0,0,0,4.4,7.2,9,9,0,0,0,3.6.8,7.7,7.7,0,0,0,4.8-1.6l50.8-38.1,26.5,29.1A8,8,0,0,0,208,224a8.2,8.2,0,0,0,5.4-2.1A7.9,7.9,0,0,0,213.9,210.6ZM128,208V144l11.8,8.8,25,27.6Z" />
      <_Path d="M120,79.6a8,8,0,0,0,8-8V48l42.7,32-25,18.7a7.9,7.9,0,0,0-1.6,11.2,7.8,7.8,0,0,0,6.4,3.2,8.1,8.1,0,0,0,4.8-1.6l33.5-25.1a8,8,0,0,0,0-12.8l-64-48A8,8,0,0,0,112,32V71.6A8,8,0,0,0,120,79.6Z" />
    </_Svg>
  )
}

Icon.displayName = 'BluetoothSlashFill'

export const BluetoothSlashFill = memo<IconProps>(themed(Icon))

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
      <_Path d="M188.8,169.6,133.3,128l55.5-41.6a8,8,0,0,0,0-12.8l-64-48A8,8,0,0,0,112,32v80L60.8,73.6a8.1,8.1,0,0,0-11.2,1.6,8,8,0,0,0,1.6,11.2L106.7,128,51.2,169.6A8,8,0,0,0,56,184a7.7,7.7,0,0,0,4.8-1.6L112,144v80a8.2,8.2,0,0,0,4.4,7.2,9.4,9.4,0,0,0,3.6.8,7.7,7.7,0,0,0,4.8-1.6l64-48a8,8,0,0,0,0-12.8ZM128,48l42.7,32L128,112Zm0,160V144l42.7,32Z" />
    </_Svg>
  )
}

Icon.displayName = 'BluetoothFill'

export const BluetoothFill = memo<IconProps>(themed(Icon))

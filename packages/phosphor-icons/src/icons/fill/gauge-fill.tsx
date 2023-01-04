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
      <_Path d="M240,160v24a16,16,0,0,1-16,16H115.5a4,4,0,0,1-3.2-6.4L178,108a8.2,8.2,0,0,0-1.1-11.3A7.9,7.9,0,0,0,165.5,98L88.4,198.4a3.8,3.8,0,0,1-3.1,1.6H32a16,16,0,0,1-16-16V161.1a116.1,116.1,0,0,1,2.2-22.2L40.9,145l2.1.2a8,8,0,0,0,7.8-6.2,8.1,8.1,0,0,0-6-9.6l-22.4-6C37,82,74.9,51.5,120,48.3V71.7a8.2,8.2,0,0,0,7.5,8.3,8,8,0,0,0,8.5-8V48.3a111.5,111.5,0,0,1,71.1,32.4,112.7,112.7,0,0,1,26.8,42.6l-22.7,6.1a8.1,8.1,0,0,0-6,9.6,8,8,0,0,0,7.8,6.2l2.1-.2,22.9-6.2A114.5,114.5,0,0,1,240,160Z" />
    </_Svg>
  )
}

Icon.displayName = 'GaugeFill'

export const GaugeFill = memo<IconProps>(themed(Icon))

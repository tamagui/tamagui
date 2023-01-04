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
      <_Path d="M237.7,77.7,203.3,112l26.4,26.3a8.1,8.1,0,0,1,0,11.4,8.2,8.2,0,0,1-11.4,0l-6.3-6.4L160.3,195a40.1,40.1,0,0,1-56.6,0L88,179.3,37.7,229.7a8.2,8.2,0,0,1-11.4,0,8.1,8.1,0,0,1,0-11.4L76.7,168,61,152.3a40.1,40.1,0,0,1,0-56.6L112.7,44l-6.4-6.3a8.1,8.1,0,0,1,11.4-11.4L144,52.7l34.3-34.4a8.1,8.1,0,0,1,11.4,11.4L155.3,64,192,100.7l34.3-34.4a8.1,8.1,0,0,1,11.4,11.4Z" />
    </_Svg>
  )
}

Icon.displayName = 'PlugFill'

export const PlugFill = memo<IconProps>(themed(Icon))

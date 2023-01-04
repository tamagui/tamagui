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
      <_Path d="M168,224a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h64A8,8,0,0,1,168,224Zm52.9-32a15.9,15.9,0,0,1-13.9,8H49a15.9,15.9,0,0,1-13.9-8,16.2,16.2,0,0,1,.1-16.1c5.9-10.2,13-29.6,13-63.9v-8A79.9,79.9,0,0,1,128,24h.6c43.7.3,79.2,36.6,79.2,80.9V112c0,34.3,7.1,53.7,13,63.9A16.2,16.2,0,0,1,220.9,192ZM156,144a8,8,0,0,0-8-8H125.1l29-34.9a7.8,7.8,0,0,0,1.1-8.5A7.9,7.9,0,0,0,148,88H108a8,8,0,0,0,0,16h22.9l-29,34.9a7.8,7.8,0,0,0-1.1,8.5A7.9,7.9,0,0,0,108,152h40A8,8,0,0,0,156,144Z" />
    </_Svg>
  )
}

Icon.displayName = 'BellSimpleZFill'

export const BellSimpleZFill = memo<IconProps>(themed(Icon))

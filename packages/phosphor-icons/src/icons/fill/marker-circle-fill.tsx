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
      <_Path d="M201.5,54.5a103.8,103.8,0,0,0-147,0,103.8,103.8,0,0,0,0,147,103.8,103.8,0,0,0,147,0,103.8,103.8,0,0,0,0-147ZM88,206.4V176h80v30.4A88.8,88.8,0,0,1,88,206.4ZM104,136h48v24H104Zm86.2,54.2c-2,2-4.1,3.9-6.2,5.7V176a16,16,0,0,0-16-16V136a16,16,0,0,0-13.7-15.8L143.6,73.3a16,16,0,0,0-31.2,0l-10.7,46.9A16,16,0,0,0,88,136v24a16,16,0,0,0-16,16v19.9c-2.1-1.8-4.2-3.7-6.2-5.7a88,88,0,1,1,124.4,0Z" />
    </_Svg>
  )
}

Icon.displayName = 'MarkerCircleFill'

export const MarkerCircleFill = memo<IconProps>(themed(Icon))

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
      <_Path d="M235.7,136.9l-42.7,64h0a15.9,15.9,0,0,1-13.3,7.1H24a7.8,7.8,0,0,1-7-4.2,8,8,0,0,1,.3-8.2L62.4,128,17.3,60.4a8,8,0,0,1-.3-8.2A7.8,7.8,0,0,1,24,48H179.7A15.9,15.9,0,0,1,193,55.1l42.7,64A16,16,0,0,1,235.7,136.9Z" />
    </_Svg>
  )
}

Icon.displayName = 'TagChevronFill'

export const TagChevronFill = memo<IconProps>(themed(Icon))

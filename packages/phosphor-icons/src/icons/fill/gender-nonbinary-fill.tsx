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
      <_Path d="M136,88.4V59l23.3,15.6a7.2,7.2,0,0,0,4.4,1.4,8,8,0,0,0,4.5-14.6L142.3,44l25.9-17.4a8,8,0,1,0-8.9-13.2L128,34.4l-31.3-21a8,8,0,1,0-8.9,13.2L113.7,44,87.8,61.4A8,8,0,0,0,92.3,76a7.2,7.2,0,0,0,4.4-1.4L120,59V88.4a76,76,0,1,0,16,0ZM128,224a60,60,0,1,1,60-60A60,60,0,0,1,128,224Z" />
    </_Svg>
  )
}

Icon.displayName = 'GenderNonbinaryFill'

export const GenderNonbinaryFill = memo<IconProps>(themed(Icon))

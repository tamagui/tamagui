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
      <_Path d="M213.7,82.3l-56-56A8.1,8.1,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8.1,8.1,0,0,0,213.7,82.3Zm-104,88a8.1,8.1,0,0,1,0,11.4,8.2,8.2,0,0,1-11.4,0l-24-24a8.1,8.1,0,0,1,0-11.4l24-24a8.1,8.1,0,0,1,11.4,11.4L91.3,152Zm72-12.6-24,24a8.2,8.2,0,0,1-11.4,0,8.1,8.1,0,0,1,0-11.4L164.7,152l-18.4-18.3a8.1,8.1,0,0,1,11.4-11.4l24,24A8.1,8.1,0,0,1,181.7,157.7ZM152,88V44l44,44Z" />
    </_Svg>
  )
}

Icon.displayName = 'FileCodeFill'

export const FileCodeFill = memo<IconProps>(themed(Icon))

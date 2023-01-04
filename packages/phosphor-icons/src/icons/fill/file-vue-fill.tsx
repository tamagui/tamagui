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
      <_Path d="M188,176v8h16a8,8,0,0,1,0,16H188v8h20a8,8,0,0,1,0,16H180a8,8,0,0,1-8-8V168a8,8,0,0,1,8-8h28a8,8,0,0,1,0,16ZM87.1,160.6a8,8,0,0,0-10.5,4.3L64,195.2,51.4,164.9a8,8,0,0,0-14.8,6.2l20,48a8,8,0,0,0,14.8,0l20-48A8,8,0,0,0,87.1,160.6ZM148,160a8,8,0,0,0-8,8v30a10,10,0,0,1-20,0V168a8,8,0,0,0-16,0v30a26,26,0,0,0,52,0V168A8,8,0,0,0,148,160Zm68-72v40a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V40A16,16,0,0,1,56,24h96a8.1,8.1,0,0,1,5.7,2.3l56,56A8.1,8.1,0,0,1,216,88Zm-20,0L152,44V88Z" />
    </_Svg>
  )
}

Icon.displayName = 'FileVueFill'

export const FileVueFill = memo<IconProps>(themed(Icon))
